import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest, context: { params: { language: string } }) {
  const { language } = await context.params;
  const filePath = path.join(
    process.cwd(),
    "public",
    "tutorials",
    language,
    "topics.json"
  );
  try {
    const file = await fs.promises.readFile(filePath, "utf-8");
    return new Response(file, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }
}
