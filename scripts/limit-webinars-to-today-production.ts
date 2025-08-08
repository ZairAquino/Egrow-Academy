#!/usr/bin/env tsx
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

function getTodayRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  return { start, end }
}

async function main() {
  console.log('🎯 Mantener solo webinars de hoy en producción (sin borrar, desactivar el resto)')

  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.PROD_DATABASE_URL } },
  })

  try {
    await prisma.$connect()
    const { start, end } = getTodayRange()

    const all = await prisma.webinar.findMany()
    console.log(`📋 Webinars en producción: ${all.length}`)

    // Activar SOLO los de hoy, desactivar resto
    const activate = await prisma.webinar.updateMany({
      where: { dateTime: { gte: start, lte: end } },
      data: { isActive: true },
    })
    const deactivate = await prisma.webinar.updateMany({
      where: { OR: [{ dateTime: { lt: start } }, { dateTime: { gt: end } }] },
      data: { isActive: false },
    })

    console.log(`✅ Activados (hoy): ${activate.count}`)
    console.log(`✅ Desactivados (no hoy): ${deactivate.count}`)

    const remainingActive = await prisma.webinar.findMany({ where: { isActive: true } })
    console.log(`📦 Webinars activos ahora: ${remainingActive.length}`)
    remainingActive.forEach((w) => console.log(` - ${w.title} @ ${w.dateTime.toISOString()}`))
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((err) => {
  console.error('❌ Error limitando webinars:', err)
  process.exit(1)
})


