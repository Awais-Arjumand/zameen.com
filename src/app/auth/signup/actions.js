'use server';

import clientPromise from '../../../lib/mongodb';
import { generateOTP, sendOTP } from '../../../lib/twilio';

export async function registerUser(phone) {
  try {
    // Validate and format phone number
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (!cleanPhone || cleanPhone.length < 10) {
      return { 
        success: false, 
        error: 'Please enter a valid phone number with country code' 
      };
    }

    // Format for Pakistan (or adjust for your default country)
    // Use regular SMS format instead of WhatsApp
    const formattedPhone = cleanPhone.startsWith('92') && cleanPhone.length === 12
      ? `+${cleanPhone}`
      : `+92${cleanPhone}`;

    // Database operations
    const client = await clientPromise;
    const db = client.db();
    
    const existingUser = await db.collection('users').findOne({ 
      phone: formattedPhone 
    });
    
    if (existingUser) {
      return { success: false, error: 'This number is already registered' };
    }
    
    // Generate OTP
    const otp = generateOTP();
    let otpSent = false;
    
    // Try to send OTP via Twilio
    try {
      await sendOTP(formattedPhone, otp);
      otpSent = true;
    } catch (error) {
      console.warn('Failed to send OTP via Twilio:', error.message);
      // Continue with registration even if OTP sending fails
      // In production, you might want to handle this differently
    }
    
    // Save user data
    await db.collection('users').insertOne({
      phone: formattedPhone,
      verificationCode: otp,
      verified: false,
      createdAt: new Date(),
      lastOtpSentAt: new Date(),
      otpSent: otpSent
    });
    
    // For development, log the OTP if it wasn't sent via Twilio
    if (!otpSent && process.env.NODE_ENV === 'development') {
      console.log(`DEV MODE - OTP for ${formattedPhone}: ${otp}`);
    }
    
    return { 
      success: true, 
      phone: formattedPhone,
      devOtp: (!otpSent && process.env.NODE_ENV === 'development') ? otp : undefined
    };
    
  } catch (error) {
    console.error('Registration Error:', {
      error: error.message,
      stack: error.stack,
      phone: phone,
      time: new Date().toISOString()
    });
    
    // For MongoDB connection errors
    if (error.name === 'MongoNetworkError' || error.message.includes('ECONNREFUSED')) {
      return {
        success: false,
        error: 'Database connection problem. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
    
    return {
      success: false,
      error: error.message.includes('Network') 
        ? 'Connection problem. Please try again later.'
        : 'Registration failed. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
}