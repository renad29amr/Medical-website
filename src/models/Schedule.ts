import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorProfile",
    required: true,
  },

  day: {
    type: String,
    required: true,
    enum: [
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ],
  },

  availableTimeSlots: [
    {
      start: { type: String, required: true }, 
      end: { type: String, required: true },   
    },
  ],

  availability: {
    type: Boolean,
    default: true,
  },
});

// Prevent duplicate schedules for the same doctor on the same day
scheduleSchema.index(
  { doctor: 1, day: 1 },
  { unique: true }
);

export const Schedule = mongoose.model("Schedule", scheduleSchema);