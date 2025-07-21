import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";

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

          return { id: user._id, phone: user.phone };
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
});

export { handler as GET, handler as POST };
