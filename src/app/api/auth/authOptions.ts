import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            select: {
              id: true,
              email: true,
              username: true,
              passwordHash: true,
              role: true,
              avatarUrl: true,
              dailyLoginPoints: true,
              lastLoginDate: true,
            }
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
          if (!isValid) {
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
            await prisma.user.update({
              where: { id: user.id },
              data: {
                dailyLoginPoints: (user.dailyLoginPoints || 0) + 1,
                lastLoginDate: today,
              },
            });
          }

          return {
            id: String(user.id),
            email: user.email,
            name: user.username,
            username: user.username,
            role: user.role,
            avatarUrl: user.avatarUrl,
            dailyLoginPoints: user.dailyLoginPoints,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // If user signs in with Google and doesn't exist, create them
        if (account?.provider === "google" && profile) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
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
          } else {
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
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.username = (user as any).username;
        token.avatarUrl = (user as any).avatarUrl;
        token.dailyLoginPoints = (user as any).dailyLoginPoints;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
        (session.user as any).avatarUrl = token.avatarUrl;
        (session.user as any).dailyLoginPoints = token.dailyLoginPoints;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
};

// Create NextAuth instance
const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Export for backwards compatibility and new v5 format
export const authOptions = authConfig;
export { handlers, auth, signIn, signOut };
