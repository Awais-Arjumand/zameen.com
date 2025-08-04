'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import apiClient from '../../../src/service/apiClient';

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [color, setColor] = useState('#3B404C'); // fallback
  const [secondaryColor, setSecondaryColor] = useState('rgba(59, 64, 76, 0.7)'); // fallback for secondary

  useEffect(() => {
    const fetchUserColor = async () => {
      if (!session?.user?.phone) return;
  
      try {
        const res = await apiClient.get(`/users/${session.user.phone}`);
        const logoColor = res.data?.data?.logoColor || '#3B404C';
  
        setColor(logoColor);
        
        // Create secondary color with 70% opacity
        const hexToRgb = (hex) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `${r}, ${g}, ${b}`;
        };
        
        const rgbColor = hexToRgb(logoColor);
        const secColor = `rgba(${rgbColor}, 0.6)`;
        setSecondaryColor(secColor);
  
        if (typeof window !== 'undefined') {
          document.documentElement.style.setProperty('--primary-color', logoColor);
          document.documentElement.style.setProperty('--secondary-color', secColor);
        }
      } catch (error) {
        console.error("Failed to fetch user color:", error);
      }
    };
  
    fetchUserColor();
  }, [session]);
  

  return (
    <div>
      {children}
    </div>
  );
}