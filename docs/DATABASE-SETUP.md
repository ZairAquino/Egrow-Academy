# 🗄️ Configuración de Base de Datos - eGrow Academy

## 📋 Resumen del Proyecto

**Objetivo**: Implementar sistema de autenticación y base de datos para eGrow Academy usando PostgreSQL + Prisma.

**Tecnologías**:
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT + bcrypt
- **Framework**: Next.js 15 + TypeScript

---

## 🚀 Fase 1: Instalación y Configuración Inicial

### ✅ Paso 1.1: Instalación de Dependencias

**Comando ejecutado**:
```bash
npm install @prisma/client bcryptjs jsonwebtoken
npm install -D prisma @types/bcryptjs @types/jsonwebtoken
```

**Dependencias instaladas**:
- `@prisma/client`: Cliente de Prisma para conectar con la base de datos
- `bcryptjs`: Para hashear contraseñas de forma segura
- `jsonwebtoken`: Para crear tokens de autenticación (JWT)
- `prisma`: CLI de Prisma para generar el cliente y manejar migraciones
- `@types/*`: Tipos de TypeScript para las librerías

**Archivos modificados**:
- `package.json`: Agregadas nuevas dependencias

### ✅ Paso 1.2: Inicialización de Prisma

**Comando ejecutado**:
```bash
npx prisma init
```

**Archivos creados**:
- `prisma/schema.prisma`: Archivo principal de configuración de Prisma
- `.env`: Archivo de variables de entorno (ya existía)

**Configuración inicial**:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 🗄️ Fase 2: Diseño del Modelo de Datos

### ✅ Paso 2.1: Definición del Schema Completo

**Archivo**: `prisma/schema.prisma`

**Modelos implementados**:

#### 1. **User** (Usuarios)
```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  passwordHash    String
  firstName       String
  lastName        String
  username        String?   @unique
  profileImage    String?
  bio             String?
  membershipLevel MembershipLevel @default(FREE)
  isActive        Boolean   @default(true)
  emailVerified   Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  lastLogin       DateTime?

  // Relaciones
  comments        Comment[]
  questions       Question[]
  enrollments     Enrollment[]
  posts           CommunityPost[]
  likes           Like[]
  sessions        Session[]
  courses         Course[]  @relation("CourseInstructor")

  @@map("users")
}
```

**Campos clave**:
- `id`: Identificador único usando CUID (más seguro que UUID)
- `email`: Email único para login
- `passwordHash`: Contraseña hasheada con bcrypt
- `membershipLevel`: FREE/PREMIUM para futuras suscripciones
- `isActive`: Para desactivar usuarios sin eliminarlos
- `emailVerified`: Para verificación de email futura

#### 2. **Course** (Cursos)
```prisma
model Course {
  id              String    @id @default(cuid())
  title           String
  slug            String    @unique
  description     String?
  shortDescription String?
  imageUrl        String?
  price           Decimal   @default(0)
  isFree          Boolean   @default(true)
  requiresAuth    Boolean   @default(true)
  difficulty      Difficulty?
  durationHours   Int?
  lessonsCount    Int       @default(0)
  studentsCount   Int       @default(0)
  rating          Decimal   @default(0)
  status          CourseStatus @default(DRAFT)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relaciones
  instructorId    String?
  instructor      User?     @relation("CourseInstructor", fields: [instructorId], references: [id])
  enrollments     Enrollment[]
  comments        Comment[]
  lessons         Lesson[]

  @@map("courses")
}
```

**Campos clave**:
- `slug`: URL amigable para SEO
- `isFree`: Distingue entre cursos gratuitos y premium
- `requiresAuth`: Si requiere autenticación para acceder
- `status`: DRAFT/PUBLISHED/ARCHIVED

#### 3. **Comment** (Comentarios)
```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String
  type      CommentType
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId  String?
  course    Course?  @relation(fields: [courseId], references: [id], onDelete: Cascade)
  parentId  String?
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
  likes     Like[]

  @@map("comments")
}
```

**Características**:
- **Sistema de respuestas**: Comentarios pueden tener respuestas (parentId)
- **Tipos múltiples**: FORUM/QUESTION/COURSE_COMMENT
- **Cascade delete**: Si se elimina usuario/curso, se eliminan comentarios

#### 4. **Question** (Preguntas)
```prisma
model Question {
  id       String   @id @default(cuid())
  title    String
  content  String
  category String?
  status   QuestionStatus @default(OPEN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  userId   String
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  answers  Comment[]
  likes    Like[]

  @@map("questions")
}
```

#### 5. **Enrollment** (Inscripciones)
```prisma
model Enrollment {
  id                 String   @id @default(cuid())
  enrolledAt         DateTime @default(now())
  completedAt        DateTime?
  progressPercentage Decimal  @default(0)
  status             EnrollmentStatus @default(ACTIVE)

  // Relaciones
  userId   String
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId String
  course   Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId])
  @@map("enrollments")
}
```

**Características**:
- **Único por usuario/curso**: Un usuario solo puede inscribirse una vez por curso
- **Seguimiento de progreso**: Porcentaje de completado
- **Estados**: ACTIVE/COMPLETED/DROPPED

#### 6. **Like** (Sistema de Likes)
```prisma
model Like {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())

  // Relaciones
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  commentId String?
  comment   Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)
  questionId String?
  question  Question? @relation(fields: [questionId], references: [id], onDelete: Cascade)
  postId    String?
  post      CommunityPost? @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, commentId, questionId, postId])
  @@map("likes")
}
```

**Características**:
- **Sistema flexible**: Likes para comentarios, preguntas y posts
- **Único por usuario**: Un usuario solo puede dar like una vez

### ✅ Paso 2.2: Enums Definidos

```prisma
enum MembershipLevel {
  FREE
  PREMIUM
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum Difficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum CommentType {
  FORUM
  QUESTION
  COURSE_COMMENT
}

enum QuestionStatus {
  OPEN
  ANSWERED
  CLOSED
}

enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  DROPPED
}
```

---

## 🔧 Fase 3: Configuración del Cliente Prisma

### ✅ Paso 3.1: Cliente Prisma Singleton

**Archivo**: `src/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Características**:
- **Singleton Pattern**: Evita múltiples conexiones
- **Hot Reload**: Funciona bien con Next.js en desarrollo
- **Logging condicional**: Queries en desarrollo, solo errores en producción

---

## 📝 Fase 4: Tipos de TypeScript

### ✅ Paso 4.1: Tipos de Autenticación

**Archivo**: `src/types/auth.ts`

```typescript
import { User } from '@prisma/client'

// Tipo para usuario sin información sensible
export type SafeUser = Omit<User, 'passwordHash'>

// Tipo para datos de registro
export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  username?: string
}

// Tipo para datos de login
export interface LoginData {
  email: string
  password: string
}

// Tipo para respuesta de autenticación
export interface AuthResponse {
  user: SafeUser
  token: string
}

// Tipo para contexto de autenticación
export interface AuthContextType {
  user: SafeUser | null
  login: (data: LoginData) => Promise<void>
  logout: () => void
  register: (data: RegisterData) => Promise<void>
  isLoading: boolean
}
```

**Beneficios**:
- **Type Safety**: Autocompletado y validación de tipos
- **Seguridad**: SafeUser excluye passwordHash
- **Consistencia**: Interfaces bien definidas

---

## 🔐 Fase 5: Utilidades de Autenticación

### ✅ Paso 5.1: Funciones Helper

**Archivo**: `src/lib/auth.ts`

```typescript
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { SafeUser } from '@/types/auth'

// Función para hashear contraseñas
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Función para verificar contraseñas
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Función para generar JWT
export function generateToken(userId: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado')
  }
  
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Función para verificar JWT
export function verifyToken(token: string): { userId: string } {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado')
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    throw new Error('Token inválido')
  }
}

// Función para extraer token del header Authorization
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  return authHeader.substring(7) // Remover 'Bearer '
}

// Función para crear usuario seguro (sin passwordHash)
export function createSafeUser(user: any): SafeUser {
  const { passwordHash, ...safeUser } = user
  return safeUser
}
```

**Funciones implementadas**:
- `hashPassword`: Hash seguro con bcrypt (12 rounds)
- `verifyPassword`: Verificación de contraseñas
- `generateToken`: Creación de JWT con expiración
- `verifyToken`: Verificación y decodificación de JWT
- `extractTokenFromHeader`: Extracción de token de headers
- `createSafeUser`: Creación de objeto usuario seguro

---

## 📊 Estado Actual del Proyecto

### ✅ Completado:
- [x] Instalación de dependencias
- [x] Inicialización de Prisma
- [x] Definición completa del schema
- [x] Configuración del cliente Prisma
- [x] Tipos de TypeScript
- [x] Utilidades de autenticación

### 🔄 Pendiente:
- [ ] Configuración de PostgreSQL
- [ ] Variables de entorno (.env)
- [ ] Generación del cliente Prisma
- [ ] Migraciones iniciales
- [ ] APIs de autenticación
- [ ] Componentes de frontend
- [ ] Contexto de autenticación
- [ ] Protección de rutas

---

## 🚀 Próximos Pasos

### Fase 6: Configuración de PostgreSQL
1. Instalar PostgreSQL localmente o configurar servicio cloud
2. Crear base de datos `egrow_academy`
3. Configurar variables de entorno

### Fase 7: Migraciones y Generación
1. Generar cliente Prisma
2. Crear migración inicial
3. Ejecutar migración en base de datos

### Fase 8: APIs de Autenticación
1. API de registro de usuarios
2. API de login
3. API de logout
4. Middleware de autenticación

### Fase 9: Frontend
1. Contexto de autenticación
2. Componentes de formularios
3. Protección de rutas
4. Integración con sidebar

---

## 📚 Recursos y Referencias

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js/)

---

**Última actualización**: [Fecha actual]
**Versión**: 1.0.0
**Autor**: Equipo de Desarrollo eGrow Academy 