#!/usr/bin/env tsx
import 'dotenv/config'
import { PrismaClient, ResourceCategory, ResourceStatus, ResourceType } from '@prisma/client'

async function main() {
  const prodUrl = process.env.PROD_DATABASE_URL
  if (!prodUrl) {
    console.error('❌ PROD_DATABASE_URL no configurada')
    process.exit(1)
  }

  const prisma = new PrismaClient({ datasources: { db: { url: prodUrl } } })

  const data = {
    title: 'Ebook_ Crea videos profesionales con IA',
    slug: 'ebook-crea-videos-profesionales-ia',
    description:
      'Ebook práctico para crear videos profesionales con IA: flujo de trabajo, estilo visual, prompts efectivos y consejos de producción.',
    shortDescription: 'Ebook para producir videos profesionales con IA.',
    imageUrl:
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&q=80&auto=format&fit=crop',
    category: ResourceCategory.EBOOK,
    type: ResourceType.PDF,
    author: 'Equipo Egrow',
    fileUrl:
      'https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3Wf009oYi3zH8OinDQ0vfu7r9b4CGqgU2Kl1WpF',
    requiresAuth: true,
    isFree: true,
    rating: 4.8,
    status: ResourceStatus.PUBLISHED as const,
  }

  try {
    await prisma.$connect()
    const existing = await prisma.resource.findUnique({ where: { slug: data.slug } })
    if (existing) {
      await prisma.resource.update({ where: { slug: data.slug }, data })
      console.log('♻️ Actualizado en producción:', data.title)
    } else {
      await prisma.resource.create({ data })
      console.log('✅ Creado en producción:', data.title)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((err) => {
  console.error('❌ Error sincronizando recurso a producción:', err)
  process.exit(1)
})


