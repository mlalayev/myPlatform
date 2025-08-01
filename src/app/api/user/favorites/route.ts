import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/authOptions';
import { prisma } from '@/lib/prisma';

// GET - Get user favorites
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: parseInt(session.user.id)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add a favorite
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, itemId, title, description, language, category } = await request.json();

    if (!type || !itemId || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_type_itemId: {
          userId: parseInt(session.user.id),
          type: type,
          itemId: itemId.toString()
        }
      }
    });

    if (existingFavorite) {
      return NextResponse.json({ error: 'Already favorited' }, { status: 400 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: parseInt(session.user.id),
        type: type,
        itemId: itemId.toString(),
        title: title,
        description: description,
        language: language,
        category: category
      }
    });

    return NextResponse.json({ favorite });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove a favorite
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const itemId = searchParams.get('itemId');

    if (!type || !itemId) {
      return NextResponse.json({ error: 'Missing type or itemId' }, { status: 400 });
    }

    const favorite = await prisma.favorite.deleteMany({
      where: {
        userId: parseInt(session.user.id),
        type: type as any,
        itemId: itemId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 