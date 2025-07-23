"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

const SignIn = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Failed to sign in');
        return;
      }
      
      router.push(`/auth/verify?phone=${encodeURIComponent(phone)}`);
    } catch (err) {
      setError('Failed to send verification code');
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
      <div className="relative z-10 min-h-screen flex flex-col pb-6 md:pb-10 gap-y-8 md:gap-y-16 px-4 sm:px-6">
        {/* Header with Logo */}
        <div className="w-full max-w-6xl pt-8 md:pt-16 px-4 md:pl-28">
          <Image
            src="../images/Login/img2.svg"
            alt="Login Logo"
            width={200}
            height={200}
            className="object-contain w-40 md:w-48 lg:w-56"
          />
        </div>

        {/* Login Form */}
        <div className="w-full flex justify-center lg:justify-start px-4 md:pl-28 pt-4 md:pt-8">
          <div className="w-full max-w-md bg-white rounded-xl p-6 md:p-8 shadow-lg">
            <div className="w-full flex flex-col gap-y-1 justify-center items-center mb-6 md:mb-8">
              <h1 className="font-bold text-2xl md:text-3xl text-[#3B404C] josefin-sans">
                Login
              </h1>
              <h1 className="font-normal text-base md:text-lg text-[#6F6F6F]">Please enter your details</h1>
            </div>
            
            <form className="w-full" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 text-center mb-4">{error}</div>}
              
              <div className="mb-4 md:mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-[#6F6F6F] mb-2">
                  Phone Number (WhatsApp)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="w-full px-4 py-2 md:py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B404C]"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 md:py-3 px-4 rounded-lg text-white bg-[#3B404C] hover:bg-[#2D3138] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B404C] ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
            
            <div className="mt-4 md:mt-6 text-center">
              <p className="text-sm text-[#6F6F6F]">
                Don't have an account?{' '}
                <a href="/auth/signup" className="font-medium text-[#3B404C] hover:text-[#2D3138] underline">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;