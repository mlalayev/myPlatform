import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { achievementId, coins } = await request.json();
    
    if (!achievementId || !coins) {
      return NextResponse.json({ error: "Achievement ID and coins are required" }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, dailyLoginPoints: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if achievement exists and is unlocked but not claimed
    // Use achievement name instead of ID since we're passing names from frontend
    const achievement = await prisma.achievement.findFirst({
      where: { 
        name: achievementId, // Use name instead of ID
        userId: user.id,
        unlockedAt: { not: null }
      }
    });

    if (!achievement) {
      return NextResponse.json({ error: "Achievement not found or not unlocked" }, { status: 404 });
    }

    // Check if already claimed
    if (achievement.claimed) {
      return NextResponse.json({ error: "Achievement already claimed" }, { status: 400 });
    }

    // Add coins to user's dailyLoginPoints
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        dailyLoginPoints: {
          increment: coins
        }
      },
      select: {
        dailyLoginPoints: true
      }
    });

    // Mark achievement as claimed
    await prisma.achievement.update({
      where: { id: achievement.id },
      data: {
        claimed: true
      }
    });

    // Log activity
    try {
      await prisma.userActivity.create({
        data: {
          userId: user.id,
          type: "ACHIEVEMENT_EARNED",
          description: `Claimed ${coins} coins for achievement: ${achievement.name}`,
          metadata: { 
            achievementId: achievement.id,
            achievementName: achievement.name,
            coinsEarned: coins
          }
        }
      });
    } catch (activityError) {
      console.log("Activity logging failed:", activityError);
    }

    return NextResponse.json({
      success: true,
      coinsEarned: coins,
      newTotalCoins: updatedUser.dailyLoginPoints,
      message: `Successfully claimed ${coins} coins!`
    });

  } catch (error) {
    console.error("Error claiming achievement reward:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 