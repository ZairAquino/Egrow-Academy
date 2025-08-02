#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const prisma = new PrismaClient()

async function debugResourcesAPI() {
  try {
    console.log('🔍 [DEBUG] Simulando exactamente lo que hace el API /resources...')
    
    // 1. Verificar conexión
    await prisma.$connect()
    console.log('✅ [DEBUG] Conexión establecida')
    
    // 2. Simular los mismos parámetros
    const whereClause: any = {
      status: 'PUBLISHED'
    }
    
    console.log('🔍 [DEBUG] WHERE clause:', JSON.stringify(whereClause, null, 2))
    
    // 3. Ejecutar la misma query que el API
    console.log('🔍 [DEBUG] Ejecutando findMany...')
    
    const resources = await prisma.resource.findMany({
      where: whereClause,
      include: {
        topics: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50,
      skip: 0
    })
    
    console.log(`✅ [DEBUG] Query exitosa: ${resources.length} recursos encontrados`)
    
    // 4. Verificar cada recurso individualmente
    console.log('🔍 [DEBUG] Analizando cada recurso:')
    resources.forEach((resource, index) => {
      console.log(`   ${index + 1}. ${resource.title}`)
      console.log(`      - ID: ${resource.id}`)
      console.log(`      - Category: ${resource.category}`)
      console.log(`      - Status: ${resource.status}`)
      console.log(`      - Topics: ${resource.topics?.length || 0}`)
      console.log(`      - Rating: ${resource.rating}`)
      console.log(`      - Author: ${resource.author}`)
      console.log(`      - CreatedAt: ${resource.createdAt}`)
      console.log('      ---')
    })
    
    // 5. Probar el count
    console.log('🔍 [DEBUG] Ejecutando count...')
    const totalCount = await prisma.resource.count({
      where: whereClause
    })
    console.log(`✅ [DEBUG] Count exitoso: ${totalCount} total`)
    
    // 6. Simular el formateo
    console.log('🔍 [DEBUG] Simulando formateo...')
    const formattedResources = resources.map(r => ({
      ...r,
      topics: r.topics || [],
      rating: Number(r.rating),
      _count: {
        accessLogs: 0
      }
    }))
    
    console.log(`✅ [DEBUG] Formateo exitoso: ${formattedResources.length} recursos formateados`)
    
    // 7. Simular JSON response
    console.log('🔍 [DEBUG] Simulando JSON response...')
    const response = {
      success: true,
      data: formattedResources,
      pagination: {
        total: totalCount,
        limit: 50,
        offset: 0,
        hasMore: 0 + 50 < totalCount
      }
    }
    
    console.log('✅ [DEBUG] JSON response simulado exitosamente')
    console.log(`📊 [DEBUG] Response size: ${JSON.stringify(response).length} characters`)
    
    // 8. Verificar tipos específicos
    console.log('🔍 [DEBUG] Verificando tipos de datos...')
    resources.forEach((resource, index) => {
      if (resource.category === 'ULTIMO_WEBINAR' || resource.category === 'EN_VIVO') {
        console.log(`🆕 [DEBUG] Recurso con nueva categoría encontrado:`)
        console.log(`   - Título: ${resource.title}`)
        console.log(`   - Categoría: ${resource.category}`)
        console.log(`   - Tipo: ${typeof resource.category}`)
      }
    })
    
    console.log('✅ [DEBUG] ¡TODO FUNCIONA CORRECTAMENTE! El problema debe estar en otro lugar.')
    
  } catch (error) {
    console.error('💥 [DEBUG] ¡AQUÍ ESTÁ EL ERROR!')
    console.error('❌ [DEBUG] Error type:', error?.constructor?.name)
    console.error('❌ [DEBUG] Error message:', error?.message)
    console.error('❌ [DEBUG] Error stack:', error?.stack)
    
    // Análisis específico del error
    if (error?.message?.includes('Unknown argument')) {
      console.error('🎯 [DEBUG] PROBLEMA: Argumento desconocido en Prisma query')
    } else if (error?.message?.includes('Invalid enum value')) {
      console.error('🎯 [DEBUG] PROBLEMA: Valor de enum inválido')
    } else if (error?.message?.includes('Cannot read properties')) {
      console.error('🎯 [DEBUG] PROBLEMA: Propiedad undefined/null')
    } else if (error?.message?.includes('timeout')) {
      console.error('🎯 [DEBUG] PROBLEMA: Timeout de conexión a BD')
    } else {
      console.error('🎯 [DEBUG] PROBLEMA: Error desconocido')
    }
    
  } finally {
    await prisma.$disconnect()
    console.log('🔌 [DEBUG] Desconectado de BD')
  }
}

debugResourcesAPI()