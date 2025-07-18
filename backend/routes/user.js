import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  checkUserExists
} from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/check", checkUserExists); // New route for checking user existence
router.get("/:id", getUserById);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;