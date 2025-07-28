import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Build where clause
    const where: any = {
      published: true
    };

    if (difficulty && difficulty !== 'ALL') {
      where.difficulty = difficulty;
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count for pagination
    const total = await prisma.exercise.count({ where });

    // Get exercises with pagination
    const exercises = await prisma.exercise.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        category: true,
        content: true,
        published: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { id: 'asc' },
      skip: (page - 1) * limit,
      take: limit
    });

    // Get difficulty and category counts for filters
    const difficultyCounts = await prisma.exercise.groupBy({
      by: ['difficulty'],
      where: { published: true },
      _count: { difficulty: true }
    });

    const categoryCounts = await prisma.exercise.groupBy({
      by: ['category'],
      where: { published: true },
      _count: { category: true }
    });

    const response = {
      exercises,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        difficulties: difficultyCounts.map(d => ({
          difficulty: d.difficulty,
          count: d._count.difficulty
        })),
        categories: categoryCounts.map(c => ({
          category: c.category,
          count: c._count.category
        }))
      }
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
} 