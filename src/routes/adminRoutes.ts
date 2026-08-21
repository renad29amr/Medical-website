// // import { Router } from "express";
// // import { getAllUsers, getAllDoctors, getAllAppointments, deleteDoctor, registerAdmin } from "../controllers/adminController";
// // import { authenticate, adminOnly, adminRegistrationGuard } from "../middleware/authMiddleware";
// // import { registerAdminValidator } from "../validators/authValidators";

// // const router = Router();

// // // Placed ahead of the blanket authenticate/adminOnly middleware below so
// // // adminRegistrationGuard can allow the very first admin to be created
// // // with a setup key, before any admin (and therefore any admin token) exists.
// // router.post("/register-admin", adminRegistrationGuard, registerAdminValidator, registerAdmin);

// // router.use(authenticate);
// // router.use(adminOnly);

// // router.get("/users", getAllUsers);
// // router.get("/doctors", getAllDoctors);
// // router.get("/appointments", getAllAppointments);
// // router.delete("/doctors/:id", deleteDoctor);

// // export default router;


// import { Router } from "express";

// import {
//     getAllUsers,
//     getAllDoctors,
//     getAllAppointments,
//     deleteDoctor,
//     registerAdmin,
// } from "../controllers/adminController";

// import {
//     authenticate,
//     adminOnly,
//     adminRegistrationGuard,
// } from "../middleware/authMiddleware";

// import { registerAdminValidator } from "../validators/authValidators";

// const router = Router();

// /**
//  * @swagger
//  * /api/admin/register-admin:
//  *   post:
//  *     summary: Register a new admin
//  *     description: Creates the first admin using the setup key. After an admin already exists, only an authenticated admin can create another admin.
//  *     tags:
//  *       - Admin
//  *     parameters:
//  *       - in: header
//  *         name: x-admin-setup-key
//  *         required: false
//  *         schema:
//  *           type: string
//  *         description: Required when creating the first admin.
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
//  *             properties:
//  *               fullName:
//  *                 type: string
//  *                 example: System Admin
//  *               email:
//  *                 type: string
//  *                 example: admin@medical.com
//  *               password:
//  *                 type: string
//  *                 example: Admin@123456
//  *     responses:
//  *       201:
//  *         description: Admin registered successfully
//  *       400:
//  *         description: Validation error
//  *       401:
//  *         description: Invalid setup key or authentication required
//  *       403:
//  *         description: Access denied
//  */
// router.post(
//     "/register-admin",
//     adminRegistrationGuard,
//     registerAdminValidator,
//     registerAdmin
// );

// router.use(authenticate);

// router.use(adminOnly);

// /**
//  * @swagger
//  * /api/admin/users:
//  *   get:
//  *     summary: Get all users
//  *     tags:
//  *       - Admin
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of all users
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Admin access required
//  */
// router.get("/users", getAllUsers);

// /**
//  * @swagger
//  * /api/admin/doctors:
//  *   get:
//  *     summary: Get all doctors
//  *     tags:
//  *       - Admin
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of all doctors
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Admin access required
//  */
// router.get("/doctors", getAllDoctors);

// /**
//  * @swagger
//  * /api/admin/appointments:
//  *   get:
//  *     summary: Get all appointments
//  *     tags:
//  *       - Admin
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of all appointments
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Admin access required
//  */
// router.get("/appointments", getAllAppointments);

// /**
//  * @swagger
//  * /api/admin/doctors/{id}:
//  *   delete:
//  *     summary: Delete a doctor
//  *     tags:
//  *       - Admin
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Doctor ID
//  *         example: 68a123456789abcdef123456
//  *     responses:
//  *       200:
//  *         description: Doctor deleted successfully
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Admin access required
//  *       404:
//  *         description: Doctor not found
//  */
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
 *     description: |
 *       Creates a new administrator account.
 *
 *       - If no admin exists, the request requires the `x-admin-setup-key` header.
 *       - If an admin already exists, the request must be authenticated as an admin.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: header
 *         name: x-admin-setup-key
 *         required: false
 *         schema:
 *           type: string
 *         description: |
 *           Setup key required when creating the first administrator.
 *           This value must match the ADMIN_SETUP_KEY environment variable.
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
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: System Admin
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@medical.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: Admin@123456
 *     responses:
 *       201:
 *         description: Admin registered successfully
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
 *                   example: Admin registered successfully
 *                 admin:
 *                   type: object
 *       400:
 *         description: Validation error or admin already exists
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

/**
 * All routes below this point require authentication
 * and administrator privileges.
 */
router.use(authenticate);
router.use(adminOnly);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all registered users. Only administrators can access this endpoint.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 68a123456789abcdef123456
 *                       fullName:
 *                         type: string
 *                         example: Mohamed Ali
 *                       email:
 *                         type: string
 *                         example: mohamed@test.com
 *                       role:
 *                         type: string
 *                         enum:
 *                           - patient
 *                           - doctor
 *                           - admin
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       403:
 *         description: Admin access required
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /api/admin/doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Returns all doctor profiles with their associated user information. Only administrators can access this endpoint.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 doctors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Doctor Profile ID
 *                         example: 68a123456789abcdef123456
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 68a123456789abcdef123450
 *                           fullName:
 *                             type: string
 *                             example: Mohamed Ali
 *                           email:
 *                             type: string
 *                             example: mohamed@test.com
 *                       specialty:
 *                         type: string
 *                         example: Cardiology
 *                       experience:
 *                         type: integer
 *                         example: 10
 *                       clinicAddress:
 *                         type: string
 *                         example: Cairo Medical Center
 *                       consultationFee:
 *                         type: number
 *                         example: 500
 *                       availabilityStatus:
 *                         type: string
 *                         enum:
 *                           - available
 *                           - unavailable
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       403:
 *         description: Admin access required
 */
router.get("/doctors", getAllDoctors);

/**
 * @swagger
 * /api/admin/appointments:
 *   get:
 *     summary: Get all appointments
 *     description: Returns all appointments in the system. Only administrators can access this endpoint.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 15
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 68a123456789abcdef123456
 *                       patient:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           fullName:
 *                             type: string
 *                           email:
 *                             type: string
 *                       doctor:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Doctor Profile ID
 *                           specialty:
 *                             type: string
 *                       appointmentDate:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-08-25T00:00:00.000Z
 *                       timeSlot:
 *                         type: string
 *                         example: 10:00-11:00
 *                       status:
 *                         type: string
 *                         enum:
 *                           - pending
 *                           - confirmed
 *                           - completed
 *                           - cancelled
 *                         example: pending
 *                       notes:
 *                         type: string
 *                         example: Regular checkup
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       403:
 *         description: Admin access required
 */
router.get("/appointments", getAllAppointments);

/**
 * @swagger
 * /api/admin/doctors/{id}:
 *   delete:
 *     summary: Delete a doctor
 *     description: |
 *       Deletes a doctor profile.
 *
 *       The `id` parameter must be the **DoctorProfile ID**, not the User ID.
 *       Only administrators can perform this operation.
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
 *         description: Doctor Profile ID
 *         example: 6a882d33d19127beffe43d2b
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
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
 *                   example: Doctor deleted successfully
 *       400:
 *         description: Invalid doctor ID or doctor cannot be deleted
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Doctor not found
 */
router.delete("/doctors/:id", deleteDoctor);



export default router;