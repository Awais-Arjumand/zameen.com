'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function layout({ children }) {
  const { data: session } = useSession();
  const [color, setColor] = useState('#3B404C'); // fallback

  useEffect(() => {
    const fetchUserColor = async () => {
      if (!session?.user?.phone) return;

      const res = await fetch(`http://localhost:3000/api/users/${session.user.phone}`);
      const data = await res.json();
      const logoColor = data?.data?.logoColor || '#3B404C';

      setColor(logoColor);

      // Inject into body style
      if (typeof window !== 'undefined') {
        document.body.style.setProperty('--primary-color', logoColor);
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
