import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

import router from "./routes/properties.js";
import userRouter from "./routes/user.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve JSON and FormData
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically (VERY IMPORTANT!)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected!"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));
// Routes
app.use("/api", router);
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
