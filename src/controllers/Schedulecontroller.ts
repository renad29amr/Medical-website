import { Request, Response } from "express";
import { Schedule } from "../models/Schedule";
import { DoctorProfile } from "../models/DoctorProfile";

// POST /api/schedules
export const createSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorProfile = await DoctorProfile.findOne({ user: req.user!.id });

    if (!doctorProfile) {
      res.status(404).json({ message: "No doctor profile found for this user." });
      return;
    }

    const { day, availableTimeSlots, availability } = req.body;

    const schedule = await Schedule.create({
      doctor: doctorProfile._id, 
      day,
      availableTimeSlots,
      availability,
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ message: "Failed to create schedule.", error });
  }
};

// GET /api/schedules
export const getAllSchedules = async (req: Request, res: Response): Promise<void> => {
  try {
    const schedules = await Schedule.find().populate("doctor", "specialty clinicAddress user");
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch schedules.", error });
  }
};


async function findOwnedSchedule(req: Request, res: Response) {
  const schedule = await Schedule.findById(req.params.id).populate("doctor", "user");

  if (!schedule) {
    res.status(404).json({ message: "Schedule not found." });
    return null;
  }

  const ownerUserId = (schedule.doctor as any).user.toString();

  if (ownerUserId !== req.user!.id) {
    res.status(403).json({ message: "You can only modify your own schedule." });
    return null;
  }

  return schedule;
}

// PUT /api/schedules/:id
export const updateSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const schedule = await findOwnedSchedule(req, res);
    if (!schedule) return; 

    const { day, availableTimeSlots, availability } = req.body;

    schedule.day = day ?? schedule.day;
    schedule.availableTimeSlots = availableTimeSlots ?? schedule.availableTimeSlots;
    schedule.availability = availability ?? schedule.availability;

    await schedule.save({ validateBeforeSave: true });

    res.status(200).json(schedule);
  } catch (error) {
    res.status(400).json({ message: "Failed to update schedule.", error });
  }
};

// DELETE /api/schedules/:id
export const deleteSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const schedule = await findOwnedSchedule(req, res);
    if (!schedule) return; 

    await schedule.deleteOne();

    res.status(200).json({ message: "Schedule deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete schedule.", error });
  }
};