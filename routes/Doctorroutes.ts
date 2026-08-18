import { Router } from "express";
import { getAllDoctors, getDoctorById, updateOwnProfile } from "../controllers/Doctorcontroller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.get("/", getAllDoctors);

router.get("/:id", getDoctorById);

router.put("/profile", protect, authorize("Doctor"), updateOwnProfile);

export default router;