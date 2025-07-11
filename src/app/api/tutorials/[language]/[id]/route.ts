import path from "path";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

export async function GET(req, context) {
  const { language, id } = context.params;
  const filePath = path.join(
    process.cwd(),
    "public",
    "tutorials",
    language,
    `${id}.json`
  );
  try {
    const file = await fs.readFile(filePath, "utf-8");
    return new Response(file, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }
}
