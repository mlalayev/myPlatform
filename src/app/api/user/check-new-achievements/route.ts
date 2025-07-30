import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's current achievements
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        achievements: {
          orderBy: { unlockedAt: 'desc' },
          take: 1 // Get the most recent achievement
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has any achievements
    if (user.achievements.length === 0) {
      return NextResponse.json({ hasNewAchievement: false });
    }

    // Get the most recent achievement
    const latestAchievement = user.achievements[0];

    // Check if this achievement was already shown in popup
    // We'll use a simple approach: check if it was unlocked in the last 5 seconds
    const fiveSecondsAgo = new Date(Date.now() - 5000);
    
    if (latestAchievement.unlockedAt && latestAchievement.unlockedAt > fiveSecondsAgo && !latestAchievement.claimed) {
      // Mark as claimed to prevent showing again
      await prisma.achievement.update({
        where: { id: latestAchievement.id },
        data: { claimed: true }
      });

      return NextResponse.json({
        hasNewAchievement: true,
        achievement: {
          name: latestAchievement.name,
          description: latestAchievement.description,
          rarity: latestAchievement.rarity.toLowerCase(),
          coins: latestAchievement.points
        }
      });
    }

    return NextResponse.json({ hasNewAchievement: false });

  } catch (error) {
    console.error('Error checking new achievements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 