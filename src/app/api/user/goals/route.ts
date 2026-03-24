import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/authOptions';
import { prisma } from '@/lib/prisma';

// GET - Fetch user's learning goals
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        learningGoals: {
          include: {
            milestones: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate goal statistics
    const totalGoals = user.learningGoals.length;
    const activeGoals = user.learningGoals.filter((goal: any) => goal.status === 'ACTIVE').length;
    const completedGoals = user.learningGoals.filter((goal: any) => goal.status === 'COMPLETED').length;
    const overdueGoals = user.learningGoals.filter((goal: any) => goal.status === 'OVERDUE').length;
    const totalProgress = totalGoals > 0 
      ? Math.round(user.learningGoals.reduce((acc: number, goal: any) => acc + goal.progress, 0) / totalGoals)
      : 0;

    // Calculate category statistics
    const categoryStats = {
      programming: { completed: 0, total: 0, progress: 0 },
      language: { completed: 0, total: 0, progress: 0 },
      framework: { completed: 0, total: 0, progress: 0 },
      project: { completed: 0, total: 0, progress: 0 },
      certification: { completed: 0, total: 0, progress: 0 }
    };

    user.learningGoals.forEach((goal: any) => {
      const category = goal.category.toLowerCase();
      if (categoryStats[category as keyof typeof categoryStats]) {
        categoryStats[category as keyof typeof categoryStats].total++;
        if (goal.status === 'COMPLETED') {
          categoryStats[category as keyof typeof categoryStats].completed++;
        }
      }
    });

    // Calculate progress for each category
    Object.keys(categoryStats).forEach(category => {
      const stats = categoryStats[category as keyof typeof categoryStats];
      stats.progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    });

    return NextResponse.json({
      goals: user.learningGoals,
      statistics: {
        total: totalGoals,
        active: activeGoals,
        completed: completedGoals,
        overdue: overdueGoals,
        progress: totalProgress
      },
      categoryStats
    });

  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new learning goal
export async function POST(request: NextRequest) {
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
    const { 
      title, 
      description, 
      category, 
      deadline, 
      priority, 
      difficulty, 
      estimatedTime,
      milestones 
    } = body;

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create goal with milestones
    const goal = await prisma.learningGoal.create({
      data: {
        userId: user.id,
        title,
        description,
        category,
        deadline: deadline ? new Date(deadline) : null,
        priority: priority || 'MEDIUM',
        difficulty: difficulty || 'MEDIUM',
        estimatedTime: estimatedTime || 0,
        milestones: {
          create: milestones?.map((milestone: any, index: number) => ({
            text: milestone.text,
            order: index + 1
          })) || []
        }
      },
      include: {
        milestones: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json({ goal }, { status: 201 });

  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update learning goal
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
    const { 
      id, 
      title, 
      description, 
      category, 
      status, 
      progress, 
      deadline, 
      priority, 
      difficulty, 
      timeSpent, 
      estimatedTime,
      milestones 
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    // Verify goal belongs to user
    const existingGoal = await prisma.learningGoal.findFirst({
      where: { id: parseInt(id), userId: user.id }
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Update goal
    const updatedGoal = await prisma.learningGoal.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        category,
        status,
        progress,
        deadline: deadline ? new Date(deadline) : null,
        priority,
        difficulty,
        timeSpent,
        estimatedTime
      },
      include: {
        milestones: {
          orderBy: { order: 'asc' }
        }
      }
    });

    // Update milestones if provided
    if (milestones) {
      // Delete existing milestones
      await prisma.learningGoalMilestone.deleteMany({
        where: { goalId: parseInt(id) }
      });

      // Create new milestones
      await prisma.learningGoalMilestone.createMany({
        data: milestones.map((milestone: any, index: number) => ({
          goalId: parseInt(id),
          text: milestone.text,
          completed: milestone.completed || false,
          order: index + 1,
          completedAt: milestone.completed ? new Date() : null
        }))
      });

      // Fetch updated goal with milestones
      const goalWithMilestones = await prisma.learningGoal.findUnique({
        where: { id: parseInt(id) },
        include: {
          milestones: {
            orderBy: { order: 'asc' }
          }
        }
      });

      return NextResponse.json({ goal: goalWithMilestones });
    }

    return NextResponse.json({ goal: updatedGoal });

  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete learning goal
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    // Verify goal belongs to user
    const existingGoal = await prisma.learningGoal.findFirst({
      where: { id: parseInt(id), userId: user.id }
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Delete goal (milestones will be deleted automatically due to cascade)
    await prisma.learningGoal.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Goal deleted successfully' });

  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 