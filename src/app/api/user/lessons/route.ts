import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log('[API] session:', session);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    select: { visitedLessons: true }
  });
  return NextResponse.json(user?.visitedLessons || []);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log('[API] session:', session);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { lessonId } = await req.json();
  if (!lessonId) return NextResponse.json({ error: 'No lessonId' }, { status: 400 });

  // Add lessonId to visitedLessons array (if not already present)
  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    select: { visitedLessons: true }
  });
  const current = user?.visitedLessons || [];
  if (!current.includes(lessonId)) {
    await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: { visitedLessons: { set: [...current, lessonId] } }
    });
  }
  return NextResponse.json({ success: true });
} 