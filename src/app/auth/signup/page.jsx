"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoColor, setLogoColor] = useState('#3B404C');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    // Validate all fields
    if (!fullName.trim()) {
      setError("Full name is required");
      setLoading(false);
      return;
    }
    if (!companyName.trim()) {
      setError("Company name is required");
      setLoading(false);
      return;
    }
    if (!logoFile) {
      setError("Company logo is required");
      setLoading(false);
      return;
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
      setError("Please enter a valid phone number with country code");
      setLoading(false);
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      // Format company name
      const formattedCompany = companyName.trim()
        .replace(/\s+/g, '_')
        .toLowerCase();
      formData.append('companyName', formattedCompany);
      formData.append('logo', logoFile);
      formData.append('logoColor', logoColor);
      formData.append('phone', phone.trim());
  
      const response = await fetch('/api/users', {
        method: 'POST',
        body: formData,
        // Headers are automatically set by browser for FormData
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }
  
      router.push(`/auth/verify?phone=${encodeURIComponent(phone)}&company=${formattedCompany}`);
    } catch (err) {
      setError(err.message || 'Failed to create account');
      console.error("Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };
  return (
    <div className="relative w-full min-h-screen roboto overflow-hidden bg-gray-100 ">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Login/img1.svg"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col pb-6 md:pb-10 gap-y-8 md:gap-y-16 px-4 sm:px-6">
        <div className="w-full max-w-6xl pt-8 md:pt-16 px-4 md:pl-28">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src="/images/Login/img2.svg"
              alt="Property Panel Logo"
              width={200}
              height={200}
              className="object-contain w-40 md:w-48 lg:w-56"
            />
          </div>
        </div>

        <div className="w-full flex justify-center md:justify-start px-4 md:pl-28 pt-4 md:pt-8">
          <div className="w-full max-w-md md:max-w-[500px] bg-white rounded-xl p-6 md:p-8 shadow-lg">
            <div className="text-left mb-6 md:mb-8 flex flex-col items-center justify-center">
              <h1 className="font-bold text-2xl md:text-3xl text-[#3B404C] josefin-sans mb-2">
                Sign Up
              </h1>
              <p className="font-normal text-base md:text-lg text-[#6F6F6F]">
                Please enter your details
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {error && (
                <div className="text-red-500 text-left p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}
              
              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-sm font-medium text-[#6F6F6F]">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  minLength={2}
                  className="w-full px-4 py-2 md:py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B404C]"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="companyName" className="block text-sm font-medium text-[#6F6F6F]">
                  Company Name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  minLength={2}
                  className="w-full px-4 py-2 md:py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B404C]"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="logo" className="block text-sm font-medium text-[#6F6F6F]">
                  Company Logo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="logo"
                    name="logo"
                    type="file"
                    required
                    accept="image/*"
                    className="flex-1 text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-medium
                      file:bg-[#3B404C] file:text-white
                      hover:file:bg-[#2D3138]"
                    onChange={handleLogoChange}
                  />
                  {logoFile && (
                    <div className="w-10 h-10 rounded roboto flex items-center justify-center" 
                         style={{ backgroundColor: logoColor }}>
                      <span className="text-white text-xs">Logo</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="logoColor" className="block text-sm font-medium text-[#6F6F6F]">
                  Logo Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="logoColor"
                    name="logoColor"
                    type="color"
                    required
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    value={logoColor}
                    onChange={(e) => setLogoColor(e.target.value)}
                  />
                  <span className="text-sm font-medium">{logoColor}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="block text-sm font-medium text-[#6F6F6F]">
                  Phone Number (WhatsApp)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  pattern="^\+[1-9]\d{1,14}$"
                  className="w-full px-4 py-2 md:py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B404C]"
                  placeholder="+923001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 md:py-3 px-4 rounded-lg text-white bg-[#3B404C] hover:bg-[#2D3138] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B404C] transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating Account...' : 'Send Verification Code'}
              </button>
            </form>
            
            <div className="mt-4 md:mt-6 text-center">
              <p className="text-sm text-[#6F6F6F]">
                Already have an account?{' '}
                <a 
                  href="/auth/signin" 
                  className="font-medium text-[#3B404C] hover:text-[#2D3138] underline transition-colors"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;