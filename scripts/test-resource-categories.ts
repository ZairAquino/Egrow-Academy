#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { PrismaClient, ResourceCategory } from '@prisma/client'

dotenv.config()

const prisma = new PrismaClient()

async function testResourceCategories() {
  try {
    console.log('🔍 Verificando categorías de recursos disponibles...')
    
    // Obtener todas las categorías del enum
    const categories = Object.values(ResourceCategory)
    
    console.log('📋 Categorías disponibles:')
    categories.forEach((category, index) => {
      const isNew = category === 'ULTIMO_WEBINAR' || category === 'EN_VIVO'
      const status = isNew ? '🆕' : '✅'
      console.log(`${index + 1}. ${status} ${category}`)
    })
    
    // Verificar que las nuevas categorías están presentes
    const hasUltimoWebinar = categories.includes(ResourceCategory.ULTIMO_WEBINAR)
    const hasEnVivo = categories.includes(ResourceCategory.EN_VIVO)
    
    console.log('\n🎯 Verificación de nuevas categorías:')
    console.log(`   ULTIMO_WEBINAR: ${hasUltimoWebinar ? '✅ Disponible' : '❌ No encontrada'}`)
    console.log(`   EN_VIVO: ${hasEnVivo ? '✅ Disponible' : '❌ No encontrada'}`)
    
    // Contar recursos por categoría
    console.log('\n📊 Recursos existentes por categoría:')
    for (const category of categories) {
      try {
        const count = await prisma.resource.count({
          where: {
            category: category
          }
        })
        console.log(`   ${category}: ${count} recurso${count !== 1 ? 's' : ''}`)
      } catch (error) {
        console.log(`   ${category}: Error consultando - ${error}`)
      }
    }
    
    console.log('\n✅ Verificación completada exitosamente!')
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testResourceCategories()