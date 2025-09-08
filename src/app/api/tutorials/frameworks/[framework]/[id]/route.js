import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(req, context) {
  // In newer Next.js versions, params can be a Promise
  const { framework, id } = await context.params;

  try {
    // Resolve paths under public/tutorials/<framework>
    const baseDir = path.join(process.cwd(), "public", "tutorials", framework);
    const topicsPath = path.join(baseDir, "topics.json");

    // Read topics.json and ensure the requested topic exists
    const topicsContents = await fs.readFile(topicsPath, "utf-8");
    const topics = JSON.parse(topicsContents);
    const topicExists = Array.isArray(topics.az)
      ? topics.az.some((t) => t.id === id)
      : Array.isArray(topics)
      ? topics.some((t) => t.id === id)
      : false;

    if (!topicExists) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Load the specific lesson file: public/tutorials/<framework>/<id>.json
    const lessonPath = path.join(baseDir, `${id}.json`);
    const lessonContents = await fs.readFile(lessonPath, "utf-8");
    const lesson = JSON.parse(lessonContents);

    return NextResponse.json(lesson);
  } catch (e) {
    if (e && e.code === "ENOENT") {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }
    console.error("Error loading topic:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 