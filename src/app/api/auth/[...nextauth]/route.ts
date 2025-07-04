import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type UserWithAuthFields = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string | null;
};

const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credentials received:", credentials);
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email ?? "" },
        });
        console.log("User found:", user);
        if (!user || !user.passwordHash) {
          console.log("No user or no passwordHash");
          return null;
        }
        console.log("PasswordHash:", user.passwordHash);
        const isValid = await bcrypt.compare(credentials?.password ?? "", user.passwordHash);
        console.log("Password valid:", isValid);
        if (!isValid) {
          console.log("Password is not valid");
          return null;
        }

        // Daily login points logic
        const today = new Date();
        const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
        const isNewDay = !lastLogin ||
          today.getFullYear() !== lastLogin.getFullYear() ||
          today.getMonth() !== lastLogin.getMonth() ||
          today.getDate() !== lastLogin.getDate();
        if (isNewDay) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                dailyLoginPoints: (user.dailyLoginPoints || 0) + 1,
                lastLoginDate: today,
              },
            });
          } catch (err) {
            console.error('Failed to update daily login points:', err);
          }
        }

        return {
          id: String(user.id),
          name: user.username || user.email,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };