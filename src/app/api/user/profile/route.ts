import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        lastLoginDate: true,
        dailyLoginPoints: true,
        completedChallenges: true,
        visitedLessons: true,
        savedLessons: true,
        progress: true,
        premiumStatus: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize variables for activity tracking data
    let recentActivities = [];
    let sessionStats = { _sum: { duration: 0 } };
    let todayActivity = null;
    let loginStreak = 0;
    let weeklyStats = { 
      _sum: { 
        lessonsViewed: 0, 
        exercisesSolved: 0, 
        studyTime: 0, 
        pointsEarned: 0 
      } 
    };

    // Try to get activity tracking data - use try/catch for new tables
    try {
      // Get recent activities from the new tracking system
      recentActivities = await prisma.userActivity.findMany({
        where: { userId: user.id },
        orderBy: { timestamp: 'desc' },
        take: 10,
        select: {
          type: true,
          description: true,
          timestamp: true,
          metadata: true
        }
      });

      // Get session statistics
      sessionStats = await prisma.userSession.aggregate({
        where: { 
          userId: user.id,
          duration: { not: null }
        },
        _sum: {
          duration: true
        }
      });

      // Get today's activity
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      todayActivity = await prisma.dailyActivity.findUnique({
        where: {
          userId_date: {
            userId: user.id,
            date: today
          }
        }
      });

      // Calculate login streak
      let checkDate = new Date(today);
      while (true) {
        const dayActivity = await prisma.dailyActivity.findUnique({
          where: {
            userId_date: {
              userId: user.id,
              date: checkDate
            }
          }
        });
        
        if (dayActivity && dayActivity.loginCount > 0) {
          loginStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
        
        // Limit to prevent infinite loop
        if (loginStreak > 365) break;
      }

      // Get this week's statistics
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      weekAgo.setHours(0, 0, 0, 0);

      weeklyStats = await prisma.dailyActivity.aggregate({
        where: {
          userId: user.id,
          date: { gte: weekAgo }
        },
        _sum: {
          lessonsViewed: true,
          exercisesSolved: true,
          studyTime: true,
          pointsEarned: true
        }
      });
    } catch (activityError) {
      console.log("Activity tracking not available yet:", activityError.message);
      // Use fallback mock data when activity tracking tables are not available
    }

    // Calculate stats
    const visitedLessonsArray = Array.isArray(user.visitedLessons) 
      ? user.visitedLessons 
      : (user.visitedLessons && typeof user.visitedLessons === 'object') 
        ? Object.values(user.visitedLessons).flat()
        : [];
    
    // Mock data for lessons and exercises (you can extend this with real data)
    const totalLessons = 150; // This should come from your lessons table
    const completedLessons = visitedLessonsArray.length;
    const totalExercises = 300; // This should come from your exercises table
    const solvedExercises = user.completedChallenges || 0;
    
    // Calculate completion percentage
    const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    // Calculate study time from session data
    const studyTimeHours = Math.floor((sessionStats._sum.duration || 0) / 3600);
    
    // Get user rank based on points
    let rank = "Beginner";
    if (user.dailyLoginPoints >= 5000) rank = "Expert";
    else if (user.dailyLoginPoints >= 2000) rank = "Advanced";
    else if (user.dailyLoginPoints >= 500) rank = "Intermediate";
    
    // Calculate today's coins based on today's activity
    const todayCoins = todayActivity?.pointsEarned || 0;

    // Format recent activities for frontend
    const formattedActivities = recentActivities.length > 0 
      ? recentActivities.map(activity => ({
          type: activity.type.toLowerCase(),
          text: activity.description,
          time: formatTimeAgo(activity.timestamp),
          metadata: activity.metadata
        }))
      : [
          {
            type: "login",
            text: "Welcome to the platform!",
            time: "Just now",
            metadata: {}
          }
        ];

    const userStats = {
      // User info
      user: {
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        premiumStatus: user.premiumStatus,
        joinDate: user.createdAt,
        lastActive: user.lastLoginDate,
      },
      
      // Coin system
      dailyLoginPoints: user.dailyLoginPoints || 0,
      todayCoins,
      loginStreak,
      
      // Learning stats
      totalLessons,
      completedLessons,
      totalExercises,
      solvedExercises,
      completionRate,
      studyTimeHours,
      rank,
      
      // Real activities from tracking system
      recentActivities: formattedActivities,
      
      // Progress trends from real data
      weeklyProgress: {
        lessonsThisWeek: weeklyStats._sum.lessonsViewed || 0,
        exercisesThisWeek: weeklyStats._sum.exercisesSolved || 0,
        studyTimeThisWeek: Math.floor((weeklyStats._sum.studyTime || 0) / 3600),
        pointsThisWeek: weeklyStats._sum.pointsEarned || 0,
      }
    };

    return NextResponse.json(userStats);
    
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString();
} 