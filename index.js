import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();

/* ===============================
   CORS CONFIG
================================ */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hbtechlink.vercel.app",
    ],
    credentials: true,
  })
);

/* ===============================
   MIDDLEWARE
================================ */
app.use(express.json({ limit: "20mb" }));

/* ===============================
   MONGODB CONNECTION
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

/* ===============================
   ROUTES
================================ */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/analytics", analyticsRoutes);

/* ===============================
   ERROR SAFETY
================================ */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
});

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
