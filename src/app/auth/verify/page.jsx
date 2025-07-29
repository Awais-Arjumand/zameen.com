"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Verify() {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const phone = searchParams.get('phone');
  const company = searchParams.get('company');

  // Handle successful authentication
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.companyName) {
      router.push(`/${session.user.companyName}`);
    }
  }, [status, session, router]);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    
    if (value && index < 5) {
      document.getElementById(`digit-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      document.getElementById(`digit-${index - 1}`).focus();
    }
  };

  const resendOTP = async () => {
    setResending(true);
    setError('');
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to resend code');
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
    
    if (digits.some(digit => digit === '')) {
      setError('Please enter the full 6-digit code');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        phone,
        code: digits.join(''),
      });

      if (result?.error) {
        setError('Invalid verification code');
      }
      // The useEffect will handle the redirect once session is updated
    } catch (err) {
      setError('Verification failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gray-100">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="../images/Login/img1.svg"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center md:items-start gap-y-8 md:gap-y-16 px-4 sm:px-6">
        {/* Header with Logo */}
        <div className="w-full max-w-6xl pt-8 md:pt-16 px-4 md:pl-28">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src="../images/Login/img2.svg"
              alt="Property Panel Logo"
              width={200}
              height={200}
              className="object-contain w-40 md:w-48 lg:w-56"
            />
          </div>
        </div>

        {/* Verification Form */}
        <div className="w-full flex justify-center md:justify-start px-4 md:pl-28 pt-4 md:pt-8">
          <div className="w-full max-w-md md:max-w-[500px] bg-white rounded-xl p-6 md:p-8 shadow-lg">
            <div className="text-left mb-6 md:mb-8">
              <h1 className="font-bold text-2xl md:text-3xl text-[#3B404C] josefin-sans mb-2">
                Enter OTP
              </h1>
              <p className="font-normal text-base md:text-lg text-[#6F6F6F]">
                We've sent a 6-digit verification code to your WhatsApp number.
              </p>
              {phone && (
                <p className="font-medium text-base md:text-lg text-[#3B404C] mt-2">
                  {phone}
                </p>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              {error && (
                <div className="text-red-500 text-left p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}
              
              {/* OTP Input Boxes */}
              <div className="flex justify-between gap-2 mb-6">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    id={`digit-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-2xl text-center border border-[#D9D9D9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#3B404C] focus:border-[#3B404C]"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white bg-[#3B404C] hover:bg-[#2D3138] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B404C] transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Verifying...' : 'Confirm'}
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-[#6F6F6F]">
                  Didn't receive code?{' '}
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={resending}
                    className="font-medium text-[#3B404C] hover:text-[#2D3138] underline transition-colors"
                  >
                    {resending ? 'Sending...' : 'Resend'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}