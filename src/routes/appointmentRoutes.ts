// import { Router } from "express";
// import appointmentController from "../controllers/appointmentController";
// import { validateCreateAppointment } from "../validators/appointmentValidator";
// import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

// const router = Router();

// router.post("/", authenticate, authorizeRoles("patient"), validateCreateAppointment, appointmentController.createAppointment);
// router.get("/my", authenticate, authorizeRoles("patient"), appointmentController.getAppointments);
// router.get("/doctor", authenticate, authorizeRoles("doctor"), appointmentController.getDoctorAppointments);
// router.patch("/:id/confirm", authenticate, authorizeRoles("doctor"), appointmentController.confirmAppointment);
// router.patch("/:id/complete", authenticate, authorizeRoles("doctor"), appointmentController.completeAppointment);
// router.patch("/:id/cancel", authenticate, authorizeRoles("patient", "doctor"), appointmentController.cancelAppointment);

// export default router;

import { Router } from "express";

import appointmentController from "../controllers/appointmentController";

import { validateCreateAppointment } from "../validators/appointmentValidator";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Book an appointment
 *     description: Allows a patient to book an appointment with a doctor.
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor
 *               - appointmentDate
 *               - timeSlot
 *             properties:
 *               doctor:
 *                 type: string
 *                 description: Doctor Profile ID
 *                 example: 68a123456789abcdef123456
 *               appointmentDate:
 *                 type: string
 *                 format: date
 *                 description: Appointment date. Must be in the future.
 *                 example: 2026-08-25
 *               timeSlot:
 *                 type: string
 *                 description: Appointment time
 *                 example: "10:00"
 *               notes:
 *                 type: string
 *                 description: Optional appointment notes
 *                 example: Regular checkup
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Validation error or invalid appointment
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only patients can book appointments
 */
router.post(
  "/",
  authenticate,
  authorizeRoles("patient"),
  validateCreateAppointment,
  appointmentController.createAppointment
);

/**
 * @swagger
 * /api/appointments/my:
 *   get:
 *     summary: Get patient's appointments
 *     description: Returns only the appointments belonging to the authenticated patient.
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient appointments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only patients can access this endpoint
 */
router.get(
  "/my",
  authenticate,
  authorizeRoles("patient"),
  appointmentController.getAppointments
);



/**
 * @swagger
 * /api/appointments/available-slots:
 *   get:
 *     summary: Get available appointment time slots
 *     description: |
 *       Returns the available time slots for a specific doctor on a specific date.
 *
 *       The doctor must have an active schedule for that day. Time slots that
 *       are already booked by another patient are excluded.
 *
 *       Only authenticated patients can use this endpoint.
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctor
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor Profile ID
 *         example: 6a882d33d19127beffe43d2b
 *
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for which available slots should be returned. The date must be in the future.
 *         example: 2026-08-25
 *
 *     responses:
 *       200:
 *         description: Available time slots retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 doctor:
 *                   type: string
 *                   description: Doctor Profile ID
 *                   example: 6a882d33d19127beffe43d2b
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: 2026-08-25
 *                 day:
 *                   type: string
 *                   example: Tuesday
 *                 availableSlots:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "10:00-11:00"
 *                     - "11:00-12:00"
 *                     - "14:00-15:00"
 *
 *       400:
 *         description: Invalid doctor ID, date, or unavailable schedule
 *
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *
 *       403:
 *         description: Only patients can access available appointment slots
 *
 *       404:
 *         description: Doctor schedule not found
 */
router.get(
  "/available-slots",
  authenticate,
  authorizeRoles("patient"),
  appointmentController.getAvailableTimeSlots
);

/**
 * @swagger
 * /api/appointments/doctor:
 *   get:
 *     summary: Get doctor's appointments
 *     description: Returns only the appointments belonging to the authenticated doctor.
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor appointments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only doctors can access this endpoint
 */
router.get(
  "/doctor",
  authenticate,
  authorizeRoles("doctor"),
  appointmentController.getDoctorAppointments
);

/**
 * @swagger
 * /api/appointments/{id}/confirm:
 *   patch:
 *     summary: Confirm an appointment
 *     description: Allows a doctor to confirm their own pending appointment.
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *         example: 68a123456789abcdef123456
 *     responses:
 *       200:
 *         description: Appointment confirmed successfully
 *       400:
 *         description: Appointment cannot be confirmed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only the appointment's doctor can confirm it
 *       404:
 *         description: Appointment not found
 */
router.patch(
  "/:id/confirm",
  authenticate,
  authorizeRoles("doctor"),
  appointmentController.confirmAppointment
);

/**
 * @swagger
 * /api/appointments/{id}/complete:
 *   patch:
 *     summary: Complete an appointment
 *     description: Allows a doctor to complete their own confirmed appointment.
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *         example: 68a123456789abcdef123456
 *     responses:
 *       200:
 *         description: Appointment completed successfully
 *       400:
 *         description: Appointment cannot be completed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only the appointment's doctor can complete it
 *       404:
 *         description: Appointment not found
 */
router.patch(
  "/:id/complete",
  authenticate,
  authorizeRoles("doctor"),
  appointmentController.completeAppointment
);

/**
 * @swagger
 * /api/appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel an appointment
 *     description: Allows a patient to cancel their own appointment or a doctor to cancel their own appointment.
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *         example: 68a123456789abcdef123456
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *       400:
 *         description: Appointment cannot be cancelled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is not allowed to cancel this appointment
 *       404:
 *         description: Appointment not found
 */
router.patch(
  "/:id/cancel",
  authenticate,
  authorizeRoles("patient", "doctor"),
  appointmentController.cancelAppointment
);

export default router;