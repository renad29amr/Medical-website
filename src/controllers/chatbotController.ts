import { Request, Response } from "express";
import {
    getChatbotResponse,
} from "../services/chatbotService";

export const chat = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            type,
            message,
            patientId,
        } = req.body;


        if (
            !message &&
            type !== "history"
        ) {

            return res.status(400).json({
                message:
                    "Message is required.",
            });
        }


        const result =
            await getChatbotResponse(
                type || "general",
                message || "",
                patientId
            );


        return res.status(200).json(
            result
        );

    } catch (error) {

        console.error(
            "Chatbot error:",
            error
        );

        return res.status(500).json({
            message:
                "Something went wrong with the chatbot.",
        });
    }
};