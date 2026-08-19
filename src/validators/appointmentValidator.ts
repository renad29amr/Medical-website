import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateCreateAppointment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { doctor, appointmentDate, timeSlot, notes } = req.body;

  // Required 
  if (!doctor || !appointmentDate || !timeSlot) {
    return res.status(400).json({
      success: false,
      message: "Doctor, appointment date and time slot are required",
    });
  }

  // Validate doctor ID
  if (!mongoose.Types.ObjectId.isValid(doctor)) {
    return res.status(400).json({
      success: false,
      message: "Invalid doctor ID",
    });
  }

  // Validate date
  const date = new Date(appointmentDate);

  if (isNaN(date.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date",
    });
  }

  // Appointment must be in the future
  if (date <= new Date()) {
    return res.status(400).json({
      success: false,
      message: " Invalid date",
    });
  }

  // time slot
  if (typeof timeSlot !== "string" || timeSlot.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Valid time slot is required",
    });
  }

  // notes
  if (notes !== undefined && typeof notes !== "string") {
    return res.status(400).json({
      success: false,
      message: "Notes must be a string",
    });
  }

  next();
};