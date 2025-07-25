import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test simple sin Prisma
    return NextResponse.json({ 
      message: 'Test endpoint funcionando',
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        HAS_DATABASE_URL: !!process.env.DATABASE_URL
      }
    })
  } catch (error) {
    console.error('Error en test endpoint:', error)
    return NextResponse.json(
      { error: 'Error en test' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({
      message: 'Test POST funcionando',
      received: body
    })
  } catch (error) {
    console.error('Error en test POST:', error)
    return NextResponse.json(
      { error: 'Error en test POST' },
      { status: 500 }
    )
  }
}