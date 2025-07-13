import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  const { id } = await params;

  // Handle Google user IDs (which are strings) vs regular user IDs (numbers)
  let userId;
  if (isNaN(Number(id))) {
    // This is a Google user ID (string), find by email instead
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: Number(id) },
          { email: id }, // Try to find by email if ID is not a number
        ],
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    userId = user.id;
  } else {
    userId = Number(id);
  }

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ success: true });
}

export async function GET(req, { params }) {
  const { id } = await params;

  // Handle Google user IDs (which are strings) vs regular user IDs (numbers)
  let user;
  if (isNaN(Number(id))) {
    // This is a Google user ID (string), find by email instead
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: Number(id) },
          { email: id }, // Try to find by email if ID is not a number
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        dailyLoginPoints: true,
        lastLoginDate: true,
      },
    });
  } else {
    user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        dailyLoginPoints: true,
        lastLoginDate: true,
      },
    });
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;

    // Handle Google user IDs (which are strings) vs regular user IDs (numbers)
    let userId;
    if (isNaN(Number(id))) {
      // This is a Google user ID (string), find by email instead
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: Number(id) },
            { email: id }, // Try to find by email if ID is not a number
          ],
        },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      userId = user.id;
    } else {
      userId = Number(id);
    }

    const data = await req.json();
    // Only allow updating name, email, role
    const allowedFields = ["name", "email", "role"];
    const updateData = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        updateData[key] = data[key];
      }
    }
    console.log("PATCH updateData:", updateData);
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
