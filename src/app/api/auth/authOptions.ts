import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Account, Profile, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

const prisma = new PrismaClient();

export const authOptions = {
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
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email ?? "" },
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
        const isValid = await bcrypt.compare(credentials?.password ?? "", user.passwordHash);
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

        const userData = {
          id: String(user.id),
          name: user.username || user.email,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        };
        
        return userData;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: { user: User | AdapterUser; account: Account | null; profile?: Profile | undefined }) {
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
          // Add a flag to indicate this is a new user
          (user as unknown as { isNewUser: boolean }).isNewUser = true;
          // Set the avatar URL from Google
          (user as any).avatarUrl = user.image || null;
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
          // Set the avatar URL from Google
          (user as any).avatarUrl = user.image || existingUser.avatarUrl;
        }
        // Ensure avatarUrl is set from image for both new and existing users
        if (user.image && !(user as any).avatarUrl) {
          (user as any).avatarUrl = user.image;
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
        token.isNewUser = (user as unknown as { isNewUser: boolean })?.isNewUser || false;
        // Use avatarUrl if available, otherwise fall back to image
        token.avatarUrl = user.avatarUrl || user.image;
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
        // Use avatarUrl from token, or fall back to image from session
        session.user.avatarUrl = token.avatarUrl || session.user.image;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
}; 