import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(req, context) {
  const { language, id } = context.params;
  const filePath = path.join(
    process.cwd(),
    "public",
    "tutorials",
    language,
    `${id}.json`
  );
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({}, { status: 404 });
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return NextResponse.json(JSON.parse(fileContent));
} 