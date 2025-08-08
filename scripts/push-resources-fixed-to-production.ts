#!/usr/bin/env tsx
import 'dotenv/config'
import { PrismaClient, ResourceCategory, ResourceStatus, ResourceType } from '@prisma/client'

const prod = new PrismaClient({
  datasources: { db: { url: process.env.PROD_DATABASE_URL } },
})

const RESOURCES = [
  {
    title: 'Base de Prompts para Publicidad con IA',
    slug: 'base-prompts-publicidad-ia',
    description:
      'Plantillas de prompts para anuncios con IA: premium, comida apetecible, retro+moderno, minimalista, storytelling y surrealista.',
    shortDescription: 'Base de prompts para anuncios con IA, lista para usar.',
    imageUrl: '/images/repro.png',
    category: ResourceCategory.MANUAL,
    type: ResourceType.LINK,
    author: 'Equipo Egrow',
    fileUrl:
      'https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3Wf19gNCEQM9nSueGgY57l4tshCfzyKDB3XWdkj',
    requiresAuth: true,
    isFree: true,
    rating: 4.8,
    status: ResourceStatus.PUBLISHED as const,
  },
  {
    title: 'Base de Prompts para Videos en Sora',
    slug: 'base-prompts-videos-sora',
    description:
      'Prompts optimizados para generar videos con Sora: encuadre, estilo visual, ritmo, transiciones e iluminación.',
    shortDescription: 'Base de prompts para crear videos con Sora de forma consistente.',
    imageUrl: '/images/repro.png',
    category: ResourceCategory.MANUAL,
    type: ResourceType.LINK,
    author: 'Equipo Egrow',
    fileUrl:
      'https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3WfdLgTeToy4Supo1nji5c23mtlJAQCh9PNELZV',
    requiresAuth: true,
    isFree: true,
    rating: 4.8,
    status: ResourceStatus.PUBLISHED as const,
  },
  {
    title: 'Promp mágico VEO 3',
    slug: 'promp-magico-veo-3',
    description:
      'Prompt cinematográfico fotorrealista: habitación que se transforma con objetos temáticos, ángulo amplio fijo, acentos de luz, montaje rápido y sin texto.',
    shortDescription: 'Prompt cinematográfico fotorrealista para VEO 3.',
    imageUrl: '/images/repro.png',
    category: ResourceCategory.MANUAL,
    type: ResourceType.LINK,
    author: 'Equipo Egrow',
    fileUrl:
      'https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3WfCnehABUdaWlSVx5UpNGs8y7ucRKXzLg4rF9A',
    requiresAuth: true,
    isFree: true,
    rating: 4.8,
    status: ResourceStatus.PUBLISHED as const,
  },
]

async function main() {
  if (!process.env.PROD_DATABASE_URL) {
    console.error('❌ PROD_DATABASE_URL no configurada')
    process.exit(1)
  }

  console.log('🔄 Upsert de 3 recursos en producción...')
  await prod.$connect()
  try {
    let created = 0
    let updated = 0
    for (const r of RESOURCES) {
      const existing = await prod.resource.findUnique({ where: { slug: r.slug } })
      if (existing) {
        await prod.resource.update({ where: { slug: r.slug }, data: r })
        updated++
        console.log(`♻️ Actualizado: ${r.title}`)
      } else {
        await prod.resource.create({ data: r })
        created++
        console.log(`✅ Creado: ${r.title}`)
      }
    }
    console.log(`📊 Resultado → Creados: ${created}, Actualizados: ${updated}`)
  } finally {
    await prod.$disconnect()
  }
}

main().catch((err) => {
  console.error('❌ Error en push de recursos:', err)
  process.exit(1)
})


