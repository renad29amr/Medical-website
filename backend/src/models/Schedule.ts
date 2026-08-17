import mongoose, { Schema, Document } from "mongoose";

export interface ISchedule extends Document {
    doctor: mongoose.Types.ObjectId;
    day: string;
    availableTimeSlots: string[];
    availability: boolean;
}
const scheduleSchema = new Schema<ISchedule>({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    day: {
        type: String,
        required: true,
    },
    availableTimeSlots: {
        type: [String],
        required: true,
    },
    availability: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
    }
);

export const Schedule = mongoose.model<ISchedule>(
    "Schedule",
    scheduleSchema
);