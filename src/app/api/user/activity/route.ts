import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { type, description, metadata } = body;

    // Always create the activity record for tracking
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        type,
        description,
        metadata,
      },
    });

    // Update or create daily activity record
    const now = new Date();
    const azerbaijanOffset = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    const azerbaijanTime = new Date(now.getTime() + azerbaijanOffset);
    const today = new Date(azerbaijanTime.getFullYear(), azerbaijanTime.getMonth(), azerbaijanTime.getDate());
    today.setHours(0, 0, 0, 0);

    let dailyActivity = await prisma.dailyActivity.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
    });

    if (!dailyActivity) {
      dailyActivity = await prisma.dailyActivity.create({
        data: {
          userId: user.id,
          date: today,
          loginCount: type === 'LOGIN' ? 1 : 0,
          studyTime: 0,
          lessonsViewed: type === 'LESSON_VIEW' ? 1 : 0,
          quizzesTaken: type === 'QUIZ_SUBMIT' ? 1 : 0,
          exercisesSolved: type === 'EXERCISE_SOLVE' ? 1 : 0,
          pointsEarned: 0,
        },
      });
    } else {
      // Update existing daily activity
      const updateData: any = {};
      
      if (type === 'LOGIN') {
        updateData.loginCount = dailyActivity.loginCount + 1;
      }
      if (type === 'LESSON_VIEW') {
        updateData.lessonsViewed = dailyActivity.lessonsViewed + 1; // Always increment lesson views
      }
      if (type === 'QUIZ_SUBMIT') {
        updateData.quizzesTaken = dailyActivity.quizzesTaken + 1;
      }
      if (type === 'EXERCISE_SOLVE') {
        updateData.exercisesSolved = dailyActivity.exercisesSolved + 1;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.dailyActivity.update({
          where: { id: dailyActivity.id },
          data: updateData,
        });
      }
    }

    // Update lesson progress tracking
    await updateLessonProgress(user.id, type, metadata);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { error: "Failed to log activity", details: error.message },
      { status: 500 }
    );
  }
}

// Function to update lesson progress tracking
async function updateLessonProgress(userId: number, activityType: string, metadata: any) {
  try {
    const now = new Date();
    const azerbaijanOffset = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    const azerbaijanTime = new Date(now.getTime() + azerbaijanOffset);
    const today = new Date(azerbaijanTime.getFullYear(), azerbaijanTime.getMonth(), azerbaijanTime.getDate());
    today.setHours(0, 0, 0, 0);

    // Get user's current visited lessons
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { visitedLessons: true }
    });

    if (!user?.visitedLessons || typeof user.visitedLessons !== 'object') {
      return;
    }

    const visitedData = user.visitedLessons;
    let totalVisitedLessons = 0;
    
    Object.keys(visitedData).forEach(language => {
      const lessons = (visitedData as any)[language];
      if (Array.isArray(lessons)) {
        totalVisitedLessons += lessons.length;
      }
    });

    // Get today's progress record
    let todayProgress = await prisma.userLessonProgress.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    if (!todayProgress) {
      // Create today's record
      todayProgress = await prisma.userLessonProgress.create({
        data: {
          userId,
          date: today,
          totalLessonsCompleted: totalVisitedLessons,
          lessonsCompletedToday: 0,
          exercisesCompletedToday: 0,
          studyTimeToday: 0,
        },
      });
    }

    // Calculate new lessons completed today
    const previousTotal = todayProgress.totalLessonsCompleted;
    const newLessonsToday = totalVisitedLessons - previousTotal;

    // Update today's record
    const updateData: any = {};
    
    if (newLessonsToday > 0) {
      updateData.lessonsCompletedToday = todayProgress.lessonsCompletedToday + newLessonsToday;
      updateData.totalLessonsCompleted = totalVisitedLessons;
    }

    if (activityType === 'EXERCISE_SOLVE') {
      updateData.exercisesCompletedToday = todayProgress.exercisesCompletedToday + 1;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.userLessonProgress.update({
        where: { id: todayProgress.id },
        data: updateData,
      });
    }

    // Ensure we have records for the last 7 days
    for (let i = 1; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const existingRecord = await prisma.userLessonProgress.findUnique({
        where: {
          userId_date: {
            userId,
            date: date,
          },
        },
      });

      if (!existingRecord) {
        // Create empty record for historical days
        await prisma.userLessonProgress.create({
          data: {
            userId,
            date: date,
            totalLessonsCompleted: totalVisitedLessons,
            lessonsCompletedToday: 0,
            exercisesCompletedToday: 0,
            studyTimeToday: 0,
          },
        });
      }
    }

  } catch (error) {
    console.error("Error updating lesson progress:", error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if this is a test request
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');
    
    if (test === 'lesson_views') {
      // Create some test lesson view activities
      const today = new Date();
      const activities = [];
      
      for (let i = 0; i < 5; i++) {
        const activity = await prisma.userActivity.create({
          data: {
            userId: user.id,
            type: 'LESSON_VIEW',
            description: `Test lesson view ${i + 1}`,
            metadata: {
              path: `/az/tutorials/javascript/test-${i + 1}`,
              timestamp: new Date(today.getTime() - i * 60000).toISOString() // 1 minute apart
            },
          },
        });
        activities.push(activity);
      }
      
      // Update daily activity
      let dailyActivity = await prisma.dailyActivity.findUnique({
        where: {
          userId_date: {
            userId: user.id,
            date: today,
          },
        },
      });

      if (!dailyActivity) {
        dailyActivity = await prisma.dailyActivity.create({
          data: {
            userId: user.id,
            date: today,
            loginCount: 0,
            studyTime: 0,
            lessonsViewed: 5,
            quizzesTaken: 0,
            exercisesSolved: 0,
            pointsEarned: 0,
          },
        });
      } else {
        await prisma.dailyActivity.update({
          where: { id: dailyActivity.id },
          data: {
            lessonsViewed: dailyActivity.lessonsViewed + 5
          },
        });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Created 5 test lesson views',
        activities: activities.length
      });
    }

    // Get recent activities
    const activities = await prisma.userActivity.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    // Get daily activities for the last 28 days for streak calculation
    const now = new Date();
    const azerbaijanOffset = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    const azerbaijanTime = new Date(now.getTime() + azerbaijanOffset);
    const today = new Date(azerbaijanTime.getFullYear(), azerbaijanTime.getMonth(), azerbaijanTime.getDate());
    today.setHours(0, 0, 0, 0);
    
    const twentyEightDaysAgo = new Date(today);
    twentyEightDaysAgo.setDate(today.getDate() - 28);
    twentyEightDaysAgo.setHours(0, 0, 0, 0);

    const dailyActivities = await prisma.dailyActivity.findMany({
      where: {
        userId: user.id,
        date: { gte: twentyEightDaysAgo }
      },
      orderBy: { date: 'asc' }
    });

    // Calculate streak data
    
    const streakDays = Array.from({ length: 28 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (27 - i));
      date.setHours(0, 0, 0, 0);
      
      const dayActivity = dailyActivities.find((activity: any) => {
        const activityDate = new Date(activity.date);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === date.getTime();
      });
      
      const isActive = dayActivity && (dayActivity.lessonsViewed > 0 || dayActivity.exercisesSolved > 0 || dayActivity.quizzesTaken > 0);
      const isToday = i === 27;
      
      return { 
        date, 
        isActive, 
        isToday,
        lessonsViewed: dayActivity?.lessonsViewed || 0,
        exercisesSolved: dayActivity?.exercisesSolved || 0,
        quizzesTaken: dayActivity?.quizzesTaken || 0
      };
    });

    return NextResponse.json({ 
      activities: activities.map((activity: any) => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        timestamp: activity.timestamp,
        metadata: activity.metadata
      })),
      streakDays
    });
  } catch (error: any) {
    console.error("Activity fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 