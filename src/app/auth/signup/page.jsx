"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateOTP, sendOTP } from '../../../lib/twilio';
import clientPromise from '../../../lib/mongodb';

export default function SignUp() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const client = await clientPromise;
      const db = client.db();
      
      // Check if phone number already exists
      const existingUser = await db.collection('users').findOne({ phone });
      if (existingUser) {
        setError('Phone number already registered');
        setLoading(false);
        return;
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
      
      // Redirect to verification page
      router.push(`/auth/verify?phone=${encodeURIComponent(phone)}`);
    } catch (err) {
      setError('Failed to send verification code');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-extrabold text-center">Sign Up</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number (WhatsApp)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}