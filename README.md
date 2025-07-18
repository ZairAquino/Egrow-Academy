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

## 🚀 Instalación

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
