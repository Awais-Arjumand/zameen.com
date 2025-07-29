import clientPromise from '../../../../lib/mongodb';
import { generateOTP, sendOTP } from '../../../../lib/twilio';

export async function POST(request) {
  try {
    const { phone } = await request.json();
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Check if user exists and include companyName in the query
    const user = await db.collection('users').findOne(
      { phone },
      { projection: { companyName: 1 } } // Only return companyName field
    );
    
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Phone number not registered' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate and send OTP
    const otp = generateOTP();
    await sendOTP(phone, otp);
    
    // Update user with new OTP
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { verificationCode: otp } }
    );
    
    return new Response(
      JSON.stringify({ 
        success: true,
        companyName: user.companyName // Include company name in response
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Sign-in error:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to send verification code' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}