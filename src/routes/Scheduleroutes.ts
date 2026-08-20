// import { Router } from "express";
// import { createSchedule, getAllSchedules, updateSchedule, deleteSchedule } from "../controllers/Schedulecontroller";
// import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

// const router = Router();

// router.get("/", authenticate, getAllSchedules);
// router.post("/", authenticate, authorizeRoles("doctor"), createSchedule);
// router.put("/:id", authenticate, authorizeRoles("doctor"), updateSchedule);
// router.delete("/:id", authenticate, authorizeRoles("doctor"), deleteSchedule);

// export default router;

import { Router } from "express";

import {
  createSchedule,
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
} from "../controllers/Schedulecontroller";

import {
  authenticate,
  authorizeRoles,
} from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Get all schedules
 *     description: Returns all available doctor schedules.
 *     tags:
 *       - Schedules
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Schedules retrieved successfully
 *       401:
 *         description: Unauthenticated
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authenticate,
  getAllSchedules
);

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create a doctor schedule
 *     description: Allows a doctor to create their working schedule.
 *     tags:
 *       - Schedules
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
 *               - day
 *               - availableTimeSlots
 *             properties:
 *               doctor:
 *                 type: string
 *                 description: Doctor Profile ID
 *                 example: 68a123456789abcdef123456
 *               day:
 *                 type: string
 *                 enum:
 *                   - Saturday
 *                   - Sunday
 *                   - Monday
 *                   - Tuesday
 *                   - Wednesday
 *                   - Thursday
 *                   - Friday
 *                 example: Monday
 *               availableTimeSlots:
 *                 type: array
 *                 description: Available working time slots
 *                 items:
 *                   type: object
 *                   required:
 *                     - start
 *                     - end
 *                   properties:
 *                     start:
 *                       type: string
 *                       example: "09:00"
 *                     end:
 *                       type: string
 *                       example: "12:00"
 *               availability:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Only doctors can create schedules
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authenticate,
  authorizeRoles("doctor"),
  createSchedule
);

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Update a doctor schedule
 *     description: Allows a doctor to update their own schedule.
 *     tags:
 *       - Schedules
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *         example: 68a123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *                 enum:
 *                   - Saturday
 *                   - Sunday
 *                   - Monday
 *                   - Tuesday
 *                   - Wednesday
 *                   - Thursday
 *                   - Friday
 *                 example: Tuesday
 *               availableTimeSlots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       example: "10:00"
 *                     end:
 *                       type: string
 *                       example: "14:00"
 *               availability:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       400:
 *         description: Invalid schedule data
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Only the schedule owner can update it
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authenticate,
  authorizeRoles("doctor"),
  updateSchedule
);

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Delete a doctor schedule
 *     description: Allows a doctor to delete their own schedule.
 *     tags:
 *       - Schedules
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *         example: 68a123456789abcdef123456
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       400:
 *         description: Schedule cannot be deleted
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Only the schedule owner can delete it
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("doctor"),
  deleteSchedule
);

export default router;