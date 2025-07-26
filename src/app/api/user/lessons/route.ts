import { auth } from '../../auth/authOptions';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({}, { status: 401 });
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { visitedLessons: true }
  });
  return NextResponse.json(user?.visitedLessons || {});
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { language, lessonId } = await req.json();
  if (!language || !lessonId) return NextResponse.json({ error: 'No language or lessonId' }, { status: 400 });

  // Get current visitedLessons object
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, visitedLessons: true }
  });
  
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  
  let current = user?.visitedLessons || {};
  if (typeof current !== 'object' || Array.isArray(current)) current = {};
  const arr = Array.isArray(current[language]) ? current[language] : [];
  if (!arr.includes(lessonId)) {
    current[language] = [...arr, lessonId];
    await prisma.user.update({
      where: { id: user.id },
      data: { visitedLessons: current }
    });
  }
  return NextResponse.json({ success: true });
} 