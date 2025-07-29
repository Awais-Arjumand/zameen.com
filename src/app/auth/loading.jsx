"use client";

import Image from 'next/image';
import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-30 backdrop-blur-lg">
      <div className="relative">
        {/* Double black spinners with different opacities */}
        <div className="h-24 w-24 rounded-full border-[6px] border-t-black border-b-black/20 animate-spin"></div>
        <div 
          className="absolute top-0 left-0 h-24 w-24 rounded-full border-[6px] border-t-black/80 border-b-black/10 animate-spin" 
          style={{ animationDirection: 'reverse', animationDuration: '2s' }}
        ></div>
        
        {/* Glossy black center with subtle glow */}
        <div className="absolute inset-0 flex items-center justify-center z-40 bg-">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br   p-1 shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center justify-center border border-black/30">
            <div className="relative h-16 w-16">
              <Image
                alt='Logo'
                src={"/images/Login/img2.svg"}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;