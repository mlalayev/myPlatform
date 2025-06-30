import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(
  req: Request,
  { params }: { params: { language: string } }
) {
  const { language } = params;
  const filePath = path.join(process.cwd(), 'public', 'tutorials', language, 'topics.json');
  try {
    const file = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(file));
  } catch (e) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  let topics = [];
  
  try {
    // Check if language has a folder structure
    const folderPath = path.join(process.cwd(), 'src', 'app', 'api', 'tutorials', '[language]', 'topics', language);
    const indexPath = path.join(folderPath, 'index.json');
    
    // Try to read from folder structure first
    try {
      const indexContents = await fs.readFile(indexPath, 'utf-8');
      const topicList = JSON.parse(indexContents);
      
      // Load each topic from its individual file
      for (const topicInfo of topicList) {
        try {
          const topicPath = path.join(folderPath, topicInfo.file);
          const topicContents = await fs.readFile(topicPath, 'utf-8');
          const topic = JSON.parse(topicContents);
          topics.push(topic);
        } catch (topicError) {
          console.error(`Error loading topic ${topicInfo.file}:`, topicError);
          // Add topic info without content if file is missing
          topics.push({
            id: topicInfo.id,
            title: topicInfo.title,
            icon: topicInfo.icon,
            description: topicInfo.description,
            content: []
          });
        }
      }
    } catch (folderError) {
      // Fallback to old single file structure
      const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'tutorials', '[language]', 'topics', `${language}.json`);
      const fileContents = await fs.readFile(filePath, 'utf-8');
      topics = JSON.parse(fileContents);
    }
  } catch (e) {
    console.error('Error loading topics:', e);
    topics = [];
  }
  
  return NextResponse.json(topics);
} 