// import { Router } from "express";
// import { getAllDoctors, getDoctorById, updateOwnProfile } from "../controllers/Doctorcontroller";
// import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

// const router = Router();

// router.get("/", getAllDoctors);
// router.get("/:id", getDoctorById);
// router.put("/profile", authenticate, authorizeRoles("doctor"), updateOwnProfile);

// export default router;


import { Router } from "express";

import {
  getAllDoctors,
  getDoctorById,
  updateOwnProfile,
} from "../controllers/Doctorcontroller";

import {
  authenticate,
  authorizeRoles,
} from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Returns a list of all registered doctors.
 *     tags:
 *       - Doctors
 *     responses:
 *       200:
 *         description: Doctors retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllDoctors);

/**
 * @swagger
 * /api/doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     description: Returns the details of a specific doctor.
 *     tags:
 *       - Doctors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor Profile ID
 *         example: 68a123456789abcdef123456
 *     responses:
 *       200:
 *         description: Doctor retrieved successfully
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getDoctorById);

/**
 * @swagger
 * /api/doctors/profile:
 *   put:
 *     summary: Update own doctor profile
 *     description: Allows a doctor to update their own professional profile.
 *     tags:
 *       - Doctors
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialty:
 *                 type: string
 *                 example: Cardiology
 *               experience:
 *                 type: number
 *                 example: 10
 *               clinicAddress:
 *                 type: string
 *                 example: Cairo
 *               consultationFee:
 *                 type: number
 *                 example: 500
 *               availabilityStatus:
 *                 type: string
 *                 enum:
 *                   - available
 *                   - unavailable
 *                 example: available
 *     responses:
 *       200:
 *         description: Doctor profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Only doctors can update their profile
 *       404:
 *         description: Doctor profile not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/profile",
  authenticate,
  authorizeRoles("doctor"),
  updateOwnProfile
);

export default router;