import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User, { UserRole } from "../models/User";
import { DoctorProfile } from "../models/DoctorProfile";
const generateToken = (userId: string, role: UserRole): string => {
  const secretKey = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error("JWT secret is not defined in environment variables");
  }

  return jwt.sign({ userId, role }, secretKey, { expiresIn: "1h" });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
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
    const existingUser = await User.findOne({ email: String(email).toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: "User with this email already exists" });
      return;
    }

    const userRole = role === UserRole.DOCTOR ? UserRole.DOCTOR : UserRole.PATIENT;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email: String(email).toLowerCase(),
      password: hashedPassword,
      role: userRole,
    });

    // Create DoctorProfile if the registered user is a doctor
    if (userRole === UserRole.DOCTOR) {
      await DoctorProfile.create({
        user: newUser._id,
        specialty,
        experience,
        clinicAddress,
        consultationFee,
      });
    }

    const token = generateToken(
      newUser._id.toString(),
      newUser.role
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
