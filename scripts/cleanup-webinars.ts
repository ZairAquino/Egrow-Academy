#!/usr/bin/env tsx

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

type CleanupArgs = {
  keepSlug: string
  dryRun: boolean
  allowProd: boolean
}

function parseArgs(argv: string[]): CleanupArgs {
  const keepSlugArg = argv.find((a) => a.startsWith('--keep-slug='))
  const keepSlug = keepSlugArg ? keepSlugArg.split('=')[1] : 'videos-profesionales-ia'
  const dryRun = argv.includes('--dry-run')
  const allowProd = argv.includes('--allow-prod') || argv.includes('--production')
  return { keepSlug, dryRun, allowProd }
}

function ts(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
}

async function main() {
  const { keepSlug, dryRun, allowProd } = parseArgs(process.argv.slice(2))

  const env = process.env.NODE_ENV || 'development'
  const databaseUrl = process.env.DATABASE_URL || ''

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL no configurada. Aborto.')
    process.exit(1)
  }

  if (env === 'production' && !allowProd) {
    console.error('🛑 Entorno de producción detectado. Ejecuta con --allow-prod si realmente deseas continuar (no recomendado).')
    process.exit(1)
  }

  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  })

  console.log('🚀 Inicio limpieza de webinars')
  console.log(`   Entorno: ${env}`)
  console.log(`   Mantener slug: ${keepSlug}`)
  console.log(`   Modo simulación (dry-run): ${dryRun ? 'Sí' : 'No'}`)

  try {
    // 1) Verificar webinar a mantener
    const keepWebinar = await prisma.webinar.findUnique({
      where: { slug: keepSlug },
      include: { registrations: true },
    })

    if (!keepWebinar) {
      console.error(`❌ No se encontró el webinar con slug '${keepSlug}'. Aborto.`)
      process.exit(1)
    }

    // 2) Backup de todos los webinars y registros
    const allWebinars = await prisma.webinar.findMany({ include: { registrations: true } })
    const backupPayload = {
      metadata: {
        createdAt: new Date().toISOString(),
        environment: env,
        keepSlug,
        totalWebinars: allWebinars.length,
      },
      data: allWebinars,
    }

    const backupsDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true })
    const backupPath = path.join(backupsDir, `webinars-backup-before-cleanup-${ts()}.json`)
    fs.writeFileSync(backupPath, JSON.stringify(backupPayload, null, 2))
    console.log(`✅ Backup creado: ${backupPath}`)

    // 3) Calcular cuáles se eliminarán
    const toDelete = allWebinars.filter((w) => w.id !== keepWebinar.id)
    console.log(`📋 Webinars totales: ${allWebinars.length}`)
    console.log(`🛡️ Webinar a mantener: ${keepWebinar.title} (${keepWebinar.slug})`)
    console.log(`🗑️ Webinars a eliminar: ${toDelete.length}`)

    if (toDelete.length === 0) {
      console.log('ℹ️ No hay webinars adicionales que eliminar.')
      return
    }

    if (dryRun) {
      console.log('🧪 Dry-run activado. No se eliminaron registros. Listado de slugs a eliminar:')
      console.log(toDelete.map((w) => w.slug))
      return
    }

    // 4) Eliminar webinars (cascada eliminará registros asociados)
    const deleteResult = await prisma.webinar.deleteMany({
      where: { id: { not: keepWebinar.id } },
    })
    console.log(`✅ Eliminación completada. Registros eliminados: ${deleteResult.count}`)

    // 5) Verificación rápida
    const remaining = await prisma.webinar.findMany()
    console.log(`📦 Webinars restantes en BD: ${remaining.length}`)
    console.log(remaining.map((w) => `${w.title} (${w.slug})`).join('\n'))
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((err) => {
  console.error('💥 Error en limpieza de webinars:', err)
  process.exit(1)
})


