// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        code: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) {
          return null;
        }

        const client = await clientPromise;
        const db = client.db();

        const user = await db.collection("users").findOne({
          phone: credentials.phone,
        });

        if (user && user.verificationCode === credentials.code) {
          await db
            .collection("users")
            .updateOne({ _id: user._id }, { $unset: { verificationCode: "" } });

          return { 
            id: user._id.toString(), 
            phone: user.phone,
            name: user.fullName,
            fullName: user.fullName,
            companyName: user.companyName,
            logo: user.logo,
            logoColor: user.logoColor
          };
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.fullName = user.fullName;
        token.companyName = user.companyName;
        token.logo = user.logo;
        token.logoColor = user.logoColor;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.phone = token.phone;
        session.user.fullName = token.fullName;
        session.user.companyName = token.companyName;
        session.user.logo = token.logo ;
        session.user.logoColor = token.logoColor;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };