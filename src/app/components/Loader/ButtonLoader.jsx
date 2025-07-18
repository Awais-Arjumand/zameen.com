"use client";

import React from 'react';

const ButtonLoader = ({ size = 'small', color = 'white' }) => {
  const sizeClass = size === 'small' ? 'h-4 w-4' : 'h-6 w-6';
  const borderColor = color === 'white' ? 'border-white' : 'border-blue-500';
  
  return (
    <div className={`${sizeClass} rounded-full border-2 border-t-transparent ${borderColor} animate-spin`}></div>
  );
};

export default ButtonLoader;