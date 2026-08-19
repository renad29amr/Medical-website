import { Router } from "express";
import {
  createSchedule,
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
} from "../controllers/Schedulecontroller";
import { protect, authorize } from "../middleware/auth";

const router = Router();


router.get("/", protect, getAllSchedules);


router.post("/", protect, authorize("Doctor"), createSchedule);


router.put("/:id", protect, authorize("Doctor"), updateSchedule);


router.delete("/:id", protect, authorize("Doctor"), deleteSchedule);

export default router;