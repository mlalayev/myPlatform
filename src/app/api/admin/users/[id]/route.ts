import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  const id = Number(params.id);
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req, { params }) {
  try {
    const id = Number(params.id);
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
      where: { id },
      data: updateData,
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
} 