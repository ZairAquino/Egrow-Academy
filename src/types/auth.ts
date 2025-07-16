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