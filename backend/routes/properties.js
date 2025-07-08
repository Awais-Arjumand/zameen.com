import express from "express";
import multer from "multer";
import path from "path";
import {
  createProperty,
  deleteProperty,
  getProperties,
  getPropertyById,
  updateProperty,
} from "../controllers/properties.js";

const router = express.Router();

// Multer config for multiple file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads")); // Use absolute path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Handle multiple image uploads and single video
const uploadFields = [
  { name: "images", maxCount: 5 },
  { name: "video", maxCount: 1 },
];

// Serve static files from uploads directory
router.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

router.get("/user", getProperties);
router.get("/user/:id", getPropertyById);
router.post("/user", upload.fields(uploadFields), createProperty);
router.patch("/user/:id", upload.fields(uploadFields), updateProperty);
router.delete("/user/:id", deleteProperty);

export default router;
