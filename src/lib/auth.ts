import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { SafeUser } from '@/types/auth'
import { NextRequest } from 'next/server'

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