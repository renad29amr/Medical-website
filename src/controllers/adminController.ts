import { Request, Response } from "express";
import { User } from "../models/User";
import { Appointment } from "../models/Appointment";
import { DoctorProfile } from "../models/DoctorProfile";



// Get all Users
export const getAllUsers = async (
    req: Request,
    res: Response
) => {
    try {
        const users = await User.find.select("-password"); //Don't include the password field (hashed password)
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
        const doctors = await DoctorProfile.find.select("-password");
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
        const doctor = await DoctorProfile.findOne({
            _id: id
        });
        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found",
            });
        }
        await User.findByIdAndDelete(id);
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
            .populate("patient", "name email phone")
            .populate("doctor", "name email specialization");

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


