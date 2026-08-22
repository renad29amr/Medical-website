import mongoose from "mongoose";
import Review from "../models/Review";
import Appointment, { AppointmentStatus } from "../models/Appointment";
import { DoctorProfile } from "../models/DoctorProfile";

interface CreateReviewData {
  patientId: string;
  appointmentId: string;
  rating: number;
  comment?: string;
}

interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
}

class ReviewService {
  async createReview(data: CreateReviewData) {
    const { patientId, appointmentId, rating, comment } = data;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      throw new Error("Invalid appointment ID");
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.patient.toString() !== patientId) {
      throw new Error("You can only review your own appointments");
    }

    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new Error("You can only review completed appointments");
    }

    const existingReview = await Review.findOne({
      appointment: appointmentId,
    });

    if (existingReview) {
      throw new Error("You have already reviewed this appointment");
    }

    const review = await Review.create({
      patient: patientId,
      doctor: appointment.doctor,
      appointment: appointmentId,
      rating,
      comment,
    });

    await this.recalculateDoctorRating(appointment.doctor.toString());

    return review;
  }

  async getDoctorReviews(doctorId: string, options?: PaginationOptions) {
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      throw new Error("Invalid doctor ID");
    }

    const page = options?.page && options.page > 0 ? options.page : 1;
    const limit = options?.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    const [reviews, total, doctorProfile] = await Promise.all([
      Review.find({ doctor: doctorId })
        .populate("patient", "fullName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ doctor: doctorId }),
      DoctorProfile.findById(doctorId).select("ratingAverage ratingCount"),
    ]);

    return {
      reviews,
      total,
      page,
      limit,
      ratingAverage: doctorProfile?.ratingAverage ?? 0,
      ratingCount: doctorProfile?.ratingCount ?? 0,
    };
  }

  async getMyReviews(patientId: string) {
    return Review.find({ patient: patientId })
      .populate({
        path: "doctor",
        select: "specialty clinicAddress",
        populate: { path: "user", select: "fullName" },
      })
      .sort({ createdAt: -1 });
  }

  async updateReview(
    reviewId: string,
    patientId: string,
    data: UpdateReviewData
  ) {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new Error("Invalid review ID");
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.patient.toString() !== patientId) {
      throw new Error("You can only edit your own review");
    }

    if (data.rating !== undefined) {
      review.rating = data.rating;
    }

    if (data.comment !== undefined) {
      review.comment = data.comment;
    }

    await review.save();

    await this.recalculateDoctorRating(review.doctor.toString());

    return review;
  }

  async deleteReview(reviewId: string, userId: string, role: string) {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new Error("Invalid review ID");
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    if (role !== "admin" && review.patient.toString() !== userId) {
      throw new Error("You can only delete your own review");
    }

    const doctorId = review.doctor.toString();

    await review.deleteOne();

    await this.recalculateDoctorRating(doctorId);

    return true;
  }

  // Recomputes ratingAverage/ratingCount on the DoctorProfile
  // from scratch based on current Review documents, so the
  // aggregate value can never drift out of sync.
  private async recalculateDoctorRating(doctorId: string) {
    const stats = await Review.aggregate([
      {
        $match: { doctor: new mongoose.Types.ObjectId(doctorId) },
      },
      {
        $group: {
          _id: "$doctor",
          averageRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const ratingAverage = stats[0]
      ? Math.round(stats[0].averageRating * 10) / 10
      : 0;
    const ratingCount = stats[0] ? stats[0].count : 0;

    await DoctorProfile.findByIdAndUpdate(doctorId, {
      ratingAverage,
      ratingCount,
    });
  }
}

export default new ReviewService();