import { Router } from "express";
import appointmentController from "../controllers/appointmentController";

import {
  validateCreateAppointment,
} from "../validators/appointmentValidator";

import {
  authenticate,
  authorizeRoles,
} from "../middleware/authMiddleware";

const router = Router();

//Create appointment
router.post(
  "/",
  authenticate,
  authorizeRoles("Patient"),
  validateCreateAppointment,
  appointmentController.createAppointment
);

//Get patient appointments
router.get(
  "/my",
  authenticate,
  authorizeRoles("Patient"),
  appointmentController.getAppointments
);

//Get doctor's appointments
router.get(
  "/doctor",
  authenticate,
  authorizeRoles("Doctor"),
  appointmentController.getDoctorAppointments
);

//Confirm appointment
router.patch(
  "/:id/confirm",
  authenticate,
  authorizeRoles("Doctor"),
  appointmentController.confirmAppointment
);

//Complete appointment
router.patch(
  "/:id/complete",
  authenticate,
  authorizeRoles("Doctor"),
  appointmentController.completeAppointment
);


//Cancel appointment
router.patch(
  "/:id/cancel",
  authenticate,
  authorizeRoles("Patient", "Doctor"),
  appointmentController.cancelAppointment
);

export default router;