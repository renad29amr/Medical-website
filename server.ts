import express from "express";
import { connectDB } from "./src/config/db";
import { env } from "./src/config/env";
import chatbotRouter from "./src/routes/chatbotRoutes";
import authRouter from "./src/routes/authRoutes";
import adminRouter from "./src/routes/adminRoutes";
import doctorRouter from "./src/routes/Doctorroutes";
import scheduleRouter from "./src/routes/Scheduleroutes";
import appointmentRouter from "./src/routes/appointmentRoutes";
import reviewRouter from "./src/routes/reviewRoutes";

console.log("Gemini key loaded:", !!env.geminiApiKey);

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Medical website API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/schedules", scheduleRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/chatbot", chatbotRouter);

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
