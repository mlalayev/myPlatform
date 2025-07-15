import { NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(req, context) {
  const { language } = context.params;
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
  } catch {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }
}
