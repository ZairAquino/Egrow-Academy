# 🎓 Egrow Academy

Plataforma educativa online para cursos de inteligencia artificial y desarrollo profesional.

## 🚀 Características Principales

- **Sistema de Cursos**: Videos, recursos descargables y seguimiento de progreso
- **Webinars en Vivo**: Integración con WebinarJam para eventos en tiempo real  
- **Sistema de Suscripciones**: Planes mensuales y anuales con Stripe
- **Sistema de Rachas**: Gamificación para mantener el compromiso de aprendizaje
- **Autenticación Segura**: Login/registro con verificación de email
- **Recursos Premium**: PDFs, prompts y herramientas exclusivas
- **Dashboard Personalizado**: Estadísticas y progreso del usuario
- **Sistema de Recomendaciones**: Contenido personalizado basado en intereses
- **SEO Optimizado**: Sitemap dinámico y meta tags optimizados
- **Performance**: Next.js 15 con Turbopack para carga rápida
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Email Service**: Notificaciones y recordatorios con Resend

## 📁 Estructura del Proyecto

Para ver la estructura completa del proyecto, consulta [PROJECT-STRUCTURE.md](./docs/PROJECT-STRUCTURE.md)

## 🛠️ Tecnologías

- **Framework**: Next.js 15.4.1 con App Router
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL (Neon)
- **Autenticación**: NextAuth.js con JWT
- **Pagos**: Stripe (suscripciones y pagos únicos)
- **Email**: Resend para notificaciones
- **Webinars**: WebinarJam API
- **Upload**: UploadThing para archivos

## 🧹 Optimización del Proyecto (12 de Enero, 2025)

### ✅ Limpieza Completada
- **Archivos eliminados:** 27 archivos de test y temporales
- **Dependencias removidas:** 14 paquetes no utilizados (441 paquetes totales)
- **Espacio liberado:** ~200MB en node_modules
- **Estructura reorganizada:** Eliminadas carpetas vacías y archivos duplicados

Detalles completos: [CLEANUP-FILES-2025-01-12.md](./docs/CLEANUP-FILES-2025-01-12.md)

## 🚀 Instalación Rápida

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd egrow-academy

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tus credenciales

# 4. Configurar base de datos
npx prisma generate
npx prisma migrate dev

# 5. Iniciar desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Variables de Entorno Requeridas
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

## 📚 Documentación

- [Estructura del Proyecto](./docs/PROJECT-STRUCTURE.md)
- [Guía de Desarrollo](./docs/DEVELOPMENT-GUIDE.md)
- [Guía de Cursos](./docs/COURSE_DEVELOPMENT_GUIDE.md)
- [Sistema de Rachas](./docs/features/ACHIEVEMENTS-SYSTEM.md)
- [Integración con Stripe](./docs/README-STRIPE.md)
- [SEO y Optimización](./docs/README-SEO.md)
- [Guía de Endpoints](./docs/api/ENDPOINTS-GUIDE.md)


## 🔧 Scripts Principales

```bash
# Desarrollo
npm run dev          # Servidor con Turbopack
npm run build        # Build de producción
npm run lint         # Linter
npm run typecheck    # Verificar tipos

# Base de datos  
npx prisma studio    # GUI para DB
npx prisma migrate dev # Migraciones

# SEO y Performance
npm run generate-sitemap # Generar sitemap
npm run lighthouse       # Análisis de performance

# Backup
npm run backup-database-prisma # Backup de DB
```

## 📊 Features Principales

✅ **Sistema de Cursos** - Videos, recursos, progreso persistente
✅ **Webinars en Vivo** - Integración con WebinarJam
✅ **Suscripciones** - Planes con Stripe
✅ **Sistema de Rachas** - Gamificación del aprendizaje
✅ **Recursos Premium** - PDFs, prompts, herramientas
✅ **Dashboard Personalizado** - Estadísticas y progreso
✅ **Sistema de Recomendaciones** - Contenido personalizado
✅ **SEO Optimizado** - Sitemap dinámico, meta tags
✅ **Email Automatizado** - Notificaciones con Resend
✅ **Autenticación Segura** - NextAuth.js con verificación

## 🌐 API Endpoints

Documentación completa de endpoints: [ENDPOINTS-GUIDE.md](./docs/api/ENDPOINTS-GUIDE.md)


## 🔒 Seguridad

- Autenticación con NextAuth.js
- Validación de emails con verificación
- Encriptación de contraseñas con bcrypt  
- Protección CSRF automática
- Rate limiting en APIs críticas
- Sanitización de inputs

## 👥 Equipo

Desarrollo y mantenimiento por el equipo de Egrow Academy

## 📞 Soporte

Para soporte técnico: soporte@egrowacademy.com

## 📄 Licencia

Todos los derechos reservados © 2025 Egrow Academy

---

**Plataforma educativa líder en inteligencia artificial**
