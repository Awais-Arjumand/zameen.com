"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Verify() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');

  const resendOTP = async () => {
    setResending(true);
    setError('');
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      if (response.ok) {
        // Success message
        const data = await response.json();
        if (data.success) {
          // Show success message
        }
      } else {
        // Try to parse error message if available
        try {
          const data = await response.json();
          setError(data.message || 'Failed to resend code');
        } catch {
          setError('Failed to resend code');
        }
      }
    } catch (err) {
      setError('Failed to resend verification code');
      console.error(err);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        phone,
        code,
      });

      if (result?.error) {
        setError('Invalid verification code');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Verification failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-extrabold text-center">Verify Phone Number</h2>
        <p className="text-center text-gray-600">
          We've sent a verification code to {phone}
        </p>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={resendOTP}
              disabled={resending}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {resending ? 'Sending...' : 'Resend verification code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}