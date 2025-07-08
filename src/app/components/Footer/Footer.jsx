import React from "react";
import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";
import SocialLinks from "./SocialLinks";

const Footer = () => {

  return (
    <footer className="bg-[#1f1f1f] text-gray-400 py-8 px-4 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* Copyright Section */}
        <div className="text-center text-sm">
          <p>
            © Copyright 2007 - {new Date().getFullYear()} <span className="font-bold">Property.com</span> All Rights
            Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
