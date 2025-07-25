# 🎓 eGrow Academy

Plataforma educativa de Inteligencia Artificial desarrollada con Next.js 15, TypeScript y PostgreSQL.

## 🚀 Características

- **Autenticación Completa**: Sistema de login/registro con verificación de email
- **Sistema de Comunidad**: Foro interactivo con posts, comentarios y estadísticas en tiempo real
- **Sistema de Eventos**: Gestión de eventos educativos con registro y recordatorios automáticos
- **Sistema de Contacto**: Formulario con confirmación automática por email
- **Control de Acceso**: Recursos y funcionalidades protegidas por autenticación
- **Gestión de Recursos**: Biblioteca de recursos educativos con acceso controlado
- **Validación Estricta**: Verificación de correos electrónicos reales con DNS MX
- **Páginas Legales**: Términos, privacidad y sistema de facturación
- **Diseño Responsivo**: Mobile-first con Tailwind CSS y UserProfile optimizado
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Performance**: Optimizado con Next.js 15 y Turbopack
- **Email Service**: Múltiples plantillas con Resend para verificación y contacto

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js App Router
│   ├── api/               # APIs del backend
│   │   ├── auth/          # Autenticación (login, register, verify-email)
│   │   ├── community/     # Sistema de comunidad (posts, stats, comments)
│   │   ├── contact/       # Sistema de contacto con email automático
│   │   ├── events/        # Gestión de eventos y registros
│   │   ├── resources/     # Recursos educativos con control de acceso
│   │   ├── courses/       # Sistema de cursos y progreso
│   │   ├── user/          # Estadísticas y datos del usuario
│   │   ├── stripe/        # Integración de pagos
│   │   └── webhooks/      # Webhooks de servicios externos
│   ├── community/         # Páginas de comunidad y foro
│   │   └── foro/          # Foro interactivo
│   ├── contacto/          # Página de contacto con formulario
│   ├── courses/           # Catálogo de cursos
│   ├── curso/             # Páginas individuales de cursos
│   ├── my-courses/        # Dashboard de cursos del usuario
│   ├── resources/         # Biblioteca de recursos educativos
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   ├── verify-email/      # Verificación de email
│   ├── profile/           # Perfil del usuario
│   ├── subscription/      # Gestión de suscripciones
│   ├── politica-privacidad/ # Política de privacidad
│   └── terminos-condiciones/ # Términos y condiciones
├── components/
│   ├── auth/              # Componentes de autenticación y UserProfile
│   ├── courses/           # Componentes de cursos y videos
│   ├── resources/         # Componentes de recursos
│   ├── payments/          # Componentes de pagos y suscripciones
│   ├── layout/            # Header, Footer, Sidebar
│   └── ui/                # Componentes de interfaz
├── contexts/              # Contextos de React
│   └── AuthContext.tsx    # Contexto de autenticación
├── hooks/                 # Custom hooks
│   ├── useCommunityPosts.ts # Hook para posts del foro
│   ├── useCommunityStats.ts # Hook para estadísticas
│   ├── useEvents.ts       # Hook para eventos
│   ├── useResources.ts    # Hook para recursos
│   └── useUserStats.ts    # Hook para estadísticas del usuario
├── lib/                   # Utilidades y configuraciones
│   ├── email.ts           # Servicio de email con múltiples plantillas
│   ├── email-validation.ts # Validación de correos con DNS MX
│   ├── prisma.ts          # Cliente de base de datos
│   └── stripe.ts          # Configuración de Stripe
└── types/                 # Tipos de TypeScript
    ├── auth.ts            # Tipos de autenticación
    └── stripe.ts          # Tipos de Stripe
```

## 🛠️ Tecnologías

- **Frontend**: Next.js 15.4.1, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT con cookies HTTP-only
- **Email Service**: Resend para verificación de emails
- **Validación**: DNS MX para verificación de dominios

## 🚀 Instalación y Despliegue

### **Desarrollo Local**

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd Egrow-Academy
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Configurar las siguientes variables:
   ```env
   # Database
   DATABASE_URL="postgresql://..."
   
   # Authentication
   JWT_SECRET="tu-secreto-jwt"
   COOKIE_SECRET="tu-secreto-cookie"
   
   # Email Service
   RESEND_API_KEY="re_..."
   RESEND_FROM_EMAIL="egrowsuite@gmail.com"
   CONTACT_NOTIFICATION_EMAIL="egrowsuite@gmail.com"
   
   # App
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="tu-secreto-nextauth"
   ```

4. **Configurar la base de datos**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

### **Despliegue en Producción**

**⚠️ IMPORTANTE: Este es un proyecto Next.js que requiere un servidor. NO es compatible con GitHub Pages.**

#### **Opción 1: Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

#### **Opción 2: Netlify**
```bash
# Build del proyecto
npm run build

# Desplegar en Netlify
```

#### **Opción 3: Railway/Render**
Configurar como aplicación Node.js con build command: `npm run build`

## 📚 Documentación

- [Log de Desarrollo](./docs/PROJECT-DEVELOPMENT-LOG.md)
- [Resumen del Proyecto](./docs/QUICK-SUMMARY.md)
- [Configuración de Base de Datos](./docs/DATABASE-SETUP.md)
- [Guía de Endpoints](./docs/api/ENDPOINTS-GUIDE.md)
- [Resumen Ejecutivo](./docs/EXECUTIVE-SUMMARY.md)

## 🎯 Funcionalidades Principales

### 🔐 Autenticación y Seguridad
- **Registro con verificación**: Validación estricta de correos electrónicos
- **Verificación de email**: Códigos de 6 dígitos enviados por Resend
- **Login seguro**: Solo usuarios verificados pueden acceder
- **Validación DNS MX**: Verificación de existencia real de dominios
- **Cookies HTTP-only**: Seguridad mejorada contra ataques XSS

### 📄 Páginas Legales
- **Términos y Condiciones**: 12 secciones completas con suscripciones
- **Política de Privacidad**: 13 secciones sobre manejo de datos
- **Sistema de Facturación**: Planes, precios y métodos de pago
- **Derechos ARCO**: Acceso, Rectificación, Cancelación, Oposición

### 🎓 Contenido Educativo
- **Cursos de IA**: Catálogo completo con filtros
- **Cursos Gratuitos**: 15 cursos de DeepLearning.AI, YouTube, freeCodeCamp
- **Recursos**: Papers, herramientas, datasets y libros
- **Comunidad**: Foro, eventos y testimonios

### 🎨 Experiencia de Usuario
- **Diseño Responsivo**: Mobile-first con Tailwind CSS
- **Navegación Intuitiva**: Sidebar dinámico con dropdowns
- **Performance Optimizada**: Turbopack, code splitting, tree shaking
- **SEO Optimizado**: Meta tags, Open Graph, structured data

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo con Turbopack
- `npm run build` - Build de producción optimizado
- `npm run start` - Servidor de producción
- `npm run lint` - Linting del código con ESLint
- `npx prisma generate` - Regenerar cliente Prisma
- `npx prisma migrate dev` - Aplicar migraciones de base de datos
- `npx prisma db seed` - Cargar datos de prueba

## 🌐 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login de usuarios
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/verify-email` - Verificar email con código
- `POST /api/auth/resend-verification` - Reenviar código de verificación

### Comunidad
- `GET /api/community/stats` - Estadísticas de la comunidad
- `GET /api/community/posts` - Obtener posts del foro
- `POST /api/community/posts` - Crear nuevo post
- `POST /api/community/posts/[id]/like` - Dar like a un post
- `POST /api/community/posts/[id]/comments` - Comentar en un post

### Contacto
- `POST /api/contact` - Enviar formulario de contacto con confirmación automática

### Eventos
- `GET /api/events` - Listar eventos disponibles
- `POST /api/events/register` - Registrarse a un evento
- `GET /api/events/user-registrations` - Eventos registrados del usuario
- `POST /api/events/send-reminders` - Enviar recordatorios de eventos

### Recursos
- `GET /api/resources` - Listar recursos con control de acceso
- `GET /api/resources/[slug]` - Obtener recurso específico
- `GET /api/resources/[slug]/access` - Acceder a recurso con autenticación

### Cursos
- `GET /api/courses/user-courses` - Cursos del usuario
- `POST /api/courses/enroll` - Inscribirse a un curso
- `GET /api/courses/[slug]/access` - Verificar acceso a curso
- `POST /api/courses/progress` - Actualizar progreso del curso

### Usuario
- `GET /api/user/stats` - Estadísticas del usuario

### Pagos (Stripe)
- `POST /api/stripe/create-checkout-session` - Crear sesión de pago
- `POST /api/stripe/webhook` - Webhook de Stripe

### Utilidades
- `GET /api/test-email` - Test de servicio de email
- `GET /api/test-env` - Test de variables de entorno

## 📊 Estado del Proyecto

- ✅ **Autenticación**: 100% implementado con verificación de email
- ✅ **Sistema de Comunidad**: 100% implementado (foro, posts, comentarios, estadísticas)
- ✅ **Sistema de Eventos**: 100% implementado con registro y recordatorios
- ✅ **Sistema de Contacto**: 100% implementado con confirmaciones automáticas
- ✅ **Control de Acceso**: 100% implementado para recursos y funcionalidades
- ✅ **Sistema de Cursos**: 100% implementado con progreso persistente
- ✅ **Gestión de Recursos**: 100% implementado con autenticación
- ✅ **Páginas Legales**: 100% implementado (términos, privacidad, facturación)
- ✅ **UserProfile Optimizado**: 100% implementado con diseño minimalista
- ✅ **Integración de Pagos**: 100% implementado con Stripe
- ✅ **Validación de Correos**: 100% implementado con DNS MX
- ✅ **Base de Datos**: 100% configurado con PostgreSQL y Prisma
- ✅ **Email Service**: 100% implementado con múltiples plantillas
- ✅ **Documentación**: 100% actualizada

## 🌐 URLs de Despliegue

- **Vercel (Producción)**: https://egrow-academy-jfk1qzvfd-egrow.vercel.app
- **Dominio Personalizado**: egrowacademy.com (configurar en Vercel)
- **GitHub Pages**: ❌ No compatible (solo archivos estáticos)

## 🚀 Próximos Pasos

### Inmediatos (Opcionales)
1. **Configurar dominio en Resend** para envío de emails reales
2. **Implementar analytics** y tracking de usuarios
3. **Optimizar Core Web Vitals** para mejor rendimiento
4. **Implementar PWA** para experiencia móvil mejorada

### Mejoras Futuras
1. **Sistema de notificaciones** push
2. **API pública** para integraciones externas
3. **Analytics avanzados** y métricas de uso
4. **Sistema de gamificación** para usuarios

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ para la comunidad de Inteligencia Artificial**

## 🔧 **Cambios necesarios en Namecheap:**

### **1. Eliminar el registro A de GitHub Pages:**
- **Elimina** el registro A que dice:
  - Tipo: "A Record"
  - Host: "@"
  - Valor: "216.198.79.1" ← **Este es el problema**

### **2. Agregar los registros A de Vercel:**
- **Click en "ADD NEW RECORD"** y agrega:

```
Tipo: A Record  
Host: @
Valor: 76.76.19.76
TTL: Automatic
```

### **3. Verificar el CNAME existente:**
- **Mantén** el CNAME que ya tienes:
  - Tipo: "CNAME Record"
  - Host: "www"
  - Valor: "b1f74eb4b69f83a3.vercel-dns-017.com." ← **Este está bien**

### **4. Verificar el TXT existente:**
- **Mantén** el TXT que ya tienes:
  - Tipo: "TXT Record"
  - Host: "vercel"
  - Valor: "ns1.vercel-dns.com" ← **Este está bien**

## 📋 **Resumen de lo que debes hacer:**

1. **❌ Eliminar:** A Record con valor `216.198.79.1`
2. **✅ Agregar:** 2 A Records con valor `76.76.19.76`
3. **✅ Mantener:** Los registros CNAME y TXT existentes

**Después de hacer estos cambios, espera 24-48 horas para que se propaguen los DNS.**

**¿Quieres que te ayude con algún paso específico?**
