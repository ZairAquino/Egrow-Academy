# 🚀 Próximos Pasos - eGrow Academy

## 📋 Estado Actual

**Última actualización**: [Fecha actual]
**Fase completada**: Configuración inicial de Prisma + PostgreSQL
**Próxima fase**: Configuración de PostgreSQL y migraciones

---

## 🔄 Fase 6: Configuración de PostgreSQL

### Paso 6.1: Opciones de PostgreSQL

#### Opción A: PostgreSQL Local
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Crear usuario y base de datos
sudo -u postgres psql
CREATE USER egrow_user WITH PASSWORD 'tu_password_seguro';
CREATE DATABASE egrow_academy OWNER egrow_user;
GRANT ALL PRIVILEGES ON DATABASE egrow_academy TO egrow_user;
\q
```

#### Opción B: Servicios Cloud (Recomendado)

**1. Supabase (Gratis hasta 500MB)**
- URL: https://supabase.com
- Ventajas: Gratis, fácil configuración, dashboard incluido
- Configuración: Crear proyecto → Obtener DATABASE_URL

**2. Neon (Serverless)**
- URL: https://neon.tech
- Ventajas: Serverless, escalable, gratis
- Configuración: Crear proyecto → Obtener DATABASE_URL

**3. Railway**
- URL: https://railway.app
- Ventajas: Fácil deploy, integración con GitHub
- Configuración: Crear proyecto → PostgreSQL → Obtener DATABASE_URL

### Paso 6.2: Configurar Variables de Entorno

**Archivo**: `.env` (crear manualmente)

```env
# Database
DATABASE_URL="postgresql://usuario:password@host:port/egrow_academy"

# JWT Secret (generar uno seguro)
JWT_SECRET="tu_jwt_secret_super_seguro_minimo_32_caracteres_para_produccion"

# Environment
NODE_ENV="development"
```

**Generar JWT Secret seguro**:
```bash
# Opción 1: Usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opción 2: Usando OpenSSL
openssl rand -hex 32
```

---

## 🔄 Fase 7: Migraciones y Generación

### Paso 7.1: Generar Cliente Prisma

```bash
# Generar cliente Prisma
npx prisma generate
```

**Qué hace**:
- Genera el cliente TypeScript basado en el schema
- Crea tipos automáticos para todos los modelos
- Habilita autocompletado en el IDE

### Paso 7.2: Crear Migración Inicial

```bash
# Crear migración
npx prisma migrate dev --name init
```

**Qué hace**:
- Crea archivo de migración SQL
- Aplica la migración a la base de datos
- Crea las tablas según el schema

### Paso 7.3: Verificar Migración

```bash
# Ver estado de migraciones
npx prisma migrate status

# Ver base de datos en Prisma Studio
npx prisma studio
```

---

## 🔄 Fase 8: APIs de Autenticación

### Paso 8.1: API de Registro

**Archivo**: `src/app/api/auth/register/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createSafeUser } from '@/lib/auth'
import { RegisterData } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, username }: RegisterData = await request.json()
    
    // Validaciones
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }
    
    // Hash de la contraseña
    const hashedPassword = await hashPassword(password)
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        username
      }
    })
    
    // Retornar usuario seguro (sin passwordHash)
    const safeUser = createSafeUser(user)
    
    return NextResponse.json(
      { user: safeUser, message: 'Usuario registrado exitosamente' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

### Paso 8.2: API de Login

**Archivo**: `src/app/api/auth/login/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken, createSafeUser } from '@/lib/auth'
import { LoginData } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginData = await request.json()
    
    // Validaciones
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }
    
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }
    
    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.passwordHash)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }
    
    // Verificar si el usuario está activo
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Cuenta desactivada' },
        { status: 401 }
      )
    }
    
    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })
    
    // Generar JWT
    const token = generateToken(user.id)
    
    // Retornar respuesta
    const safeUser = createSafeUser(user)
    
    return NextResponse.json({
      user: safeUser,
      token,
      message: 'Login exitoso'
    })
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

### Paso 8.3: Middleware de Autenticación

**Archivo**: `src/middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'

export function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedRoutes = [
    '/api/comments',
    '/api/questions',
    '/api/courses',
    '/api/enrollments'
  ]
  
  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  if (isProtectedRoute) {
    const token = extractTokenFromHeader(request.headers.get('authorization'))
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      )
    }
    
    try {
      const decoded = verifyToken(token)
      // Agregar userId al request para uso posterior
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('user-id', decoded.userId)
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/api/comments/:path*',
    '/api/questions/:path*',
    '/api/courses/:path*',
    '/api/enrollments/:path*'
  ]
}
```

---

## 🔄 Fase 9: Frontend - Contexto de Autenticación

### Paso 9.1: Contexto de Autenticación

**Archivo**: `src/contexts/AuthContext.tsx`

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AuthContextType, LoginData, RegisterData, SafeUser } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar sesión al cargar
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          localStorage.removeItem('token')
        }
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      const result = await response.json()
      setUser(result.user)
      localStorage.setItem('token', result.token)
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      const result = await response.json()
      setUser(result.user)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}
```

### Paso 9.2: Componente de Login

**Archivo**: `src/components/auth/LoginForm.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginData } from '@/types/auth'

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(formData)
      // Redirigir o cerrar modal
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error en login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  )
}
```

---

## 📋 Checklist de Implementación

### Fase 6: PostgreSQL
- [ ] Instalar/configurar PostgreSQL
- [ ] Crear base de datos
- [ ] Configurar variables de entorno
- [ ] Probar conexión

### Fase 7: Migraciones
- [ ] Generar cliente Prisma
- [ ] Crear migración inicial
- [ ] Ejecutar migración
- [ ] Verificar tablas creadas

### Fase 8: APIs
- [ ] API de registro
- [ ] API de login
- [ ] API de logout
- [ ] Middleware de autenticación
- [ ] Probar APIs

### Fase 9: Frontend
- [ ] Contexto de autenticación
- [ ] Componente de login
- [ ] Componente de registro
- [ ] Integración con sidebar
- [ ] Protección de rutas

---

## 🎯 Objetivos de la Siguiente Sesión

1. **Configurar PostgreSQL** (local o cloud)
2. **Crear archivo .env** con variables de entorno
3. **Generar cliente Prisma** y crear migraciones
4. **Implementar APIs** de autenticación básicas
5. **Probar flujo** de registro y login

---

**Notas importantes**:
- Mantener documentación actualizada
- Probar cada paso antes de continuar
- Hacer commits frecuentes
- Documentar cualquier problema encontrado 