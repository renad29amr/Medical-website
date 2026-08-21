// // import { Router } from "express";
// // import { registerValidator, loginValidator } from "../validators/authValidators";
// // import { authenticate } from "../middleware/authMiddleware";
// // import { registerUser, loginUser, getCurrentUser } from "../controllers/authController";

// // const router = Router();

// // router.post("/register", registerValidator, registerUser);
// // router.post("/login", loginValidator, loginUser);
// // router.get("/current-user", authenticate, getCurrentUser);

// // export default router;


// import { Router } from "express";

// import {
//   registerValidator,
//   loginValidator,
// } from "../validators/authValidators";

// import { authenticate } from "../middleware/authMiddleware";

// import {
//   registerUser,
//   loginUser,
//   getCurrentUser,
// } from "../controllers/authController";

// const router = Router();

// /**
//  * @swagger
//  * /api/auth/register:
//  *   post:
//  *     summary: Register a patient or doctor
//  *     description: Creates a new patient or doctor account. Doctors must provide specialty, experience, clinic address, and consultation fee.
//  *     tags:
//  *       - Authentication
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - fullName
//  *               - email
//  *               - password
//  *               - role
//  *             properties:
//  *               fullName:
//  *                 type: string
//  *                 example: Dr. Mahmoud
//  *               email:
//  *                 type: string
//  *                 example: Mahmoud@gmail.com
//  *               password:
//  *                 type: string
//  *                 example: Doctor@123456
//  *               role:
//  *                 type: string
//  *                 enum:
//  *                   - patient
//  *                   - doctor
//  *                 example: doctor
//  *               specialty:
//  *                 type: string
//  *                 example: Cardiology
//  *               experience:
//  *                 type: number
//  *                 example: 10
//  *               clinicAddress:
//  *                 type: string
//  *                 example: Cairo
//  *               consultationFee:
//  *                 type: number
//  *                 example: 500
//  *     responses:
//  *       201:
//  *         description: Registration successful
//  *       400:
//  *         description: Validation error
//  *       500:
//  *         description: Internal server error
//  */
// router.post(
//   "/register",
//   registerValidator,
//   registerUser
// );

// /**
//  * @swagger
//  * /api/auth/login:
//  *   post:
//  *     summary: Login
//  *     description: Login as a patient, doctor, or admin.
//  *     tags:
//  *       - Authentication
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - email
//  *               - password
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 example: Mahmoud@gmail.com
//  *               password:
//  *                 type: string
//  *                 example: Doctor@123456
//  *     responses:
//  *       200:
//  *         description: Login successful
//  *       401:
//  *         description: Invalid email or password
//  *       400:
//  *         description: Validation error
//  *       500:
//  *         description: Internal server error
//  */
// router.post(
//   "/login",
//   loginValidator,
//   loginUser
// );

// /**
//  * @swagger
//  * /api/auth/current-user:
//  *   get:
//  *     summary: Get current logged-in user
//  *     description: Returns the information of the currently authenticated user.
//  *     tags:
//  *       - Authentication
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Current user retrieved successfully
//  *       401:
//  *         description: Unauthenticated
//  *       404:
//  *         description: User not found
//  *       500:
//  *         description: Internal server error
//  */
// router.get(
//   "/current-user",
//   authenticate,
//   getCurrentUser
// );

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
  deleteAccount,
} from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new patient or doctor
 *     description: |
 *       Creates a new patient or doctor account.
 *
 *       Patients only need their basic account information.
 *
 *       Doctors must also provide:
 *       - Specialty
 *       - Years of experience
 *       - Clinic address
 *       - Consultation fee
 *
 *       Admin accounts must be created using `/api/admin/register-admin`.
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
 *                 minLength: 3
 *                 maxLength: 50
 *                 description: User's full name
 *                 example: Mahmoud Ali
 *
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: mahmoud@gmail.com
 *
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: User password
 *                 example: Doctor@123456
 *
 *               role:
 *                 type: string
 *                 enum:
 *                   - patient
 *                   - doctor
 *                 description: Account type
 *                 example: doctor
 *
 *               specialty:
 *                 type: string
 *                 description: Doctor specialty. Required when role is doctor.
 *                 example: Cardiology
 *
 *               experience:
 *                 type: number
 *                 minimum: 0
 *                 description: Doctor's years of experience. Required when role is doctor.
 *                 example: 10
 *
 *               clinicAddress:
 *                 type: string
 *                 description: Doctor's clinic address. Required when role is doctor.
 *                 example: Cairo Medical Center, Cairo
 *
 *               consultationFee:
 *                 type: number
 *                 minimum: 0
 *                 description: Doctor's consultation fee. Required when role is doctor.
 *                 example: 500
 *
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registration successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6a883471ba7b54c69dbf847a
 *                     fullName:
 *                       type: string
 *                       example: Mahmoud Ali
 *                     email:
 *                       type: string
 *                       example: mahmoud@gmail.com
 *                     role:
 *                       type: string
 *                       enum:
 *                         - patient
 *                         - doctor
 *
 *       400:
 *         description: Validation error, invalid registration data, or email already exists
 *
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
 *     description: Authenticates a patient, doctor, or admin and returns an authentication token.
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
 *                 format: email
 *                 description: Registered email address
 *                 example: mahmoud@gmail.com
 *               password:
 *                 type: string
 *                 description: Account password
 *                 example: Doctor@123456
 *
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6a883471ba7b54c69dbf847a
 *                     fullName:
 *                       type: string
 *                       example: Mahmoud Ali
 *                     email:
 *                       type: string
 *                       example: mahmoud@gmail.com
 *                     role:
 *                       type: string
 *                       enum:
 *                         - patient
 *                         - doctor
 *                         - admin
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Invalid email or password
 *
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
 *     description: Returns the profile information of the currently authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6a883471ba7b54c69dbf847a
 *                     fullName:
 *                       type: string
 *                       example: Mahmoud Ali
 *                     email:
 *                       type: string
 *                       example: mahmoud@gmail.com
 *                     role:
 *                       type: string
 *                       enum:
 *                         - patient
 *                         - doctor
 *                         - admin
 *
 *       401:
 *         description: Unauthenticated - missing or invalid JWT token
 *
 *       404:
 *         description: User not found
 *
 *       500:
 *         description: Internal server error
 */
router.get(
  "/current-user",
  authenticate,
  getCurrentUser
);

router.delete(
  "/delete-account",
  authenticate,
  deleteAccount
);

export default router;