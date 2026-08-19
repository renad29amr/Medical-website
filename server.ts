import express from "express";
import chatbotRouter from "./src/routes/chatbotRoutes";
import { connectDB } from "./src/config/db";
import { env } from "./src/config/env";

console.log(
    "Gemini key loaded:",
    !!env.geminiApiKey
);
const app = express();

app.use(express.json());

// ====================
// Routes
// ====================

app.get("/", (req, res) => {
    res.json({
        message: "Medical website API is running"
    });
});

app.use(
    "/api/chatbot",
    chatbotRouter
);

// ====================
// Start Server
// ====================

const PORT = env.port || 5000;

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

startServer();