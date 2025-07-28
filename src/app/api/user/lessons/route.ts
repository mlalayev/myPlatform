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
  
  // Only add if not already exists (prevent duplicates)
  if (!arr.includes(lessonId)) {
    current[language] = [...arr, lessonId];
    
    // Update user's visitedLessons
    await prisma.user.update({
      where: { id: user.id },
      data: { visitedLessons: current }
    });
    
    // Note: We no longer update dailyActivity.lessonsViewed here
    // Weekly stats are now calculated from UserActivity table for accuracy
    // This prevents double counting and ensures accurate lesson view tracking
    
    return NextResponse.json({ success: true, added: true });
  } else {
    // Already exists, no change needed
    return NextResponse.json({ success: true, added: false, message: 'Lesson already visited' });
  }
} 