import clientPromise from '../../../../lib/mongodb';
import { generateOTP, sendOTP } from '../../../../lib/twilio';

export async function POST(request) {
  try {
    const { phone } = await request.json();
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Check if phone number already exists
    const existingUser = await db.collection('users').findOne({ phone });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'Phone number already registered' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate and send OTP
    const otp = generateOTP();
    await sendOTP(phone, otp);
    
    // Create user with OTP (not verified yet)
    await db.collection('users').insertOne({
      phone,
      verificationCode: otp,
      verified: false,
      createdAt: new Date(),
    });
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Sign-up error:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to send verification code' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}