"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function CustomSessionProvider({ children }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
