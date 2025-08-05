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

    // Get Azərbaycan vaxtı ilə bugünkü gün
    const now = new Date();
    
    // Use proper timezone calculation
    const azerbaijanTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Baku"}));
    const today = new Date(azerbaijanTime.getFullYear(), azerbaijanTime.getMonth(), azerbaijanTime.getDate());
    
    console.log('Calendar Debug - Current UTC time:', now.toISOString());
    console.log('Calendar Debug - Azerbaijan time:', azerbaijanTime.toISOString());
    console.log('Calendar Debug - Today (Final):', today.toISOString());
    console.log('Calendar Debug - Today day:', today.getDate());
    console.log('Calendar Debug - Today month:', today.getMonth() + 1);
    
    // Son 7 günü hesabla (bugünkü gün də daxil olmaqla)
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 6); // 7 gün əvvəl

    console.log('Calendar date range:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      today: today.toISOString(),
      azerbaijanTime: azerbaijanTime.toISOString()
    });

    // Initialize variables for calendar data
    let dailyActivities: any[] = [];
    let detailedActivities: any[] = [];

    // Try to get activity tracking data - use try/catch for new tables
    try {
      // Check if dailyActivity table exists by trying a simple query
      const tableExists = await prisma.$queryRaw`SELECT 1 FROM dailyActivity LIMIT 1`.catch(() => null);
      
      if (tableExists) {
      // Get daily activities for the last 7 days
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

      // Get all activities for the last 7 days to show detailed view
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
      console.log("Activity tracking not available yet:", activityError instanceof Error ? activityError.message : 'Unknown error');
      // Use empty arrays when activity tracking tables are not available
      dailyActivities = [];
      detailedActivities = [];
    }

    // Format calendar data for last 7 days
    const calendarData = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Azərbaycan vaxtı ilə tarix formatı
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      
      const dayActivity = dailyActivities.find((activity: any) => {
        const activityDate = new Date(activity.date);
        const activityDateStr = `${activityDate.getFullYear()}-${String(activityDate.getMonth() + 1).padStart(2, '0')}-${String(activityDate.getDate()).padStart(2, '0')}`;
        return activityDateStr === dateStr;
      });

      const dayActivities = detailedActivities.filter((activity: any) => {
        const activityDate = new Date(activity.timestamp);
        const activityDateStr = `${activityDate.getFullYear()}-${String(activityDate.getMonth() + 1).padStart(2, '0')}-${String(activityDate.getDate()).padStart(2, '0')}`;
        return activityDateStr === dateStr;
      });

      calendarData.push({
        date: dateStr,
        day: currentDate.getDate(),
        hasActivity: dayActivity ? (dayActivity.studyTime > 0 || dayActivity.lessonsViewed > 0 || dayActivity.exercisesSolved > 0) : false,
        loginCount: dayActivity?.loginCount || 0,
        studyTimeMinutes: dayActivity ? Math.floor(dayActivity.studyTime / 60) : 0,
        lessonsViewed: dayActivity?.lessonsViewed || 0,
        quizzesTaken: dayActivity?.quizzesTaken || 0,
        exercisesSolved: dayActivity?.exercisesSolved || 0,
        pointsEarned: dayActivity?.pointsEarned || 0,
        activities: dayActivities.map((activity: any) => ({
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

    // Get weekly summary (last 7 days)
    const weeklyStats = dailyActivities.reduce(
      (acc: any, day: any) => ({
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

    // Calculate current streak using Azərbaycan vaxtı
    let currentStreak = 0;
    const checkDate = new Date(today);
    
    while (checkDate >= startDate && dailyActivities.length > 0) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      const dayActivity = dailyActivities.find((activity: any) => {
        const activityDate = new Date(activity.date);
        const activityDateStr = `${activityDate.getFullYear()}-${String(activityDate.getMonth() + 1).padStart(2, '0')}-${String(activityDate.getDate()).padStart(2, '0')}`;
        return activityDateStr === dateStr;
      });
      
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
      weeklyStats: {
        ...weeklyStats,
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
      weeklyStats: {
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