import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

console.log('API /api/quiz/submit called');

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log('API /api/quiz/submit POST called');
  // Get user session
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { quizId, score, answers, code } = body;
  if (!quizId || typeof score !== "number" || !answers || typeof code !== "string") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  // Find user
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Debug log before creating submission
  console.log('Submitting quiz:', { userId: user.id, quizId, score, answers, code });

  // Store quiz submission
  const submission = await prisma.quizSubmission.create({
    data: {
      userId: user.id,
      quizId,
      score,
      answers: { ...answers, code },
      timestamp: new Date(),
    },
  });

  // Debug log after creating submission
  console.log('Created submission:', submission);

  return NextResponse.json({ success: true, submission });
} 