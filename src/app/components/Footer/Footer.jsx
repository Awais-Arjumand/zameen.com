import React from "react";


const Footer = () => {

  return (
    <footer className="bg-white text-gray-400 py-5 shadow-t-3xl px-4 md:px-8 lg:px-20">
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
