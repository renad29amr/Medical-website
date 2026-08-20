import { GoogleGenerativeAI } from "@google/generative-ai";
import { DoctorProfile } from "../models/DoctorProfile";
import {Appointment} from "../models/Appointment";
import { env } from "../config/env";


const genAI = env.geminiApiKey ? new GoogleGenerativeAI(env.geminiApiKey) : null;

const model = genAI ? genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
}) : null;


// =====================================================
// TYPES
// =====================================================

interface ChatResult {
    type: "general" | "assessment" | "precare" | "emergency";
    message: string;
    data?: any;
}

interface SymptomAnalysis {
    possibleConditions: string[];
    recommendedSpecialization: string | null;
    urgency: "low" | "medium" | "high" | "emergency";
    explanation: string;
    followUpQuestions: string[];
}

interface PreCareResult {
    chiefComplaint: string;
    symptoms: string[];
    duration: string;
    severity: string;
    triggers: string[];
    associatedSymptoms: string[];
    medications: string[];
    previousConditions: string[];
    allergies: string[];
    timeline: {
        date: string;
        event: string;
    }[];
    questionsForDoctor: string[];
}


// =====================================================
// GET AVAILABLE SPECIALIZATIONS
// =====================================================

const getAvailableSpecializations = async (): Promise<string[]> => {

    const doctors = await DoctorProfile
        .find()
        .select("specialty");

    const specializations = [
        ...new Set(
            doctors
                .map((doctor: any) => doctor.specialty)
                .filter(Boolean)
        ),
    ];

    return specializations;
};


// =====================================================
// GENERAL CHATBOT
// =====================================================

export const generalChat = async (
    message: string
): Promise<ChatResult> => {

    const prompt = `
You are a helpful assistant for a medical appointment website.

You can help users with:

- How to book appointments
- How to cancel appointments
- How to find doctors
- Doctor specializations
- General health information
- How the website works

You may provide general health information.

IMPORTANT:
- Do not claim to provide a definitive medical diagnosis.
- Do not prescribe medication.
- Do not tell the user to stop taking prescribed medication.
- If the user describes an emergency, clearly tell them to seek immediate medical care.
- Keep responses concise and understandable.

User message:

"${message}"
`;

    if (!model) {
        return {
            type: "general",
            message: "Chatbot is unavailable until GEMINI_API_KEY is configured.",
        };
    }

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return {
        type: "general",
        message: response,
    };
};


// =====================================================
// SYMPTOM ASSESSMENT
// =====================================================

export const analyzeSymptoms = async (
    message: string
): Promise<SymptomAnalysis> => {

    const specializations =
        await getAvailableSpecializations();

    const prompt = `
You are a medical symptom assessment assistant.

Analyze the symptoms described by the patient.

IMPORTANT:

- Do NOT provide a definitive diagnosis.
- Return POSSIBLE conditions only.
- Do NOT prescribe medication.
- Identify emergency situations.
- Recommend a specialization ONLY from the provided list.
- If none is appropriate, return null.
- Ask useful follow-up questions if information is missing.

Available specializations:

${specializations.join(", ")}

Patient message:

"${message}"

Return ONLY valid JSON.

Format:

{
    "possibleConditions": [
        "condition 1",
        "condition 2"
    ],
    "recommendedSpecialization": "specialization or null",
    "urgency": "low",
    "explanation": "short explanation",
    "followUpQuestions": [
        "question 1",
        "question 2"
    ]
}

Urgency must be exactly one of:

low
medium
high
emergency
`;

    if (!model) {
        return {
            possibleConditions: [],
            recommendedSpecialization: null,
            urgency: "low",
            explanation: "Chatbot is unavailable until GEMINI_API_KEY is configured.",
            followUpQuestions: [],
        };
    }

    const result = await model.generateContent(prompt);

    const text = result.response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(text);
};


// =====================================================
// FIND DOCTORS
// =====================================================

const findDoctors = async (
    specialization: string
) => {

    if (!specialization) {
        return [];
    }

    const doctors = await DoctorProfile.find({
        specialty: {
            $regex: new RegExp(
                `^${specialization}$`,
                "i"
            ),
        },
    });

    return doctors;
};


// =====================================================
// DOCTOR FIT SCORE
// =====================================================

const calculateDoctorScore = (
    doctor: any
): {
    score: number;
    reasons: string[];
} => {

    let score = 0;

    const reasons: string[] = [];


    // ---------------------------------------------
    // SPECIALIZATION
    // ---------------------------------------------

    score += 50;

    reasons.push(
        "The doctor's specialization matches the recommended specialty."
    );


    // ---------------------------------------------
    // EXPERIENCE
    // ---------------------------------------------

    if (
        doctor.experience !== undefined
    ) {

        if (doctor.experience >= 10) {

            score += 20;

            reasons.push(
                "The doctor has extensive experience."
            );

        } else if (
            doctor.experience >= 5
        ) {

            score += 15;

            reasons.push(
                "The doctor has several years of experience."
            );

        } else {

            score += 10;
        }
    }


    // ---------------------------------------------
    // RATING
    // ---------------------------------------------

    if (
        doctor.rating !== undefined
    ) {

        if (doctor.rating >= 4.5) {

            score += 20;

            reasons.push(
                "The doctor has a high patient rating."
            );

        } else if (
            doctor.rating >= 4
        ) {

            score += 15;

            reasons.push(
                "The doctor has good patient ratings."
            );

        } else {

            score += 10;
        }
    }


    return {
        score: Math.min(score, 100),
        reasons,
    };
};


// =====================================================
// SYMPTOM ASSESSMENT + DOCTOR RECOMMENDATION
// =====================================================

export const symptomAssessment = async (
    message: string
): Promise<ChatResult> => {

    const analysis =
        await analyzeSymptoms(message);


    // ---------------------------------------------
    // EMERGENCY
    // ---------------------------------------------

    if (
        analysis.urgency === "emergency"
    ) {

        return {
            type: "emergency",

            message:
                "Your symptoms may require immediate medical attention. Please contact your local emergency service or go to the nearest emergency department.",

            data: {
                analysis,
                doctors: [],
            },
        };
    }


    // ---------------------------------------------
    // NO SPECIALIZATION
    // ---------------------------------------------

    if (
        !analysis.recommendedSpecialization
    ) {

        return {
            type: "assessment",

            message:
                "I couldn't identify a suitable specialist currently available on our platform.",

            data: {
                analysis,
                doctors: [],
            },
        };
    }


    // ---------------------------------------------
    // FIND REAL DOCTORS
    // ---------------------------------------------

    const doctors =
        await findDoctors(
            analysis.recommendedSpecialization
        );


    // ---------------------------------------------
    // NO DOCTORS
    // ---------------------------------------------

    if (doctors.length === 0) {

        return {
            type: "assessment",

            message:
                `The appropriate specialty appears to be ${analysis.recommendedSpecialization}, but we currently don't have a doctor with this specialization.`,

            data: {
                analysis,
                doctors: [],
            },
        };
    }


    // ---------------------------------------------
    // SCORE DOCTORS
    // ---------------------------------------------

    const rankedDoctors =
        doctors.map((doctor: any) => {

            const result =
                calculateDoctorScore(doctor);

            return {
                doctor,
                fitScore: result.score,
                reasons: result.reasons,
            };
        });


    rankedDoctors.sort(
        (a, b) =>
            b.fitScore - a.fitScore
    );


    return {
        type: "assessment",

        message:
            `Based on the information you provided, ${analysis.recommendedSpecialization} may be an appropriate specialty to discuss your symptoms with.`,

        data: {
            analysis,

            doctors:
                rankedDoctors.slice(0, 3),

            disclaimer:
                "This is a symptom assessment, not a medical diagnosis.",
        },
    };
};


// =====================================================
// SMART PRECARE
// =====================================================

export const generatePreCare = async (
    message: string
): Promise<PreCareResult> => {

    const prompt = `
You are an AI pre-appointment assistant.

Your job is to organize information provided by a patient
before a medical appointment.

Do NOT diagnose the patient.

Extract and organize the information into a structured
patient brief that a doctor can review.

Patient message:

"${message}"

Return ONLY valid JSON:

{
    "chiefComplaint": "",
    "symptoms": [],
    "duration": "",
    "severity": "",
    "triggers": [],
    "associatedSymptoms": [],
    "medications": [],
    "previousConditions": [],
    "allergies": [],
    "timeline": [
        {
            "date": "",
            "event": ""
        }
    ],
    "questionsForDoctor": []
}
`;

    if (!model) {
        return {
            chiefComplaint: "",
            symptoms: [],
            duration: "",
            severity: "",
            triggers: [],
            associatedSymptoms: [],
            medications: [],
            previousConditions: [],
            allergies: [],
            timeline: [],
            questionsForDoctor: [],
        };
    }

    const result = await model.generateContent(prompt);

    const text = result.response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(text);
};

// =====================================================
// CARE CONTINUITY
// =====================================================

export const getPatientHistorySummary = async (
    patientId: string
) => {

    const appointments =
        await Appointment.find({
            patient: patientId,
        })
            .populate(
                "doctor",
                "fullName specialty"
            )
            .sort({
                appointmentDate: -1,
            });


    if (
        appointments.length === 0
    ) {

        return {
            message:
                "No previous appointments were found.",
            timeline: [],
        };
    }


    const history = appointments.map(
        (appointment: any) => ({
            appointmentId:
                appointment._id,

            date:
                appointment.appointmentDate,

            doctor:
                appointment.doctor,

            status:
                appointment.status,

            notes:
                appointment.notes || "",
        })
    );


    return {
        message:
            "Patient medical appointment history",

        timeline:
            history,
    };
};


// =====================================================
// MAIN CHATBOT FUNCTION
// =====================================================

export const getChatbotResponse = async (
    type: string,
    message: string,
    patientId?: string
) => {

    switch (type) {

        case "general":

            return await generalChat(
                message
            );


        case "assessment":

            return await symptomAssessment(
                message
            );


        case "precare":

            return await generatePreCare(
                message
            );


        case "history":

            if (!patientId) {

                throw new Error(
                    "Patient ID is required."
                );
            }

            return await getPatientHistorySummary(
                patientId
            );


        default:

            return await generalChat(
                message
            );
    }
};