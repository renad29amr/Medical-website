// import { Router } from "express";
// import { registerValidator, loginValidator } from "../validators/authValidators";
// import { authenticate } from "../middleware/authMiddleware";
// import { registerUser, loginUser, getCurrentUser } from "../controllers/authController";

// const router = Router();

// router.post("/register", registerValidator, registerUser);
// router.post("/login", loginValidator, loginUser);
// router.get("/current-user", authenticate, getCurrentUser);

// export default router;


import { Router } from "express";

import {
  registerValidator,
  loginValidator,
} from "../validators/authValidators";

import { authenticate } from "../middleware/authMiddleware";

import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a patient or doctor
 *     description: Creates a new patient or doctor account. Doctors must provide specialty, experience, clinic address, and consultation fee.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Dr. Mahmoud
 *               email:
 *                 type: string
 *                 example: Mahmoud@gmail.com
 *               password:
 *                 type: string
 *                 example: Doctor@123456
 *               role:
 *                 type: string
 *                 enum:
 *                   - patient
 *                   - doctor
 *                 example: doctor
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
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  "/register",
  registerValidator,
  registerUser
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     description: Login as a patient, doctor, or admin.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: Mahmoud@gmail.com
 *               password:
 *                 type: string
 *                 example: Doctor@123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  "/login",
  loginValidator,
  loginUser
);

/**
 * @swagger
 * /api/auth/current-user:
 *   get:
 *     summary: Get current logged-in user
 *     description: Returns the information of the currently authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user retrieved successfully
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/current-user",
  authenticate,
  getCurrentUser
);

export default router;