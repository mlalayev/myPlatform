import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid exercise ID" },
        { status: 400 }
      );
    }

    const exercise = await prisma.exercise.findUnique({
      where: {
        id,
        published: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        category: true,
        content: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(exercise);
    
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
} 