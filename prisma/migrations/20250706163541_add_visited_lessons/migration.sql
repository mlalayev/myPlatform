-- AlterTable
ALTER TABLE "User" ADD COLUMN     "visitedLessons" TEXT[] DEFAULT ARRAY[]::TEXT[];
