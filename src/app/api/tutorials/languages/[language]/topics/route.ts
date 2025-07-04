import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(
  req: Request,
  { params }: { params: { language: string } }
) {
  const { language } = params;
  const filePath = path.join(
    process.cwd(),
    "public",
    "tutorials",
    language,
    "topics.json"
  );
  try {
    const file = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(file));
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
} 