import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { exerciseId } = await request.json();
    
    if (!exerciseId) {
      return NextResponse.json({ error: "Exercise ID is required" }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, solvedExercises: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if exercise is already solved
    const currentSolvedExercises = user.solvedExercises || [];
    if (currentSolvedExercises.includes(exerciseId)) {
      return NextResponse.json({ 
        message: "Exercise already marked as solved",
        solvedExercises: currentSolvedExercises 
      });
    }

    // Add exercise to solved list
    const updatedSolvedExercises = [...currentSolvedExercises, exerciseId];
    
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        solvedExercises: updatedSolvedExercises,
        dailyLoginPoints: {
          increment: 10 // Give 10 points for solving an exercise
        }
      }
    });

    // Log activity
    try {
      await prisma.userActivity.create({
        data: {
          userId: user.id,
          type: "EXERCISE_SOLVE",
          description: `Solved exercise ${exerciseId}`,
          metadata: { exerciseId }
        }
      });
    } catch (activityError) {
      console.log("Activity logging failed:", activityError);
    }

    return NextResponse.json({ 
      message: "Exercise marked as solved",
      solvedExercises: updatedSolvedExercises,
      pointsEarned: 10
    });

  } catch (error) {
    console.error("Error marking exercise as solved:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's solved exercises
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { solvedExercises: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const solvedExerciseIds = user.solvedExercises || [];

    // Get exercise details for solved exercises
    let solvedExercisesData: any[] = [];
    if (solvedExerciseIds.length > 0) {
      solvedExercisesData = await prisma.exercise.findMany({
        where: { 
          id: { in: solvedExerciseIds },
          published: true
        },
        select: {
          id: true,
          title: true,
          difficulty: true,
          category: true,
          content: true,
        },
        orderBy: { id: 'desc' },
        take: 50 // Limit to recent 50 solved exercises
      });
    }

    return NextResponse.json({
      solvedExercises: solvedExercisesData,
      totalSolved: solvedExerciseIds.length
    });

  } catch (error) {
    console.error("Error fetching solved exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 