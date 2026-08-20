import { NextFunction, Request, Response } from "express";
import { UserRole } from "../models/User";

// export const registerValidator = (req: Request, res: Response, next: NextFunction) => {
//   const { fullName, email, password, role } = req.body;

//   if (!fullName || !email || !password || !role) {
//     return res.status(400).json({ success: false, message: "Please fill in all required fields" });
//   }

//    // Specialty is required only for doctors
//   if (role === UserRole.DOCTOR && !specialty) {
//     return res.status(400).json({
//       success: false,
//       message: "Specialty is required for doctors",
//     });
//   }

//   if (typeof fullName !== "string" || fullName.trim().length < 3 || fullName.trim().length > 50) {
//     return res.status(400).json({ success: false, message: "Full name must be a string between 3 and 50 characters long" });
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (typeof email !== "string" || !emailRegex.test(email)) {
//     return res.status(400).json({ success: false, message: "Please provide a valid email" });
//   }

//   if (typeof password !== "string" || password.length < 6) {
//     return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
//   }

//   if (role !== UserRole.PATIENT && role !== UserRole.DOCTOR) {
//     return res.status(400).json({ success: false, message: "Role must be either 'patient' or 'doctor'" });
//   }

//   next();
// };

// export const registerAdminValidator = (req: Request, res: Response, next: NextFunction) => {
//   const { fullName, email, password } = req.body;

//   if (!fullName || !email || !password) {
//     return res.status(400).json({ success: false, message: "Please fill in all required fields" });
//   }

//   if (typeof fullName !== "string" || fullName.trim().length < 3 || fullName.trim().length > 50) {
//     return res.status(400).json({ success: false, message: "Full name must be a string between 3 and 50 characters long" });
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (typeof email !== "string" || !emailRegex.test(email)) {
//     return res.status(400).json({ success: false, message: "Please provide a valid email" });
//   }

//   if (typeof password !== "string" || password.length < 6) {
//     return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
//   }

//   next();
// };

// export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ success: false, message: "Email and password are required" });
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (typeof email !== "string" || !emailRegex.test(email)) {
//     return res.status(400).json({ success: false, message: "Please provide a valid email" });
//   }

//   next();
// };

export const registerValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    fullName,
    email,
    password,
    role,
    specialty,
    experience,
    clinicAddress,
    consultationFee,
  } = req.body;

  // Common required fields
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Full name, email, password and role are required",
    });
  }

  // Full name
  if (
    typeof fullName !== "string" ||
    fullName.trim().length < 3 ||
    fullName.trim().length > 50
  ) {
    return res.status(400).json({
      success: false,
      message: "Full name must be between 3 and 50 characters",
    });
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email",
    });
  }

  // Password
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  // Role
  if (
    role !== UserRole.PATIENT &&
    role !== UserRole.DOCTOR
  ) {
    return res.status(400).json({
      success: false,
      message: "Role must be either 'patient' or 'doctor'",
    });
  }

  // =========================
  // Doctor required fields
  // =========================
  if (role === UserRole.DOCTOR) {

    if (
      typeof specialty !== "string" ||
      specialty.trim().length < 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Specialty is required for doctors",
      });
    }

    if (
      experience === undefined ||
      experience === null ||
      experience === "" ||
      typeof experience !== "number" ||
      experience < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid experience is required for doctors",
      });
    }

    if (
      typeof clinicAddress !== "string" ||
      clinicAddress.trim().length < 3
    ) {
      return res.status(400).json({
        success: false,
        message: "Clinic address is required for doctors",
      });
    }

    if (
      consultationFee === undefined ||
      consultationFee === null ||
      consultationFee === "" ||
      typeof consultationFee !== "number" ||
      consultationFee < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid consultation fee is required for doctors",
      });
    }
  }

  next();
};


export const registerAdminValidator = (req: Request, res: Response, next: NextFunction) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: "Please fill in all required fields" });
  }

  if (typeof fullName !== "string" || fullName.trim().length < 3 || fullName.trim().length > 50) {
    return res.status(400).json({ success: false, message: "Full name must be a string between 3 and 50 characters long" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Please provide a valid email" });
  }

  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

  next();
};

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Please provide a valid email" });
  }

  next();
};
