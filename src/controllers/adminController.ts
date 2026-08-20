import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { UserRole } from "../models/User";
import { Appointment } from "../models/Appointment";
import { DoctorProfile } from "../models/DoctorProfile";



// Register a new Admin
// Reachable only via the adminRegistrationGuard middleware, which allows
// either: (a) a one-time bootstrap using ADMIN_SETUP_KEY when no admin
// exists yet, or (b) an already-authenticated admin creating another one.
export const registerAdmin = async (
    req: Request,
    res: Response
) => {
    try {
        const { fullName, email, password } = req.body;

        const existingUser = await User.findOne({ email: String(email).toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await User.create({
            fullName,
            email: String(email).toLowerCase(),
            password: hashedPassword,
            role: UserRole.ADMIN,
        });

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: {
                id: newAdmin._id,
                fullName: newAdmin.fullName,
                email: newAdmin.email,
                role: newAdmin.role,
            },
        });
    }
    catch (error) {
        console.error("Error during admin registration:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get all Users
export const getAllUsers = async (
    req: Request,
    res: Response
) => {
    try {
        const users = await User.find().select("-password"); //Don't include the password field (hashed password)
        res.status(200).json({
            message: "Users retrived successfully",
            users,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to retrieve",
        });
    }

};

//Get all Doctors
export const getAllDoctors = async (
    req: Request,
    res: Response
) => {
    try {
        const doctors = await DoctorProfile.find().populate("user", "fullName email role");
        res.status(200).json({
            message: "Doctors retrieved successfully",
            doctors,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to retrieve doctors",
        });
    }
};


// Delete Doctor
export const deleteDoctor = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        const doctorProfile = await DoctorProfile.findById(id) || await DoctorProfile.findOne({ user: id });
        if (!doctorProfile) {
            return res.status(404).json({
                message: "Doctor not found",
            });
        }
        const userId = doctorProfile.user.toString();
        await Appointment.deleteMany({ doctor: userId });
        await DoctorProfile.deleteOne({ _id: doctorProfile._id });
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            message: "Doctor deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to delete doctor",
        });
    }
};

//Get All Appointments
export const getAllAppointments = async (
    req: Request,
    res: Response
) => {
    try {
        const appointments = await Appointment.find()
            .populate("patient", "fullName email role")
            .populate("doctor", "fullName email role");

        res.status(200).json({
            message: "Appointments retrieved successfully",
            appointments,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to retrieve appointments",
        });
    }
};


