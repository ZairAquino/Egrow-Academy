import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './prisma'

// Configuración de rate limiting
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutos
const MAX_REQUESTS_PER_WINDOW = 100 // 100 requests por ventana
const MAX_LOGIN_ATTEMPTS = 5 // 5 intentos de login por IP
const LOGIN_BLOCK_DURATION = 30 * 60 * 1000 // 30 minutos de bloqueo

// Cache para rate limiting (en producción usar Redis)
const rateLimitCache = new Map<string, { count: number; resetTime: number }>()
const loginAttemptsCache = new Map<string, { attempts: number; blockedUntil: number }>()

// Función para obtener IP del cliente
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  return forwarded?.split(',')[0] || 
         realIP || 
         cfConnectingIP || 
         request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown" || 
         'unknown'
}

// Rate limiting general
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const cached = rateLimitCache.get(ip)
  
  if (!cached || now > cached.resetTime) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetTime: now + RATE_LIMIT_WINDOW }
  }
  
  if (cached.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetTime: cached.resetTime }
  }
  
  cached.count++
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - cached.count, resetTime: cached.resetTime }
}

// Rate limiting específico para login
export function checkLoginRateLimit(ip: string): { allowed: boolean; remainingAttempts: number; blockedUntil?: number } {
  const now = Date.now()
  const cached = loginAttemptsCache.get(ip)
  
  if (cached && now < cached.blockedUntil) {
    return { 
      allowed: false, 
      remainingAttempts: 0, 
      blockedUntil: cached.blockedUntil 
    }
  }
  
  if (!cached || now > cached.blockedUntil) {
    loginAttemptsCache.set(ip, { attempts: 1, blockedUntil: 0 })
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1 }
  }
  
  if (cached.attempts >= MAX_LOGIN_ATTEMPTS) {
    const blockedUntil = now + LOGIN_BLOCK_DURATION
    cached.blockedUntil = blockedUntil
    return { 
      allowed: false, 
      remainingAttempts: 0, 
      blockedUntil 
    }
  }
  
  cached.attempts++
  return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - cached.attempts }
}

// Reset login attempts on successful login
export function resetLoginAttempts(ip: string): void {
  loginAttemptsCache.delete(ip)
}

// Configuración CORS
export const corsConfig = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://egrow-academy.com', 'https://www.egrow-academy.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 horas
}

// Función para aplicar CORS
export function applyCORS(response: NextResponse): NextResponse {
  const origin = corsConfig.origin.includes('*') ? '*' : corsConfig.origin[0]
  
  response.headers.set('Access-Control-Allow-Origin', origin)
  response.headers.set('Access-Control-Allow-Methods', corsConfig.methods.join(', '))
  response.headers.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '))
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', corsConfig.maxAge.toString())
  
  return response
}

// Headers de seguridad adicionales
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Headers básicos ya implementados en middleware
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Headers adicionales
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://www.google-analytics.com; frame-src 'self' https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self'")
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  
  return response
}

// Validación de entrada
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .trim()
}

// Validación de email mejorada
export function validateEmailSecurity(email: string): { valid: boolean; reason?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Formato de email inválido' }
  }
  
  if (email.length > 254) {
    return { valid: false, reason: 'Email demasiado largo' }
  }
  
  // Verificar dominios sospechosos
  const suspiciousDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com']
  const domain = email.split('@')[1]?.toLowerCase()
  
  if (domain && suspiciousDomains.some(d => domain.includes(d))) {
    return { valid: false, reason: 'Dominio de email no permitido' }
  }
  
  return { valid: true }
}

// Log de eventos de seguridad
export async function logSecurityEvent(event: string, details: any, ip: string): Promise<void> {
  try {
    await prisma.securityLog.create({
      data: {
        event,
        details: JSON.stringify(details),
        ipAddress: ip
      }
    })
  } catch (error) {
    console.error('Error logging security event:', error)
  }
}

// Middleware de seguridad
export function securityMiddleware(request: NextRequest): NextResponse | null {
  const ip = getClientIP(request)
  const { pathname } = request.nextUrl
  
  // Rate limiting para APIs críticas
  if (pathname.startsWith('/api/auth/') || pathname.startsWith('/api/stripe/')) {
    const rateLimit = checkRateLimit(ip)
    
    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        { error: 'Demasiadas solicitudes. Inténtalo más tarde.' },
        { status: 429 }
      )
      
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
      response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())
      
      return addSecurityHeaders(response)
    }
  }
  
  // Rate limiting específico para login
  if (pathname === '/api/auth/login') {
    const loginRateLimit = checkLoginRateLimit(ip)
    
    if (!loginRateLimit.allowed) {
      const response = NextResponse.json(
        { 
          error: 'Demasiados intentos de login. Inténtalo más tarde.',
          blockedUntil: loginRateLimit.blockedUntil
        },
        { status: 429 }
      )
      
      return addSecurityHeaders(response)
    }
  }
  
  return null
} 