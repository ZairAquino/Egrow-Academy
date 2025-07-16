# 🚀 eGrow Academy - Plataforma de Aprendizaje de IA

Plataforma educativa moderna para aprender Inteligencia Artificial y Machine Learning, construida con Next.js 15, TypeScript, PostgreSQL y Prisma.

## 🎯 Características

- **Cursos Gratuitos y Premium**: Sistema de membresía con acceso controlado
- **Comunidad Interactiva**: Foro, preguntas y respuestas
- **Autenticación Segura**: JWT + bcrypt para protección de usuarios
- **Diseño Responsivo**: Optimizado para móviles y desktop
- **Escalabilidad**: PostgreSQL + Prisma para grandes volúmenes de datos

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT, bcrypt
- **Deploy**: Vercel (recomendado)

## 📋 Estado del Proyecto

### ✅ Completado (40%)
- [x] Configuración inicial de Prisma + PostgreSQL
- [x] Modelo de datos completo (9 entidades)
- [x] Utilidades de autenticación
- [x] Tipos TypeScript
- [x] Documentación completa

### 🔄 En Progreso (60%)
- [ ] Configuración de PostgreSQL
- [ ] Migraciones de base de datos
- [ ] APIs de autenticación
- [ ] Componentes de frontend
- [ ] Integración completa

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- PostgreSQL (local o cloud)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone [url-del-repositorio]
cd egrow-academy-nextjs
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales
DATABASE_URL="postgresql://usuario:password@host:port/egrow_academy"
JWT_SECRET="tu_jwt_secret_super_seguro_minimo_32_caracteres"
```

4. **Configurar base de datos**
```bash
# Generar cliente Prisma
npx prisma generate

# Crear y ejecutar migraciones
npx prisma migrate dev --name init
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 📁 Estructura del Proyecto

```
egrow-academy-nextjs/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Componentes React
│   ├── lib/                 # Utilidades y configuración
│   ├── types/               # Tipos TypeScript
│   └── contexts/            # Contextos React
├── prisma/
│   └── schema.prisma        # Modelo de datos
├── docs/                    # Documentación
│   ├── DATABASE-SETUP.md    # Configuración de BD
│   ├── NEXT-STEPS.md        # Próximos pasos
│   └── EXECUTIVE-SUMMARY.md # Resumen ejecutivo
└── public/                  # Archivos estáticos
```

## 🗄️ Modelo de Datos

### Entidades Principales
- **User**: Usuarios con niveles de membresía (FREE/PREMIUM)
- **Course**: Cursos con sistema de precios y dificultad
- **Comment**: Sistema de comentarios con respuestas
- **Question**: Preguntas de la comunidad
- **Enrollment**: Inscripciones y progreso de usuarios
- **Like**: Sistema de likes flexible
- **Session**: Gestión de sesiones
- **Lesson**: Lecciones dentro de cursos
- **CommunityPost**: Posts del foro

## 🔐 Sistema de Autenticación

### Flujo de Usuario
1. **Visitante**: Ve contenido limitado
2. **Intenta interactuar**: Modal de login aparece
3. **Usuario registrado**: Acceso completo a funcionalidades gratuitas
4. **Usuario premium**: Acceso a cursos de pago (futuro)

### Características de Seguridad
- Contraseñas hasheadas con bcrypt (12 rounds)
- JWT con expiración de 7 días
- Validación de inputs
- Middleware de autenticación
- Tipos seguros (excluye passwordHash)

## 📚 Documentación

- **[DATABASE-SETUP.md](./docs/DATABASE-SETUP.md)**: Configuración completa de base de datos
- **[NEXT-STEPS.md](./docs/NEXT-STEPS.md)**: Próximos pasos detallados
- **[EXECUTIVE-SUMMARY.md](./docs/EXECUTIVE-SUMMARY.md)**: Resumen ejecutivo del proyecto

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción

# Base de datos
npx prisma studio    # Interfaz visual de BD
npx prisma generate  # Generar cliente Prisma
npx prisma migrate dev --name [nombre]  # Crear migración
npx prisma db push   # Sincronizar schema (solo desarrollo)

# TypeScript
npm run type-check   # Verificar tipos
```

## 🌐 Deploy

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

### Variables de Entorno en Producción
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="secret_super_seguro_produccion"
NODE_ENV="production"
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- **Documentación**: Revisar archivos en `/docs/`
- **Issues**: Crear issue en GitHub
- **Discusiones**: Usar GitHub Discussions

---

**Desarrollado con ❤️ por el equipo de eGrow Academy**
