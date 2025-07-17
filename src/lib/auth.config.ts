import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Agregar el ID del usuario a la sesión
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Verificar si el usuario ya existe en nuestra base de datos
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (!existingUser) {
          // Crear nuevo usuario con datos de Google
          await prisma.user.create({
            data: {
              email: user.email!,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
              emailVerified: true, // Google ya verificó el email
              isActive: true,
              // No necesitamos passwordHash para usuarios OAuth
              passwordHash: '', // Campo requerido pero no usado para OAuth
            }
          })
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  session: {
    strategy: "jwt"
  }
}) 