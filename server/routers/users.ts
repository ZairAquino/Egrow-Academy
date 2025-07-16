import { z } from 'zod'
import { router, publicProcedure } from '../../lib/trpc'

// Tipos para los usuarios
interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'instructor'
  enrolledCourses: string[]
  createdCourses: string[]
  createdAt: Date
}

// Simulación de base de datos de usuarios
let users: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'student',
    enrolledCourses: ['1', '2'],
    createdCourses: [],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    role: 'instructor',
    enrolledCourses: [],
    createdCourses: ['1', '3'],
    createdAt: new Date('2024-01-10')
  }
]

export const usersRouter = router({
  // Obtener todos los usuarios
  getAll: publicProcedure.query(() => {
    return users
  }),

  // Obtener usuario por ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const user = users.find(u => u.id === input.id)
      if (!user) throw new Error('Usuario no encontrado')
      return user
    }),

  // Crear nuevo usuario
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      role: z.enum(['student', 'instructor']),
      password: z.string().min(6)
    }))
    .mutation(({ input }) => {
      const existingUser = users.find(u => u.email === input.email)
      if (existingUser) throw new Error('El email ya está registrado')

      const newUser = {
        id: Date.now().toString(),
        name: input.name,
        email: input.email,
        role: input.role,
        enrolledCourses: [],
        createdCourses: [],
        createdAt: new Date()
      }
      
      users.push(newUser)
      return { ...newUser, password: undefined }
    }),

  // Actualizar usuario
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      role: z.enum(['student', 'instructor']).optional()
    }))
    .mutation(({ input }) => {
      const index = users.findIndex(u => u.id === input.id)
      if (index === -1) throw new Error('Usuario no encontrado')
      
      users[index] = { ...users[index], ...input }
      return users[index]
    }),

  // Inscribir usuario a un curso
  enrollInCourse: publicProcedure
    .input(z.object({
      userId: z.string(),
      courseId: z.string()
    }))
    .mutation(({ input }) => {
      const user = users.find(u => u.id === input.userId)
      if (!user) throw new Error('Usuario no encontrado')
      
      if (!user.enrolledCourses.includes(input.courseId)) {
        user.enrolledCourses.push(input.courseId)
      }
      
      return user
    }),

  // Obtener cursos inscritos del usuario
  getEnrolledCourses: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      const user = users.find(u => u.id === input.userId)
      if (!user) throw new Error('Usuario no encontrado')
      
      return user.enrolledCourses
    }),

  // Obtener estadísticas de usuarios
  getStats: publicProcedure.query(() => {
    return {
      total: users.length,
      students: users.filter(u => u.role === 'student').length,
      instructors: users.filter(u => u.role === 'instructor').length,
      averageEnrollments: users.reduce((sum, u) => sum + u.enrolledCourses.length, 0) / users.length
    }
  })
}) 