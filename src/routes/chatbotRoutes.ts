import express from "express";
import {
    chat,
} from "../controllers/chatbotController";

const router = express.Router();

router.post(
    "/chat",
    chat
);

export default router;