-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyLoginPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastLoginDate" TIMESTAMP(3);
