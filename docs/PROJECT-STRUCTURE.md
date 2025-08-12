# Estructura del Proyecto - Egrow Academy
## Actualizado: 2025-01-12

## 📁 Estructura de Directorios

```
egrow-academy/
├── src/                    # Código fuente principal
│   ├── app/               # Next.js App Router
│   │   ├── api/          # Endpoints de API
│   │   ├── curso/        # Páginas de cursos
│   │   └── [pages]      # Páginas principales
│   ├── components/        # Componentes React
│   │   ├── auth/         # Autenticación
│   │   ├── courses/      # Cursos
│   │   ├── layout/       # Layout principal
│   │   ├── ui/           # Componentes UI
│   │   └── webinar/      # Webinars
│   ├── contexts/          # Context API
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilidades y configuración
│   ├── middleware/       # Middleware de Next.js
│   ├── types/            # Tipos TypeScript
│   └── utils/            # Funciones de utilidad
├── prisma/                # Base de datos
│   ├── migrations/       # Migraciones
│   └── schema.prisma     # Esquema de DB
├── public/                # Archivos estáticos
│   ├── images/           # Imágenes
│   ├── videos/           # Videos
│   └── resources/        # PDFs y recursos
├── scripts/               # Scripts de mantenimiento
├── docs/                  # Documentación
└── config/               # Configuración adicional
```

## 🔧 Tecnologías Principales

- **Framework**: Next.js 15.4.1 con App Router
- **Base de datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js
- **Pagos**: Stripe
- **Estilos**: Tailwind CSS
- **Email**: Resend
- **Upload**: UploadThing

## 📦 Dependencias Principales

### Producción
- `next`: Framework principal
- `react` & `react-dom`: Librería UI
- `@prisma/client`: ORM para base de datos
- `stripe` & `@stripe/stripe-js`: Procesamiento de pagos
- `next-auth`: Autenticación
- `resend`: Envío de emails
- `uploadthing`: Gestión de archivos
- `framer-motion`: Animaciones
- `tailwind-merge` & `clsx`: Utilidades de estilos

### Desarrollo
- `typescript`: Type safety
- `eslint` & `prettier`: Linting y formateo
- `tsx`: Ejecutar scripts TypeScript
- `tailwindcss`: Procesamiento de estilos
- `lighthouse`: Análisis de rendimiento

## 🚀 Scripts Disponibles

### Desarrollo
- `npm run dev` - Inicia servidor de desarrollo con Turbopack
- `npm run build` - Construye para producción
- `npm run lint` - Ejecuta linter
- `npm run typecheck` - Verifica tipos TypeScript

### Base de Datos
- `npx prisma generate` - Genera cliente Prisma
- `npx prisma migrate dev` - Ejecuta migraciones
- `npm run backup-database-prisma` - Backup de DB

### SEO y Performance
- `npm run generate-sitemap` - Genera sitemap
- `npm run lighthouse` - Análisis de performance

## 📝 Archivos de Configuración

- `next.config.ts` - Configuración de Next.js
- `tailwind.config.ts` - Configuración de Tailwind
- `tsconfig.json` - Configuración de TypeScript
- `prisma/schema.prisma` - Esquema de base de datos
- `vercel.json` - Configuración de deployment

## 🔐 Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL=

# Autenticación
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=

# UploadThing
UPLOADTHING_TOKEN=
UPLOADTHING_SECRET=

# WebinarJam
WEBINARJAM_API_KEY=
```

## 📊 Estado del Proyecto

- ✅ **Limpieza completada**: 27 archivos eliminados
- ✅ **Dependencias optimizadas**: 14 paquetes removidos (441 paquetes totales eliminados)
- ✅ **Estructura reorganizada**: Eliminadas carpetas de test y archivos temporales
- ✅ **Documentación actualizada**: Consolidada y actualizada

## 🎯 Próximos Pasos Recomendados

1. Configurar CI/CD con GitHub Actions
2. Implementar tests automatizados
3. Optimizar imágenes con next/image
4. Configurar CDN para assets estáticos
5. Implementar cache strategy

## 🛠️ Mantenimiento

- Ejecutar `npm run lint` antes de commits
- Usar `npm run typecheck` para verificar tipos
- Hacer backup regular con `npm run backup-database-prisma`
- Monitorear performance con `npm run lighthouse`