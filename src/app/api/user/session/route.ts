import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";

// Start a new session
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Try to create session - use try/catch for new tables
    try {
      // Get IP and User Agent
      const ipAddress = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';

      // Create new session
      const userSession = await prisma.userSession.create({
        data: {
          userId: user.id,
          startTime: new Date(),
          ipAddress: ipAddress.split(',')[0].trim(), // Get first IP if multiple
          userAgent
        }
      });

      return NextResponse.json({ success: true, sessionId: userSession.id });
    } catch (sessionError: any) {
      console.log("Session tracking not available yet:", sessionError.message);
      // Return mock session ID when tracking is not available
      return NextResponse.json({ success: true, sessionId: Date.now() });
    }

  } catch (error) {
    console.error("Error starting session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// End session and calculate duration
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Try to end session - use try/catch for new tables
    try {
      // Get session
      const userSession = await prisma.userSession.findFirst({
        where: { 
          id: sessionId,
          userId: user.id,
          endTime: null // Only update if not already ended
        }
      });

      if (!userSession) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }

      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - userSession.startTime.getTime()) / 1000);

      // Update session with end time and duration
      await prisma.userSession.update({
        where: { id: sessionId },
        data: {
          endTime,
          duration
        }
      });

      // Update daily study time
      const now = new Date();
      const azerbaijanOffset = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
      const azerbaijanTime = new Date(now.getTime() + azerbaijanOffset);
      const today = new Date(azerbaijanTime.getFullYear(), azerbaijanTime.getMonth(), azerbaijanTime.getDate());
      today.setHours(0, 0, 0, 0);

      await prisma.dailyActivity.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: today
          }
        },
        update: {
          studyTime: { increment: duration }
        },
        create: {
          userId: user.id,
          date: today,
          studyTime: duration,
        }
      });

      return NextResponse.json({ success: true, duration });
    } catch (sessionError: any) {
      console.log("Session tracking not available yet:", sessionError.message);
      // Return success anyway when tracking is not available
      return NextResponse.json({ success: true, duration: 0 });
    }

  } catch (error) {
    console.error("Error ending session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Get session statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Try to get session stats - use try/catch for new tables
    try {
      // Get session statistics
      const totalSessions = await prisma.userSession.count({
        where: { userId: user.id }
      });

      const totalStudyTime = await prisma.userSession.aggregate({
        where: { 
          userId: user.id,
          duration: { not: null }
        },
        _sum: {
          duration: true
        }
      });

      const averageSessionTime = totalSessions > 0 && totalStudyTime._sum.duration 
        ? Math.floor(totalStudyTime._sum.duration / totalSessions)
        : 0;

      // Get this week's study time
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weeklyStudyTime = await prisma.userSession.aggregate({
        where: { 
          userId: user.id,
          startTime: { gte: weekAgo },
          duration: { not: null }
        },
        _sum: {
          duration: true
        }
      });

      const stats = {
        totalSessions,
        totalStudyTimeHours: Math.floor((totalStudyTime._sum.duration || 0) / 3600),
        averageSessionMinutes: Math.floor(averageSessionTime / 60),
        weeklyStudyTimeHours: Math.floor((weeklyStudyTime._sum.duration || 0) / 3600)
      };

      return NextResponse.json({ stats });
    } catch (sessionError: any) {
      console.log("Session tracking not available yet:", sessionError.message);
      // Return empty stats when tracking is not available
      const stats = {
        totalSessions: 0,
        totalStudyTimeHours: 0,
        averageSessionMinutes: 0,
        weeklyStudyTimeHours: 0
      };

      return NextResponse.json({ stats });
    }

  } catch (error) {
    console.error("Error fetching session stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 