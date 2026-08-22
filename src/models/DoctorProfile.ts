import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema({
  // Links this profile to the actual account in the User collection
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, 
  },

  specialty: {
    type: String,
    required: true,
  },

  experience: {
    type: Number,
    required: true,
    min: 0, 
  },

  clinicAddress: {
    type: String,
    required: true,
  },

  consultationFee: {
    type: Number,
    required: true,
    min: 0, 
  },

  availabilityStatus: {
    type: String,
    enum: ["available", "unavailable"],
    default: "available",
  },
  ratingAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
 
  ratingCount: {
    type: Number,
    default: 0,
    min: 0,
  },
});




export const DoctorProfile = mongoose.model("DoctorProfile", doctorProfileSchema);