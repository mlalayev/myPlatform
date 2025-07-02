import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await context.params;
  const url = new URL(req.url);
  const maxTestCases = Number(url.searchParams.get('maxTestCases'));
  if (!maxTestCases) {
    return NextResponse.json({ error: "Missing maxTestCases" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
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

  // Calculate total test cases from latest submission if available
  let totalTestCases = 0;
  if (latest) {
    totalTestCases = latest.answers?.failedCases
      ? latest.score + latest.answers.failedCases.length
      : latest.score;
  }

  // Check if user has ever passed this quiz
  const hasPassed = await prisma.quizSubmission.findFirst({
    where: {
      userId: user.id,
      quizId: quizIdNum,
      score: maxTestCases,
    },
  }) != null;

  // Check if user has ever submitted a wrong answer (score < maxTestCases)
  const hasWrong = await prisma.quizSubmission.findFirst({
    where: {
      userId: user.id,
      quizId: quizIdNum,
      score: { lt: maxTestCases },
    },
  }) != null;

  return NextResponse.json({ latest, hasPassed, hasWrong });
} 