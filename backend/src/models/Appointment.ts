import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    appointmentDate: Date;
    timeSlot: string;
    status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
    notes?: string;

}

const appointmentSchema = new Schema<IAppointment>(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        doctor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        appointmentDate: {
            type: Date,
            required: true,
        },

        timeSlot: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
            default: "Pending",
        },

        notes: {
            type: String,
            required: false,
            trim: true,
        },
    },

    {
        timestamps: true,
    }

)

export const Appointment = mongoose.model<IAppointment>(
    "Appointment",
    appointmentSchema
);