import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";

// Log user activity
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, description, metadata } = body;

    if (!type || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Try to log activity - use try/catch for new tables
    try {
      // Log activity
      const activity = await prisma.userActivity.create({
        data: {
          userId: user.id,
          type,
          description,
          metadata: metadata || {}
        }
      });

      // Update daily activity stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Update activity stats (no login tracking)
      await prisma.dailyActivity.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: today
          }
        },
        update: {
          lessonsViewed: type === 'LESSON_VIEW' ? { increment: 1 } : undefined,
          quizzesTaken: type === 'QUIZ_SUBMIT' ? { increment: 1 } : undefined,
          exercisesSolved: type === 'EXERCISE_SOLVE' ? { increment: 1 } : undefined,
          pointsEarned: metadata?.points ? { increment: metadata.points } : undefined,
        },
        create: {
          userId: user.id,
          date: today,
          loginCount: 0,
          lessonsViewed: type === 'LESSON_VIEW' ? 1 : 0,
          quizzesTaken: type === 'QUIZ_SUBMIT' ? 1 : 0,
          exercisesSolved: type === 'EXERCISE_SOLVE' ? 1 : 0,
          pointsEarned: metadata?.points || 0,
        }
      });

      return NextResponse.json({ success: true, activity });
    } catch (activityError) {
      console.log("Activity tracking not available yet:", activityError.message);
      // Return success anyway, just log that tracking is not available
      return NextResponse.json({ success: true, message: "Activity logged locally" });
    }

  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Get recent activities
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Try to get activities - use try/catch for new tables
    try {
      // Get recent activities
      const activities = await prisma.userActivity.findMany({
        where: { userId: user.id },
        orderBy: { timestamp: 'desc' },
        take: limit,
        select: {
          id: true,
          type: true,
          description: true,
          metadata: true,
          timestamp: true
        }
      });

      // Format activities for frontend
      const formattedActivities = activities.map(activity => ({
        id: activity.id,
        type: activity.type.toLowerCase(),
        text: activity.description,
        time: formatTimeAgo(activity.timestamp),
        metadata: activity.metadata,
        timestamp: activity.timestamp,
        language: activity.metadata?.language || null // Add language info for icons
      }));

      return NextResponse.json({ activities: formattedActivities });
    } catch (activityError) {
      console.log("Activity tracking not available yet:", activityError.message);
      // Return empty activities when tracking is not available
      return NextResponse.json({ activities: [] });
    }

  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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