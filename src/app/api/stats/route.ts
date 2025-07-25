import { NextResponse } from 'next/server';
import { getStats } from '@/lib/stats';

export async function GET() {
  try {
    const stats = await getStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in stats API:', error);
    
    // Return fallback data
    return NextResponse.json({
      totalCourses: 15,
      freeCourses: 8,
      totalUsers: 2500,
      totalEnrollments: 1200
    });
  }
}