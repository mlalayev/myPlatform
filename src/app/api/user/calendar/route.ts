import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const year = parseInt(url.searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(url.searchParams.get('month') || (new Date().getMonth() + 1).toString());

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get start and end dates for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Initialize variables for calendar data
    let dailyActivities = [];
    let detailedActivities = [];

    // Try to get activity tracking data - use try/catch for new tables
    try {
      // Check if dailyActivity table exists by trying a simple query
      const tableExists = await prisma.$queryRaw`SELECT 1 FROM dailyActivity LIMIT 1`.catch(() => null);
      
      if (tableExists) {
      // Get daily activities for the month
      dailyActivities = await prisma.dailyActivity.findMany({
        where: {
          userId: user.id,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: {
          date: 'asc'
        }
      });

      // Get all activities for the month to show detailed view
      detailedActivities = await prisma.userActivity.findMany({
        where: {
          userId: user.id,
          timestamp: {
            gte: startDate,
            lte: new Date(endDate.getTime() + 24 * 60 * 60 * 1000) // Add one day to include end date
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        select: {
          type: true,
          description: true,
          timestamp: true,
          metadata: true
        }
      });
      } else {
        console.log("Activity tracking tables not available");
        dailyActivities = [];
        detailedActivities = [];
      }
    } catch (activityError) {
      console.log("Activity tracking not available yet:", activityError.message);
      // Use empty arrays when activity tracking tables are not available
      dailyActivities = [];
      detailedActivities = [];
    }

    // Format calendar data
    const calendarData = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayActivity = dailyActivities.find(
        activity => activity.date.toISOString().split('T')[0] === dateStr
      );

      const dayActivities = detailedActivities.filter(activity => {
        const activityDate = new Date(activity.timestamp).toISOString().split('T')[0];
        return activityDate === dateStr;
      });

      calendarData.push({
        date: dateStr,
        day: currentDate.getDate(),
        hasActivity: !!dayActivity,
        loginCount: dayActivity?.loginCount || 0,
        studyTimeMinutes: dayActivity ? Math.floor(dayActivity.studyTime / 60) : 0,
        lessonsViewed: dayActivity?.lessonsViewed || 0,
        quizzesTaken: dayActivity?.quizzesTaken || 0,
        exercisesSolved: dayActivity?.exercisesSolved || 0,
        pointsEarned: dayActivity?.pointsEarned || 0,
        activities: dayActivities.map(activity => ({
          type: activity.type.toLowerCase(),
          description: activity.description,
          time: activity.timestamp.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          metadata: activity.metadata
        }))
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Get monthly summary
    const monthlyStats = dailyActivities.reduce(
      (acc, day) => ({
        totalLoginDays: acc.totalLoginDays + (day.loginCount > 0 ? 1 : 0),
        totalStudyTimeHours: acc.totalStudyTimeHours + Math.floor(day.studyTime / 3600),
        totalLessonsViewed: acc.totalLessonsViewed + day.lessonsViewed,
        totalQuizzesTaken: acc.totalQuizzesTaken + day.quizzesTaken,
        totalExercisesSolved: acc.totalExercisesSolved + day.exercisesSolved,
        totalPointsEarned: acc.totalPointsEarned + day.pointsEarned,
      }),
      {
        totalLoginDays: 0,
        totalStudyTimeHours: 0,
        totalLessonsViewed: 0,
        totalQuizzesTaken: 0,
        totalExercisesSolved: 0,
        totalPointsEarned: 0,
      }
    );

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    while (checkDate >= startDate && dailyActivities.length > 0) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayActivity = dailyActivities.find(
        activity => activity.date.toISOString().split('T')[0] === dateStr
      );
      
      if (dayActivity && dayActivity.loginCount > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return NextResponse.json({
      year,
      month,
      calendarData,
      monthlyStats: {
        ...monthlyStats,
        currentStreak
      }
    });

  } catch (error) {
    console.error("Error fetching calendar data:", error);
    
    // Return default calendar data on error
    const year = parseInt(new URL(request.url).searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(new URL(request.url).searchParams.get('month') || (new Date().getMonth() + 1).toString());
    
    return NextResponse.json({
      year,
      month,
      calendarData: [],
      monthlyStats: {
        totalLoginDays: 0,
        totalStudyTimeHours: 0,
        totalLessonsViewed: 0,
        totalQuizzesTaken: 0,
        totalExercisesSolved: 0,
        totalPointsEarned: 0,
        currentStreak: 0
      }
    });
  }
} 