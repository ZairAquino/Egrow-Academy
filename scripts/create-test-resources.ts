#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { PrismaClient, ResourceCategory, ResourceType } from '@prisma/client'

dotenv.config()

const prisma = new PrismaClient()

async function createTestResources() {
  try {
    console.log('🎨 Creando recursos de prueba para visualizar badges...')
    
    // Recurso con categoría ULTIMO_WEBINAR (azul)
    const ultimoWebinar = await prisma.resource.create({
      data: {
        title: 'Webinar: El Futuro de la IA en 2025',
        slug: 'webinar-futuro-ia-2025',
        description: 'Descubre las tendencias más importantes de inteligencia artificial para el próximo año',
        shortDescription: 'Las tendencias de IA más importantes para 2025',
        category: ResourceCategory.ULTIMO_WEBINAR,
        type: ResourceType.VIDEO,
        fileUrl: 'https://example.com/webinar-ia-2025',
        requiresAuth: false,
        isFree: true,
        author: 'Dr. AI Expert',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop',
        status: 'PUBLISHED'
      }
    })

    // Recurso con categoría EN_VIVO (rojo con animación)
    const enVivo = await prisma.resource.create({
      data: {
        title: 'EN VIVO: Masterclass de Marketing Digital',
        slug: 'live-masterclass-marketing-digital',
        description: 'Únete a nuestra masterclass en vivo sobre las estrategias de marketing digital más efectivas',
        shortDescription: 'Masterclass en vivo de marketing digital',
        category: ResourceCategory.EN_VIVO,
        type: ResourceType.LINK,
        fileUrl: 'https://example.com/live-marketing',
        requiresAuth: true,
        isFree: false,
        author: 'Marketing Expert',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
        status: 'PUBLISHED'
      }
    })

    console.log('✅ Recursos de prueba creados exitosamente:')
    console.log(`   🔵 ULTIMO_WEBINAR: ${ultimoWebinar.title}`)
    console.log(`   🔴 EN_VIVO: ${enVivo.title}`)
    
    console.log('\n🎯 Para ver los cambios:')
    console.log('   1. Ejecuta: npm run dev')
    console.log('   2. Ve a: http://localhost:3000/resources')
    console.log('   3. Observa las badges con los nuevos colores')
    
    console.log('\n🎨 Colores aplicados:')
    console.log('   🔵 ULTIMO_WEBINAR: Badge azul sólido (bg-blue-500)')
    console.log('   🔴 EN_VIVO: Badge rojo con animación pulse (bg-red-500 + animate-pulse)')
    
  } catch (error) {
    console.error('❌ Error creando recursos de prueba:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestResources()