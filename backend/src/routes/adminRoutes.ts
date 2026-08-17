import { Router } from "express";

import {
    getAllUsers,
    getAllDoctors,
    getAllAppointments,
    deleteDoctor,
} from "../controllers/adminController";

// role === "Admin"
import{
    protect,
    adminOnly,
} from "../middleware/authMiddleware";

const router = Router();

router.use(protect);
router.use(adminOnly);

router.get("/users", getAllUsers);
router.get("/doctors", getAllDoctors);
router.get("/appointments", getAllAppointments);
router.delete("/doctors/:id", deleteDoctor);

export default router;
