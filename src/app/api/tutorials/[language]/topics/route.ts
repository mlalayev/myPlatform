import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest, context: { params: { language: string } }) {
  const { language } = context.params;
  const filePath = path.join(
    process.cwd(),
    "public",
    "tutorials",
    language,
    "topics.json"
  );
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({}, { status: 404 });
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return NextResponse.json(JSON.parse(fileContent));
}
