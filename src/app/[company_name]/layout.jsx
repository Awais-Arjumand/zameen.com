'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import apiClient from '../../../src/service/apiClient';

export default function layout({ children }) {
  const { data: session } = useSession();
  const [color, setColor] = useState('#3B404C'); // fallback

  useEffect(() => {
    const fetchUserColor = async () => {
      if (!session?.user?.phone) return;
  
      try {
        const res = await apiClient.get(`/users/${session.user.phone}`);
        const logoColor = res.data?.data?.logoColor || '#3B404C';
  
        setColor(logoColor);
  
        if (typeof window !== 'undefined') {
          document.body.style.setProperty('--primary-color', logoColor);
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
