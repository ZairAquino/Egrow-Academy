import { router } from '../../lib/trpc'
import { coursesRouter } from './courses'
import { usersRouter } from './users'

export const appRouter = router({
  courses: coursesRouter,
  users: usersRouter,
})

export type AppRouter = typeof appRouter 