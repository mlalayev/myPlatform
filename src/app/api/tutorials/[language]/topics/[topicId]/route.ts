import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "editor"; initialCode: string };

type Topic = {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: ContentBlock[];
};

export async function GET(
  req: NextRequest,
  { params }: { params: { language: string; topicId: string } }
) {
  const { language, topicId } = params;

  try {
    // Check if language has a folder structure
    const folderPath = path.join(
      process.cwd(),
      "src",
      "app",
      "api",
      "tutorials",
      "[language]",
      "topics",
      language
    );
    const indexPath = path.join(folderPath, "index.json");

    // Try to read from folder structure first
    try {
      const indexContents = await fs.readFile(indexPath, "utf-8");
      const topicList = JSON.parse(indexContents);

      // Find the specific topic
      const topicInfo = topicList.find((topic: any) => topic.id === topicId);

      if (!topicInfo) {
        return NextResponse.json({ error: "Topic not found" }, { status: 404 });
      }

      // Load the specific topic from its file
      const topicPath = path.join(folderPath, topicInfo.file);
      const topicContents = await fs.readFile(topicPath, "utf-8");
      const topic = JSON.parse(topicContents);

      return NextResponse.json(topic);
    } catch (folderError) {
      // Fallback to old single file structure
      const filePath = path.join(
        process.cwd(),
        "src",
        "app",
        "api",
        "tutorials",
        "[language]",
        "topics",
        `${language}.json`
      );
      const fileContents = await fs.readFile(filePath, "utf-8");
      const topics = JSON.parse(fileContents);

      const topic = topics.find((t: Topic) => t.id === topicId);

      if (!topic) {
        return NextResponse.json({ error: "Topic not found" }, { status: 404 });
      }

      return NextResponse.json(topic);
    }
  } catch (e) {
    console.error("Error loading topic:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
