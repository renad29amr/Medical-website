// import express from "express";
// import {
//     chat,
// } from "../controllers/chatbotController";

// const router = express.Router();

// router.post(
//     "/chat",
//     chat
// );

// export default router;


import express from "express";

import {
  chat,
} from "../controllers/chatbotController";

const router = express.Router();

/**
 * @swagger
 * /api/chatbot/chat:
 *   post:
 *     summary: Chat with the medical chatbot
 *     description: Sends a message to the medical chatbot and returns its response.
 *     tags:
 *       - Chatbot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of chatbot request
 *                 example: general
 *               message:
 *                 type: string
 *                 description: Message sent to the chatbot
 *                 example: What are the symptoms of flu?
 *               patientId:
 *                 type: string
 *                 description: Patient ID, if required for the request
 *                 example: 68a123456789abcdef123456
 *     responses:
 *       200:
 *         description: Chatbot response returned successfully
 *       400:
 *         description: Message is required or invalid request
 *       500:
 *         description: Internal server error
 */
router.post(
  "/chat",
  chat
);

export default router;