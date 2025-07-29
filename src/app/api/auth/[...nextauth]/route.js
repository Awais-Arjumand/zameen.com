import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../../lib/mongodb";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        code: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials, req) {
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
            id: user._id, 
            phone: user.phone,
            name: user.fullName,  // Include full name
            fullName: user.fullName, // Duplicate for consistency
            companyName: user.companyName, // Include company name
            logo: user.logo, // Include logo path
            logoColor: user.logoColor // Include logo color
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
      // Persist user data to the token right after sign in
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
      // Send properties to the client
      if (token) {
        session.user.id = token.id;
        session.user.phone = token.phone;
        session.user.fullName = token.fullName;
        session.user.companyName = token.companyName;
        session.user.logo = token.logo;
        session.user.logoColor = token.logoColor;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };