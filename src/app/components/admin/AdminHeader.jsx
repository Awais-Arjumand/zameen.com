// ✅ components/AdminHeader.jsx
"use client";

import { UserButton } from "@clerk/nextjs";

export default function AdminHeader() {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
    </header>
  );
}
