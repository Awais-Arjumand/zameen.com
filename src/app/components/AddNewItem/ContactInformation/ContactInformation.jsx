"use client";

import React, { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import axios from "axios";
import { IoCallOutline, IoMailOutline, IoPersonOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { FaMinus } from "react-icons/fa6";

const getFlagEmoji = (countryCode) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );

const formatPakistaniNumber = (number) => {
  if (!number) return "";
  
  // Remove all non-digit characters
  const cleaned = number.replace(/\D/g, '');
  
  // If number starts with 0, replace with +92
  if (cleaned.startsWith('0')) {
    return `+92${cleaned.substring(1)}`;
  }
  // If number starts with 92, add + prefix
  else if (cleaned.startsWith('92')) {
    return `+${cleaned}`;
  }
  // If number starts with 3 (without country code), add +92
  else if (cleaned.startsWith('3')) {
    return `+92${cleaned}`;
  }
  // Otherwise return as is (with + if present)
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
};

const ContactInformation = forwardRef((props, ref) => {
  const [countries, setCountries] = useState([]);
  const [mobileCountry, setMobileCountry] = useState(null);
  const [landlineCountry, setLandlineCountry] = useState(null);
  const [landlineNumber, setLandlineNumber] = useState("");
  const [landlineError, setLandlineError] = useState(false);
  const [mobileNumbers, setMobileNumbers] = useState([
    { id: 1, value: "", error: false }
  ]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=cca2,name,idd")
      .then((res) => {
        const list = res.data
          .map((c) => {
            const root = c.idd.root || "";
            const suffix = (c.idd.suffixes && c.idd.suffixes[0]) || "";
            return {
              code: c.cca2,
              name: c.name.common,
              dialCode: root + suffix,
              flag: getFlagEmoji(c.cca2),
            };
          })
          .filter((c) => c.dialCode)
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(list);
        const pk = list.find((c) => c.code === "PK");
        setMobileCountry(pk || list[0]);
        setLandlineCountry(pk || list[0]);
      })
      .catch(console.error);
  }, []);

  const handleAddMobile = () => {
    if (mobileNumbers.length < 3) {
      const newId = mobileNumbers.length + 1;
      setMobileNumbers([...mobileNumbers, { id: newId, value: "", error: false }]);
    }
  };

  const handleRemoveMobile = (id) => {
    if (mobileNumbers.length > 1) {
      setMobileNumbers(mobileNumbers.filter(num => num.id !== id));
    }
  };

  const handleMobileChange = (id, value) => {
    const updatedNumbers = mobileNumbers.map(num =>
      num.id === id ? { ...num, value, error: !validatePhone(value) } : num
    );
    setMobileNumbers(updatedNumbers);
  };

  const handleLandlineChange = (value) => {
    setLandlineNumber(value);
    setLandlineError(!validatePhone(value));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value.toLowerCase());
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setNameError(value.trim().split(/\s+/).length < 2);
  };

  const validatePhone = (number) => {
    if (!number) return false;
    if (mobileCountry?.code === "PK") {
      const cleaned = number.replace(/\D/g, '');
      return cleaned.length >= 10 && (cleaned.startsWith('3') || cleaned.startsWith('03'));
    }
    return /^\d{7,}$/.test(number);
  };

  useImperativeHandle(ref, () => ({
    getData: () => {
      const primaryPhone = mobileNumbers[0]?.value || "";
      return {
        email,
        name,
        phone: mobileCountry?.code === "PK" ? formatPakistaniNumber(primaryPhone) : primaryPhone,
        mobileNumbers: mobileNumbers.map(num => ({
          ...num,
          value: mobileCountry?.code === "PK" ? formatPakistaniNumber(num.value) : num.value
        })),
        landlineNumber: landlineCountry?.code === "PK" ? formatPakistaniNumber(landlineNumber) : landlineNumber,
        landlineCountry: landlineCountry?.code,
      };
    },
    setData: (data) => {
      setEmail(data.email || "");
      setName(data.name || "");
      setLandlineNumber(data.landlineNumber || "");
      setMobileNumbers(
        data.mobileNumbers && data.mobileNumbers.length > 0
          ? data.mobileNumbers.map((num, index) => ({
              id: index + 1,
              value: num.value || "",
              error: false,
            }))
          : [{ id: 1, value: data.phone || "", error: false }]
      );
    },
  }));

  return (
    <div className="w-full bg-white rounded-xl roboto shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center gap-x-3 mb-8 pb-3 border-b border-gray-200">
          <div className="p-2 bg-primary rounded-lg">
            <IoCallOutline className="text-xl text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Contact Information</h2>
        </div>

        <div className="flex items-center mb-6">
          <div className="w-40 flex items-center gap-x-2">
            <div className="p-2 rounded-lg">
              <IoPersonOutline className="text-xl text-gray-500" />
            </div>
            <span className="text-gray-600 font-semibold">Full Name</span>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="First and Last Name"
              className={`w-full capitalize border ${nameError ? "border-red-500" : "border-gray-300"} rounded px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {nameError && (
              <p className="mt-1 text-red-500 text-sm">
                Please enter your full name (first and last)
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center mb-6 ">
          <div className="w-40 flex items-center gap-x-2">
            <div className="p-2 rounded-lg">
              <IoMailOutline className="text-xl text-gray-500" />
            </div>
            <span className="text-gray-600 font-semibold">Email</span>
          </div>
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="w-full h-fit grid grid-cols-2 gap-x-3">
          <div className="mb-6">
            <div className="flex items-center gap-x-3 mb-2">
              <IoCallOutline className="text-xl text-gray-500" />
              <span className="text-gray-600 font-medium">Mobile</span>
            </div>

            {mobileNumbers.map((mobile, index) => (
              <div key={mobile.id} className="flex items-start mb-3">
                <div className="flex-1 flex gap-x-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      {mobileCountry?.dialCode}
                    </div>
                    <input
                      type="tel"
                      className={`w-full pl-16 pr-3 py-3 outline-none border ${mobile.error ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Phone number"
                      value={mobile.value}
                      onChange={(e) => handleMobileChange(mobile.id, e.target.value)}
                    />
                  </div>
                  {index === 0 ? (
                    <button
                      type="button"
                      className="flex-shrink-0 w-12 h-12 cursor-pointer flex items-center justify-center bg-primary text-white rounded-lg hover:bg-gray-500 transition"
                      onClick={handleAddMobile}
                    >
                      <IoMdAdd size={20} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex-shrink-0 w-12 h-12 cursor-pointer flex items-center justify-center bg-red-100 border border-red-300 text-red-500 rounded-lg hover:bg-red-200 transition"
                      onClick={() => handleRemoveMobile(mobile.id)}
                    >
                      <FaMinus size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-x-3 mb-2">
                <IoCallOutline className="text-xl text-gray-500" />
              <span className="text-gray-600 font-medium">Landline</span>
            </div>

            <div className="flex items-start">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  {landlineCountry?.dialCode}
                </div>
                <input
                  type="tel"
                  className={`w-full pl-16 pr-3 outline-none py-3 border ${landlineError && landlineNumber ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Phone number"
                  value={landlineNumber}
                  onChange={(e) => handleLandlineChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {landlineError && landlineNumber && (
          <div className="mt-1 text-red-500 text-sm flex items-start">
            <svg className="w-4 h-4 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Please enter a valid phone number
          </div>
        )}
      </div>
    </div>
  );
});

export default ContactInformation;