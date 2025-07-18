# 🎓 eGrow Academy

Plataforma educativa de Inteligencia Artificial desarrollada con Next.js 15, TypeScript y PostgreSQL.

## 🚀 Características

- **Autenticación Simplificada**: Sistema de login/registro con JWT
- **Selección Rápida de Gmail**: Acceso rápido para usuarios con correos Gmail
- **Diseño Responsivo**: Mobile-first con Tailwind CSS
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Performance**: Optimizado con Next.js 15 y Turbopack

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js App Router
│   ├── api/auth/          # APIs de autenticación
│   ├── community/         # Página de comunidad
│   ├── contacto/          # Página de contacto
│   ├── courses/           # Página de cursos
│   ├── cursos-cortos/     # Página de cursos cortos
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   └── resources/         # Página de recursos
├── components/
│   ├── auth/              # Componentes de autenticación
│   ├── courses/           # Componentes de cursos
│   ├── layout/            # Componentes de layout
│   └── ui/                # Componentes de UI
├── contexts/              # Contextos de React
├── lib/                   # Utilidades y configuraciones
└── types/                 # Tipos de TypeScript
```

## 🛠️ Tecnologías

- **Frontend**: Next.js 15.4.1, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT con cookies HTTP-only

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
   ```
   DATABASE_URL="postgresql://..."
   JWT_SECRET="tu-secreto-jwt"
   ```

4. **Configurar la base de datos**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 📚 Documentación

- [Guía de Autenticación](./docs/features/AUTH_SIMPLIFICATION.md)
- [Selección Rápida de Gmail](./docs/features/GMAIL_QUICK_SELECT.md)
- [Resumen del Proyecto](./docs/features/QUICK-SUMMARY.md)
- [Log de Desarrollo](./docs/PROJECT-DEVELOPMENT-LOG.md)

## 🎯 Funcionalidades Principales

### Autenticación
- Registro con verificación automática de email
- Login con JWT seguro
- Logout automático

### Selección Rápida de Gmail
- Guardado automático de correos Gmail
- Dropdown para selección rápida
- Máximo 5 correos guardados

### Cursos
- Catálogo de cursos de IA
- Cursos cortos especializados
- Recursos educativos

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting del código

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.
