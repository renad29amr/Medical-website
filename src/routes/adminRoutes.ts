// import { Router } from "express";
// import { getAllUsers, getAllDoctors, getAllAppointments, deleteDoctor, registerAdmin } from "../controllers/adminController";
// import { authenticate, adminOnly, adminRegistrationGuard } from "../middleware/authMiddleware";
// import { registerAdminValidator } from "../validators/authValidators";

// const router = Router();

// // Placed ahead of the blanket authenticate/adminOnly middleware below so
// // adminRegistrationGuard can allow the very first admin to be created
// // with a setup key, before any admin (and therefore any admin token) exists.
// router.post("/register-admin", adminRegistrationGuard, registerAdminValidator, registerAdmin);

// router.use(authenticate);
// router.use(adminOnly);

// router.get("/users", getAllUsers);
// router.get("/doctors", getAllDoctors);
// router.get("/appointments", getAllAppointments);
// router.delete("/doctors/:id", deleteDoctor);

// export default router;


import { Router } from "express";

import {
    getAllUsers,
    getAllDoctors,
    getAllAppointments,
    deleteDoctor,
    registerAdmin,
} from "../controllers/adminController";

import {
    authenticate,
    adminOnly,
    adminRegistrationGuard,
} from "../middleware/authMiddleware";

import { registerAdminValidator } from "../validators/authValidators";

const router = Router();

/**
 * @swagger
 * /api/admin/register-admin:
 *   post:
 *     summary: Register a new admin
 *     description: Creates the first admin using the setup key. After an admin already exists, only an authenticated admin can create another admin.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: header
 *         name: x-admin-setup-key
 *         required: false
 *         schema:
 *           type: string
 *         description: Required when creating the first admin.
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
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: System Admin
 *               email:
 *                 type: string
 *                 example: admin@medical.com
 *               password:
 *                 type: string
 *                 example: Admin@123456
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid setup key or authentication required
 *       403:
 *         description: Access denied
 */
router.post(
    "/register-admin",
    adminRegistrationGuard,
    registerAdminValidator,
    registerAdmin
);

router.use(authenticate);

router.use(adminOnly);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /api/admin/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all doctors
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/doctors", getAllDoctors);

/**
 * @swagger
 * /api/admin/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all appointments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/appointments", getAllAppointments);

/**
 * @swagger
 * /api/admin/doctors/{id}:
 *   delete:
 *     summary: Delete a doctor
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *         example: 68a123456789abcdef123456
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Doctor not found
 */
router.delete("/doctors/:id", deleteDoctor);

export default router;
