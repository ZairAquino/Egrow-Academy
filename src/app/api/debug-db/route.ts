import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mostrar información de debug sin conectar a la BD
    const dbUrl = process.env.DATABASE_URL
    
    if (!dbUrl) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL no está configurada',
        envVariables: {
          NODE_ENV: process.env.NODE_ENV,
          DATABASE_URL: 'No configurada'
        }
      })
    }
    
    // Analizar la URL de conexión sin mostrar la contraseña completa
    const urlPattern = /postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/
    const match = dbUrl.match(urlPattern)
    
    if (!match) {
      return NextResponse.json({
        success: false,
        error: 'Formato de DATABASE_URL inválido',
        providedUrl: dbUrl.replace(/:([^@]+)@/, ':***@'), // ocultar contraseña
        expectedFormat: 'postgresql://username:password@host/database?params'
      })
    }
    
    const [, username, password, hostAndPort, dbAndParams] = match
    
    return NextResponse.json({
      success: true,
      message: 'URL parseada correctamente',
      parsedUrl: {
        username,
        passwordLength: password.length,
        hostAndPort,
        databaseAndParams: dbAndParams,
        fullUrl: dbUrl.replace(`:${password}@`, ':***@')
      },
      recommendation: 'URL parece válida, el problema puede estar en la conexión de red o credenciales'
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error analizando configuración de BD',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}