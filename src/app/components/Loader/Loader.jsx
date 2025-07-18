"use client";

import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-green-500 animate-spin"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center">
            <div className="text-green-500 font-bold">Z</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;