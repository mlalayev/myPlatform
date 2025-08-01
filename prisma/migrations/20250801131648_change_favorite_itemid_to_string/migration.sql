-- CreateEnum
CREATE TYPE "public"."GoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'OVERDUE', 'PAUSED');

-- CreateEnum
CREATE TYPE "public"."GoalPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."GoalDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "public"."FavoriteType" AS ENUM ('LESSON', 'EXERCISE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."ActivityType" ADD VALUE 'ACHIEVEMENT_UNLOCKED';
ALTER TYPE "public"."ActivityType" ADD VALUE 'DAILY_LOGIN';
ALTER TYPE "public"."ActivityType" ADD VALUE 'STREAK_MAINTAINED';

-- CreateTable
CREATE TABLE "public"."LearningGoal" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "public"."GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3),
    "priority" "public"."GoalPriority" NOT NULL DEFAULT 'MEDIUM',
    "difficulty" "public"."GoalDifficulty" NOT NULL DEFAULT 'MEDIUM',
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "estimatedTime" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LearningGoalMilestone" (
    "id" SERIAL NOT NULL,
    "goalId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "LearningGoalMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Favorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "public"."FavoriteType" NOT NULL,
    "itemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearningGoal_userId_status_idx" ON "public"."LearningGoal"("userId", "status");

-- CreateIndex
CREATE INDEX "LearningGoal_category_idx" ON "public"."LearningGoal"("category");

-- CreateIndex
CREATE INDEX "LearningGoalMilestone_goalId_order_idx" ON "public"."LearningGoalMilestone"("goalId", "order");

-- CreateIndex
CREATE INDEX "Favorite_userId_type_idx" ON "public"."Favorite"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_type_itemId_key" ON "public"."Favorite"("userId", "type", "itemId");

-- AddForeignKey
ALTER TABLE "public"."LearningGoal" ADD CONSTRAINT "LearningGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningGoalMilestone" ADD CONSTRAINT "LearningGoalMilestone_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "public"."LearningGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
