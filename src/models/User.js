// src/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: String,
  companyName: String,
  logo: String,
  logoColor: String,
  phone: String,
  verificationCode: String,
  verified: Boolean
}, { timestamps: true });

// Check if model already exists to prevent OverwriteModelError
export const User = mongoose.models.User || mongoose.model('User', UserSchema);