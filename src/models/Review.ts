import mongoose, { Document, Schema, Types } from "mongoose";

export interface IReview extends Document {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  appointment: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // References DoctorProfile (same convention used by
    // Appointment.doctor and Schedule.doctor throughout the app).
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
    },

    // Ties the review to the specific completed visit that
    // earned it, so we can verify eligibility and prevent
    // a patient from reviewing the same visit twice.
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },

    comment: {
      type: String,
      trim: true,
      maxlength: [1000, "Comment must be at most 1000 characters long"],
    },
  },
  {
    timestamps: true,
  }
);

// Speeds up "get all reviews for a doctor" queries and
// keeps the newest reviews easy to sort.
reviewSchema.index({ doctor: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;