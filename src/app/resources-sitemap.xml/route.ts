import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const sitemapPath = path.join(process.cwd(), 'public', 'resources-sitemap.xml');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    return new NextResponse(sitemapContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error reading resources sitemap:', error);
    return new NextResponse('Resources sitemap not found', { status: 404 });
  }
} 