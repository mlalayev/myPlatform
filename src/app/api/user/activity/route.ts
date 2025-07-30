import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, description, metadata } = await request.json();
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // For LESSON_VIEW, check if user has already been tracked today
    if (type === 'LESSON_VIEW') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Check if user already has a LESSON_VIEW activity today
      const existingActivity = await prisma.userActivity.findFirst({
        where: {
          userId: user.id,
          type: 'LESSON_VIEW',
          timestamp: {
            gte: today,
            lt: tomorrow
          }
        }
      });

      // If already tracked today, don't create another record
      if (existingActivity) {
        return NextResponse.json({ success: true, message: "Already tracked today" });
      }
    }

    // Create activity record
    const activity = await prisma.userActivity.create({
      data: {
        userId: user.id,
        type,
        description,
        metadata: metadata || {},
        timestamp: new Date()
      }
    });

    // Update daily activity for streak tracking
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if today's activity record exists
    let dailyActivity = await prisma.dailyActivity.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today
        }
      }
    });

    if (!dailyActivity) {
      // Create new daily activity record
      dailyActivity = await prisma.dailyActivity.create({
        data: {
          userId: user.id,
          date: today,
          loginCount: 0,
          studyTime: 0,
          lessonsViewed: 0,
          quizzesTaken: 0,
          exercisesSolved: 0,
          pointsEarned: 0
        }
      });
    }

    // Update daily activity based on activity type
    const updateData: any = {};
    
    switch (type) {
      case 'LESSON_VIEW':
        // Only increment if this is the first lesson view of the day
        if (!dailyActivity.lessonsViewed || dailyActivity.lessonsViewed === 0) {
          updateData.lessonsViewed = 1;
          updateData.pointsEarned = { increment: 10 };
        }
        break;
      case 'EXERCISE_SOLVE':
        updateData.exercisesSolved = { increment: 1 };
        updateData.pointsEarned = { increment: 50 };
        break;
      case 'QUIZ_SUBMIT':
        updateData.quizzesTaken = { increment: 1 };
        updateData.pointsEarned = { increment: 25 };
        break;
      case 'LOGIN':
        updateData.loginCount = { increment: 1 };
        break;
    }

    // Update daily activity
    if (Object.keys(updateData).length > 0) {
      await prisma.dailyActivity.update({
        where: { id: dailyActivity.id },
        data: updateData
      });
    }

    // Update user's daily login points
    if (type === 'LOGIN') {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          dailyLoginPoints: { increment: 10 },
          lastLoginDate: new Date()
        }
      });
    }

    return NextResponse.json({ success: true, activity });
  } catch (error: any) {
    console.error("Activity tracking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get recent activities
    const activities = await prisma.userActivity.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
      take: 20
    });

    // Get daily activities for the last 28 days for streak calculation
    const twentyEightDaysAgo = new Date();
    twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);
    twentyEightDaysAgo.setHours(0, 0, 0, 0);

    const dailyActivities = await prisma.dailyActivity.findMany({
      where: {
        userId: user.id,
        date: { gte: twentyEightDaysAgo }
      },
      orderBy: { date: 'asc' }
    });

    // Calculate streak data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const streakDays = Array.from({ length: 28 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (27 - i));
      date.setHours(0, 0, 0, 0);
      
      const dayActivity = dailyActivities.find(activity => {
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
      activities: activities.map(activity => ({
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