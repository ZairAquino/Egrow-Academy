# 🎓 eGrow Academy

Plataforma educativa de Inteligencia Artificial desarrollada con Next.js 15, TypeScript y PostgreSQL.

## 🚀 Características

- **Autenticación Completa**: Sistema de login/registro con verificación de email
- **Validación Estricta**: Verificación de correos electrónicos reales
- **Páginas Legales**: Términos, privacidad y sistema de facturación
- **Diseño Responsivo**: Mobile-first con Tailwind CSS
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Performance**: Optimizado con Next.js 15 y Turbopack
- **Email Service**: Integración con Resend para verificación

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js App Router
│   ├── api/auth/          # APIs de autenticación
│   │   ├── login/         # Login de usuarios
│   │   ├── register/      # Registro de usuarios
│   │   ├── verify-email/  # Verificación de email
│   │   └── resend-verification/ # Reenvío de códigos
│   ├── community/         # Página de comunidad
│   ├── contacto/          # Página de contacto
│   ├── courses/           # Página de cursos
│   ├── cursos-cortos/     # Página de cursos cortos
│   ├── facturacion/       # Sistema de facturación
│   ├── login/             # Página de login
│   ├── politica-privacidad/ # Política de privacidad
│   ├── register/          # Página de registro
│   ├── recursos/          # Página de recursos
│   ├── terminos-condiciones/ # Términos y condiciones
│   └── verify-email/      # Página de verificación
├── components/
│   ├── auth/              # Componentes de autenticación
│   ├── courses/           # Componentes de cursos
│   ├── layout/            # Componentes de layout
│   └── ui/                # Componentes de UI
├── contexts/              # Contextos de React
├── lib/                   # Utilidades y configuraciones
│   ├── email.ts           # Servicio de email con Resend
│   ├── email-validation.ts # Validación de correos
│   └── server-email-validation.ts # Validación DNS
└── types/                 # Tipos de TypeScript
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
   RESEND_FROM_EMAIL="noreply@egrow-academy.com"
   
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

### Utilidades
- `GET /api/test` - Test de conectividad
- `GET /api/test-db` - Test de conexión a base de datos

## 📊 Estado del Proyecto

- ✅ **Autenticación**: 100% implementado
- ✅ **Verificación de Email**: 100% implementado
- ✅ **Páginas Legales**: 100% implementado
- ✅ **Sistema de Facturación**: 100% implementado
- ✅ **Validación de Correos**: 100% implementado
- ✅ **Base de Datos**: 100% configurado
- ✅ **Documentación**: 100% actualizada
- ✅ **Sistema de Cursos**: 100% implementado con progreso persistente

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
2. **Integración con pasarelas de pago** reales
3. **Sistema de certificados** para cursos completados
4. **API pública** para integraciones externas

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
