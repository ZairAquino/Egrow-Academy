'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  username?: string
  bio?: string
  profileImage?: string
  emailVerified: boolean
  isActive: boolean
  membershipLevel: string
  lastLogin?: Date | null
  createdAt: Date
  updatedAt: Date
}

interface AuthContextType {
  user: User | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  token: string | null
  isAuthenticated: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')
  const [token, setToken] = useState<string | null>(null)

  // Función para refrescar la información del usuario
  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
          setStatus('authenticated')
          setToken('cookie-based')
        } else {
          setUser(null)
          setStatus('unauthenticated')
          setToken(null)
        }
      } else {
        setUser(null)
        setStatus('unauthenticated')
        setToken(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
      setStatus('unauthenticated')
      setToken(null)
    }
  }

  // Función de logout
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      
      setUser(null)
      setStatus('unauthenticated')
      setToken(null)
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  // Effect para verificar la sesión al cargar la página
  useEffect(() => {
    if (typeof window !== 'undefined') {
      refreshUser().finally(() => {
        // Si no se pudo obtener el usuario, establecer como no autenticado
        if (status === 'loading') {
          setStatus('unauthenticated')
        }
      })
    } else {
      setStatus('unauthenticated')
    }
  }, [])

  const value: AuthContextType = {
    user,
    status,
    token,
    isAuthenticated: status === 'authenticated',
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}