import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// GET /api/admin/users
// Supports optional query params: q, page, pageSize, sortBy, sortDir
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Math.min(Number(searchParams.get("pageSize") || 20), 100);
  const sortBy = searchParams.get("sortBy") || "createdAt"; // createdAt, name, email, role
  const sortDir = (searchParams.get("sortDir") || "desc").toLowerCase() === "asc" ? "asc" : "desc";

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { username: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const orderBy: any = {};
  orderBy[sortBy] = sortDir;

  // If no query params provided, keep backward compatibility: return full list (small select)
  const hasParams = searchParams.toString().length > 0;
  if (!hasParams) {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json(users);
  }

  const [total, data] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        lastLoginDate: true,
      },
    }),
  ]);

  return NextResponse.json({ data, total, page, pageSize });
}

// POST /api/admin/users - create a user (admin)
export async function POST(req: Request) {
  try {
    const { name, username, email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "email and password are required" }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) {
      return NextResponse.json({ error: "User with this email or username already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name || username || email.split("@")[0],
        username: username || undefined,
        email,
        passwordHash,
        role: role || "USER",
      },
      select: { id: true, name: true, username: true, email: true, role: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    console.error("Admin create user error:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}