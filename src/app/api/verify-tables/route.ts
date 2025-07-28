import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  let prisma: PrismaClient | null = null
  
  try {
    console.log('🔍 [VERIFY-TABLES] Verificando tablas en Neon...')
    
    const directUrl = "postgresql://neondb_owner:npg_AZ3bcE1lmxuo@ep-billowing-glitter-aekqfnw5-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
    
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: directUrl
        }
      },
      log: ['query', 'error', 'info', 'warn']
    })
    
    await prisma.$connect()
    console.log('✅ [VERIFY-TABLES] Conectado a Neon')
    
    // Consultar todas las tablas existentes
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `
    
    console.log('📋 [VERIFY-TABLES] Tablas encontradas:', tables)
    
    // Intentar consultar algunas tablas específicas
    const testQueries = []
    
    try {
      const userCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM users;`
      testQueries.push({ table: 'users', result: userCount, success: true })
    } catch (error) {
      testQueries.push({ table: 'users', error: error instanceof Error ? error.message : 'Error', success: false })
    }
    
    try {
      const courseCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM courses;`
      testQueries.push({ table: 'courses', result: courseCount, success: true })
    } catch (error) {
      testQueries.push({ table: 'courses', error: error instanceof Error ? error.message : 'Error', success: false })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Verificación de tablas completada',
      data: {
        connection: 'exitosa',
        tables: tables,
        testQueries: testQueries,
        url: directUrl.replace(/:npg_AZ3bcE1lmxuo@/, ':***@')
      }
    })
    
  } catch (error) {
    console.error('❌ [VERIFY-TABLES] Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Error verificando tablas',
      details: {
        message: error instanceof Error ? error.message : 'Error desconocido',
        name: error instanceof Error ? error.name : 'Unknown'
      }
    }, { status: 500 })
    
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}