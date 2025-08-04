import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { SafeUser } from '@/types/auth'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string; iat?: number; exp?: number }
    return { userId: decoded.userId }
  } catch (error) {
    throw new Error('Token inválido')
  }
}

// Función para extraer token del header Authorization
export function extractTokenFromHeader(requestOrHeader: NextRequest | string | null): string | null {
  if (!requestOrHeader) {
    return null
  }
  
  let authHeader: string | null
  
  if (typeof requestOrHeader === 'string') {
    authHeader = requestOrHeader
  } else {
    authHeader = requestOrHeader.headers.get('authorization')
  }
  
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

// Función para obtener sesión del servidor
export async function getServerSession(): Promise<SafeUser | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('session')?.value
    
    if (!token) {
      return null
    }
    
    const { userId } = verifyToken(token)
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      return null
    }
    
    return createSafeUser(user)
  } catch (error) {
    return null
  }
} 