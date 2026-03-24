-- CreateTable
CREATE TABLE "public"."UserLessonProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "totalLessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "lessonsCompletedToday" INTEGER NOT NULL DEFAULT 0,
    "exercisesCompletedToday" INTEGER NOT NULL DEFAULT 0,
    "studyTimeToday" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserLessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserLessonProgress_userId_date_idx" ON "public"."UserLessonProgress"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "UserLessonProgress_userId_date_key" ON "public"."UserLessonProgress"("userId", "date");

-- AddForeignKey
ALTER TABLE "public"."UserLessonProgress" ADD CONSTRAINT "UserLessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
