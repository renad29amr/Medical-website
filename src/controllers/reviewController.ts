import { Request, Response } from "express";
import reviewService from "../services/reviewService";

class ReviewController {
  async createReview(req: Request, res: Response) {
    try {
      const patientId = req.user!.id;
      const { appointment, rating, comment } = req.body;

      const review = await reviewService.createReview({
        patientId,
        appointmentId: appointment,
        rating,
        comment,
      });

      return res.status(201).json({
        success: true,
        message: "Review submitted successfully",
        review,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to submit review",
      });
    }
  }

  async getDoctorReviews(req: Request, res: Response) {
    try {
      const doctorId = req.params.doctorId as string;
      const { page, limit } = req.query;

      const result = await reviewService.getDoctorReviews(doctorId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch reviews",
      });
    }
  }

  async getMyReviews(req: Request, res: Response) {
    try {
      const patientId = req.user!.id;
      const reviews = await reviewService.getMyReviews(patientId);

      return res.status(200).json({
        success: true,
        count: reviews.length,
        reviews,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch your reviews",
      });
    }
  }

  async updateReview(req: Request, res: Response) {
    try {
      const patientId = req.user!.id;
      const reviewId = req.params.id as string;
      const { rating, comment } = req.body;

      const review = await reviewService.updateReview(reviewId, patientId, {
        rating,
        comment,
      });

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        review,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update review",
      });
    }
  }

  async deleteReview(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;
      const reviewId = req.params.id as string;

      await reviewService.deleteReview(reviewId, userId, role);

      return res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete review",
      });
    }
  }
}

export default new ReviewController();