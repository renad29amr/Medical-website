import { Router } from "express";

import reviewController from "../controllers/reviewController";

import {
  validateCreateReview,
  validateUpdateReview,
} from "../validators/reviewValidator";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Submit a doctor review
 *     description: |
 *       Allows a patient to rate and review a doctor after a completed
 *       appointment. Only one review is allowed per appointment.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointment
 *               - rating
 *             properties:
 *               appointment:
 *                 type: string
 *                 description: Appointment ID (must be completed and belong to the patient)
 *                 example: 68a123456789abcdef123456
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Great experience, very attentive doctor.
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       400:
 *         description: Validation error, appointment not completed, or already reviewed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only patients can submit reviews
 */
router.post(
  "/",
  authenticate,
  authorizeRoles("patient"),
  validateCreateReview,
  reviewController.createReview
);

/**
 * @swagger
 * /api/reviews/doctor/{doctorId}:
 *   get:
 *     summary: Get reviews for a doctor
 *     description: Returns paginated reviews and aggregate rating for a doctor. Public endpoint.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor Profile ID
 *         example: 68a123456789abcdef123456
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       400:
 *         description: Invalid doctor ID
 */
router.get("/doctor/:doctorId", reviewController.getDoctorReviews);

/**
 * @swagger
 * /api/reviews/my:
 *   get:
 *     summary: Get the authenticated patient's reviews
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only patients can access this endpoint
 */
router.get(
  "/my",
  authenticate,
  authorizeRoles("patient"),
  reviewController.getMyReviews
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update own review
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only patients can update reviews
 *       404:
 *         description: Review not found
 */
router.put(
  "/:id",
  authenticate,
  authorizeRoles("patient"),
  validateUpdateReview,
  reviewController.updateReview
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: A patient can delete their own review; an admin can delete any review.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       400:
 *         description: Invalid review ID or not the owner
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only patients or admins can delete reviews
 *       404:
 *         description: Review not found
 */
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("patient", "admin"),
  reviewController.deleteReview
);

export default router;