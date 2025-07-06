import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Debug logging
console.log("Google OAuth Config Check:");
console.log("GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET);

type UserWithAuthFields = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string | null;
};

const authOptions = {
  // Remove the problematic adapter for now - we'll handle OAuth manually
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered:", { 
        provider: account?.provider, 
        userEmail: user?.email,
        hasProfile: !!profile 
      });
      
      // If user signs in with Google and doesn't exist, create them
      if (account?.provider === "google" && profile) {
        console.log("Processing Google sign-in for:", user.email);
        
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          console.log("Creating new user from Google profile");
          // Create new user from Google profile
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || "",
              username: user.name || user.email!.split('@')[0],
              isVerified: true, // Google accounts are pre-verified
              avatarUrl: user.image || null,
              role: "USER",
              dailyLoginPoints: 1,
              lastLoginDate: new Date(),
            },
          });
          // Update the user object with the database ID
          user.id = String(newUser.id);
          // Add a flag to indicate this is a new user
          (user as any).isNewUser = true;
        } else {
          console.log("Updating existing user with Google info");
          // Update existing user's Google info
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              avatarUrl: user.image || existingUser.avatarUrl,
              lastLoginDate: new Date(),
              dailyLoginPoints: (existingUser.dailyLoginPoints || 0) + 1,
            },
          });
          // Update the user object with the database ID
          user.id = String(existingUser.id);
        }
      }
      return true;
    },
    async jwt({ token, user }: { token: any, user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.isNewUser = (user as any).isNewUser || false;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.isNewUser = token.isNewUser || false;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };