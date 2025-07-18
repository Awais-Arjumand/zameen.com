import { User } from "../model/user.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// Check if user exists by email
export const checkUserExists = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while checking user" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching user by ID" });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { email, fullName, lastName, clerkId } = req.body;
    
    // Validate required fields
    if (!email || !fullName || !lastName || !clerkId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({ email, fullName, lastName, clerkId });
    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update user by ID
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = {
    email: req.body.email,
    fullName: req.body.fullName,
    lastName: req.body.lastName,
  };
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};