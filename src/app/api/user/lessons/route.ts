import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/authOptions';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    select: { visitedLessons: true }
  });
  return NextResponse.json(user?.visitedLessons || {});
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { language, lessonId } = await req.json();
  if (!language || !lessonId) return NextResponse.json({ error: 'No language or lessonId' }, { status: 400 });

  // Get current visitedLessons object
  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    select: { visitedLessons: true }
  });
  let current = user?.visitedLessons || {};
  if (typeof current !== 'object' || Array.isArray(current)) current = {};
  const arr = Array.isArray(current[language]) ? current[language] : [];
  if (!arr.includes(lessonId)) {
    current[language] = [...arr, lessonId];
    await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: { visitedLessons: current }
    });
  }
  return NextResponse.json({ success: true });
} 