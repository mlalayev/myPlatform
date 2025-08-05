import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(req, context) {
  const params = await context.params;
  const { framework } = params;
  const filePath = path.join(
    process.cwd(),
    "public",
    "tutorials",
    framework,
    "topics.json"
  );
  try {
    await fs.access(filePath);
  } catch (err) {
    return NextResponse.json({}, { status: 404 });
  }
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return NextResponse.json(JSON.parse(fileContent));
} 