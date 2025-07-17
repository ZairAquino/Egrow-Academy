'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider 
      refetchInterval={0} // No refetch automático
      refetchOnWindowFocus={true} // Refetch cuando la ventana recupera el foco
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  )
} 