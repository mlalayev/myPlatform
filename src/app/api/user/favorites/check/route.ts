import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
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

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_type_itemId: {
          userId: parseInt(session.user.id),
          type: type as any,
          itemId: itemId
        }
      }
    });

    return NextResponse.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error('Error checking favorite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 