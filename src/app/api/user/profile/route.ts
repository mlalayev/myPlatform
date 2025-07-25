import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

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

    // Calculate stats
    const visitedLessonsArray = user.visitedLessons ? JSON.parse(user.visitedLessons as string) : [];
    const savedLessonsArray = user.savedLessons || 0;
    const progressData = user.progress || 0;
    
    // Calculate login streak (basic implementation)
    const lastLogin = user.lastLoginDate;
    const today = new Date();
    const daysDiff = lastLogin ? Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const loginStreak = daysDiff <= 1 ? (daysDiff === 0 ? 7 : 6) : 1; // Mock streak logic
    
    // Calculate today's coins (if last login was today)
    const todayCoins = daysDiff === 0 ? 50 : 0;
    
    // Mock data for lessons and exercises (you can extend this with real data)
    const totalLessons = 150; // This should come from your lessons table
    const completedLessons = visitedLessonsArray.length;
    const totalExercises = 300; // This should come from your exercises table
    const solvedExercises = user.completedChallenges || 0;
    
    // Calculate completion percentage
    const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    // Mock study time calculation (this should be tracked separately)
    const studyTimeHours = Math.floor(completedLessons * 2.5 + solvedExercises * 1.2);
    
    // Get user rank based on points
    let rank = "Beginner";
    if (user.dailyLoginPoints >= 5000) rank = "Expert";
    else if (user.dailyLoginPoints >= 2000) rank = "Advanced";
    else if (user.dailyLoginPoints >= 500) rank = "Intermediate";
    
    // Recent activities (mock data - you should track this in database)
    const recentActivities = [
      {
        type: "coin",
        text: `Earned ${todayCoins} coins for daily login`,
        time: "2 hours ago",
        icon: "coin"
      },
      {
        type: "lesson",
        text: "Completed \"JavaScript Arrays\" lesson",
        time: "1 day ago", 
        icon: "lesson"
      },
      {
        type: "exercise",
        text: "Solved \"Two Sum\" exercise",
        time: "2 days ago",
        icon: "exercise"
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
      
      // Activities
      recentActivities,
      
      // Progress trends (mock data)
      weeklyProgress: {
        lessonsThisWeek: Math.floor(Math.random() * 5) + 1,
        exercisesThisWeek: Math.floor(Math.random() * 10) + 3,
        studyTimeThisWeek: Math.floor(Math.random() * 15) + 5,
      }
    };

    return NextResponse.json(userStats);
    
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 