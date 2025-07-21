// This module contains server-side code

// Use dynamic import to ensure twilio is only loaded on the server side
let twilioClient;

// This function will only be executed on the server
const getTwilioClient = async () => {
  if (typeof window === 'undefined') {
    const twilio = await import('twilio');
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    return twilio.default(accountSid, authToken);
  }
  return null;
};

export const sendOTP = async (phone, code) => {
  try {
    // Make sure we're on the server
    if (typeof window !== 'undefined') {
      throw new Error('Twilio can only be used on the server side');
    }
    
    const client = await getTwilioClient();
    
    const message = await client.messages.create({
      from: 'whatsapp:+14155238886',
      contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
      contentVariables: JSON.stringify({
        "1": code,
        "2": "5 minutes" // OTP expiration time
      }),
      to: `whatsapp:${phone}`
    });
    
    return message.sid;
  } catch (error) {
    console.error('Twilio error:', error);
    throw error;
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
