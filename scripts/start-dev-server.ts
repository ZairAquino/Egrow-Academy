import { spawn } from 'child_process'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Cargar variables de entorno
dotenv.config()

async function startDevServer() {
  console.log('🚀 [DEV] Iniciando servidor de desarrollo...')
  
  // Verificar variables críticas
  console.log('🔍 [DEV] Verificando configuración...')
  console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅' : '❌')
  console.log('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅' : '❌')
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅' : '❌')
  
  if (!process.env.DATABASE_URL || !process.env.RESEND_API_KEY) {
    console.error('❌ [DEV] Variables críticas faltantes')
    return
  }
  
  console.log('✅ [DEV] Configuración verificada')
  
  // Iniciar servidor de desarrollo
  console.log('🌐 [DEV] Iniciando Next.js...')
  
  const devProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development'
    },
    cwd: process.cwd()
  })
  
  devProcess.on('error', (error) => {
    console.error('❌ [DEV] Error iniciando servidor:', error)
  })
  
  devProcess.on('close', (code) => {
    console.log(`🏁 [DEV] Servidor terminado con código: ${code}`)
  })
  
  // Manejar señales de terminación
  process.on('SIGINT', () => {
    console.log('\n🛑 [DEV] Deteniendo servidor...')
    devProcess.kill('SIGINT')
  })
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 [DEV] Deteniendo servidor...')
    devProcess.kill('SIGTERM')
  })
}

startDevServer() 