import { NextResponse } from "next/server";
import { auth } from "../../../auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, context: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await context.params;
  const url = new URL(req.url);
  const maxTestCases = Number(url.searchParams.get('maxTestCases'));
  if (!maxTestCases) {
    return NextResponse.json({ error: "Missing maxTestCases" }, { status: 400 });
  }

  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quizIdNum = parseInt(quizId, 10);
  if (isNaN(quizIdNum)) {
    return NextResponse.json({ error: "Invalid quizId" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const latest = await prisma.quizSubmission.findFirst({
    where: { userId: user.id, quizId: quizIdNum },
    orderBy: { timestamp: "desc" },
  });

  // Check if user has ever passed this quiz (score === maxTestCases)
  const hasEverPassed = await prisma.quizSubmission.findFirst({
    where: {
      userId: user.id,
      quizId: quizIdNum,
      score: maxTestCases,
    },
  }) != null;

  // If user has ever passed, always show as passed
  const hasPassed = hasEverPassed;

  // Check if the latest submission had wrong answers (score < maxTestCases)
  // But only if user has never passed
  const hasWrong = !hasEverPassed && latest && latest.score < maxTestCases;

  return NextResponse.json({ latest, hasPassed, hasWrong });
} 