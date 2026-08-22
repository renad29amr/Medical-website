import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateCreateReview = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { appointment, rating, comment } = req.body;

  // Required
  if (!appointment || rating === undefined || rating === null) {
    return res.status(400).json({
      success: false,
      message: "Appointment and rating are required",
    });
  }

  // Validate appointment ID
  if (!mongoose.Types.ObjectId.isValid(appointment)) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment ID",
    });
  }

  // Validate rating
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return res.status(400).json({
      success: false,
      message: "Rating must be an integer between 1 and 5",
    });
  }

  // Validate comment
  if (comment !== undefined && typeof comment !== "string") {
    return res.status(400).json({
      success: false,
      message: "Comment must be a string",
    });
  }

  if (typeof comment === "string" && comment.length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Comment must be at most 1000 characters long",
    });
  }

  next();
};

export const validateUpdateReview = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { rating, comment } = req.body;

  if (rating === undefined && comment === undefined) {
    return res.status(400).json({
      success: false,
      message: "At least one of rating or comment is required",
    });
  }

  if (rating !== undefined) {
    if (
      typeof rating !== "number" ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }
  }

  if (comment !== undefined) {
    if (typeof comment !== "string") {
      return res.status(400).json({
        success: false,
        message: "Comment must be a string",
      });
    }

    if (comment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment must be at most 1000 characters long",
      });
    }
  }

  next();
};