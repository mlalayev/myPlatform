import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/authOptions';
import { prisma } from '@/lib/prisma';

// PUT - Update milestone completion status
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { milestoneId, completed } = body;

    if (milestoneId === undefined || completed === undefined) {
      return NextResponse.json({ error: 'Milestone ID and completion status are required' }, { status: 400 });
    }

    // Verify milestone belongs to user's goal
    const milestone = await prisma.learningGoalMilestone.findFirst({
      where: {
        id: parseInt(milestoneId),
        learningGoal: {
          userId: user.id
        }
      },
      include: {
        learningGoal: true
      }
    });

    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    // Update milestone
    const updatedMilestone = await prisma.learningGoalMilestone.update({
      where: { id: parseInt(milestoneId) },
      data: {
        completed,
        completedAt: completed ? new Date() : null
      }
    });

    // Recalculate goal progress based on completed milestones
    const allMilestones = await prisma.learningGoalMilestone.findMany({
      where: { goalId: milestone.learningGoal.id },
      orderBy: { order: 'asc' }
    });

    const completedMilestones = allMilestones.filter((m: any) => m.completed).length;
    const totalMilestones = allMilestones.length;
    const newProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    // Update goal progress
    const updatedGoal = await prisma.learningGoal.update({
      where: { id: milestone.learningGoal.id },
      data: {
        progress: newProgress,
        status: newProgress === 100 ? 'COMPLETED' : 
                milestone.learningGoal.deadline && new Date() > milestone.learningGoal.deadline ? 'OVERDUE' : 
                'ACTIVE'
      }
    });

    return NextResponse.json({ 
      milestone: updatedMilestone, 
      goal: updatedGoal,
      progress: newProgress 
    });

  } catch (error) {
    console.error('Error updating milestone:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 