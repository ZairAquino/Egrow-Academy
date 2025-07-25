import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    
    return new NextResponse(robotsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error reading robots.txt:', error);
    return new NextResponse('Robots.txt not found', { status: 404 });
  }
} 