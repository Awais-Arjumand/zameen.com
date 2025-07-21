'use server';

import clientPromise from '../../../../lib/mongodb';
import { sendOTP } from '../../../../lib/twilio';

export async function verifyPhoneAndSendOTP(phone) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Check if user exists
    const user = await db.collection('users').findOne({ phone });
    if (!user) {
      return { success: false, error: 'Phone number not registered' };
    }
    
    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOTP(phone, otp);
    
    // Update user with new OTP
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { verificationCode: otp } }
    );
    
    return { success: true, phone };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Failed to send verification code' };
  }
}