import { Request, Response } from "express";
import { DoctorProfile } from "../models/DoctorProfile";

// GET /api/doctors
export const getAllDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await DoctorProfile.find().populate("user", "fullName email");
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors.", error });
  }
};

// GET /api/doctors/:id
export const getDoctorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctor = await DoctorProfile.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!doctor) {
      res.status(404).json({ message: "Doctor not found." });
      return;
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctor.", error });
  }
};

// PUT /api/doctors/profile
export const updateOwnProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { specialty, experience, clinicAddress, consultationFee, availabilityStatus } =
      req.body;

    const updatedDoctor = await DoctorProfile.findOneAndUpdate(
      { user: req.user!.id }, // find the profile belonging to the logged-in user
      { specialty, experience, clinicAddress, consultationFee, availabilityStatus },
      { new: true, runValidators: true } // return updated doc + re-check schema rules
    );

    if (!updatedDoctor) {
      res.status(404).json({ message: "Doctor profile not found for this user." });
      return;
    }

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ message: "Failed to update profile.", error });
  }
};


export const searchDoctors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const name = req.query.name as string | undefined;
    const specialty = req.query.specialty as string | undefined;
    const clinicAddress = req.query.clinicAddress as string | undefined;

    const query: Record<string, any> = {};

    // Search by specialty
    if (specialty) {
      query.specialty = {
        $regex: specialty.trim(),
        $options: "i",
      };
    }

    // Search by clinic address
    if (clinicAddress) {
      query.clinicAddress = {
        $regex: clinicAddress.trim(),
        $options: "i",
      };
    }

    let doctors = await DoctorProfile.find(query).populate({
      path: "user",
      select: "fullName email",
    });

    // Search by doctor's name
    if (name) {
      const searchName = name.trim().toLowerCase();

      doctors = doctors.filter((doctor: any) =>
        doctor.user?.fullName?.toLowerCase().includes(searchName)
      );
    }

    res.status(200).json({
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    })
  }
};
