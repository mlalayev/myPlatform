import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'editor'; initialCode: string };

type Topic = {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: ContentBlock[];
};

export async function GET(req: NextRequest, { params }: { params: { language: string } }) {
  const { language } = params;
  let topics = [];
  try {
    const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'tutorials', '[language]', 'topics', `${language}.json`);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    topics = JSON.parse(fileContents);
  } catch (e) {
    topics = [];
  }
  return NextResponse.json(topics);
} 