import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Permitir auto-vinculación de cuentas existentes con Google
      if (account?.provider === 'google' && profile?.email) {
        try {
          // Verificar si ya existe un usuario con este email
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
            include: { accounts: true }
          })

          if (existingUser) {
            // Si el usuario existe pero no tiene cuenta de Google vinculada
            const hasGoogleAccount = existingUser.accounts.some(
              acc => acc.provider === 'google'
            )
            
            if (!hasGoogleAccount) {
              // Vincular la cuenta de Google al usuario existente
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state as string,
                }
              })
              
              // Actualizar la imagen de perfil si viene de Google
              if (profile.picture && !existingUser.profileImage) {
                await prisma.user.update({
                  where: { id: existingUser.id },
                  data: { 
                    profileImage: profile.picture,
                    emailVerified: true // Google emails están verificados
                  }
                })
              }
            }
            
            // Actualizar último login
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { lastLogin: new Date() }
            })
            
            return true
          } else {
            // Si no existe el usuario, crear uno nuevo
            const newUser = await prisma.user.create({
              data: {
                email: profile.email,
                firstName: profile.given_name || profile.name?.split(' ')[0] || 'Usuario',
                lastName: profile.family_name || profile.name?.split(' ').slice(1).join(' ') || '',
                profileImage: profile.picture,
                emailVerified: true,
                lastLogin: new Date()
              }
            })
            
            // Crear la cuenta de Google
            await prisma.account.create({
              data: {
                userId: newUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state as string,
              }
            })
            
            return true
          }
        } catch (error) {
          console.error('Error en signIn callback:', error)
          return false
        }
      }
      
      return true
    },
    async jwt({ token, user }) {
      // Agregar el ID del usuario al token cuando se crea la sesión
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Agregar el ID del usuario a la sesión desde el token
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt"
  }
}) 