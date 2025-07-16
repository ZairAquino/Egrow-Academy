'use client'

import { trpc } from '../../lib/trpc-client'
import { useState } from 'react'

export default function CoursesList() {
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: 0,
    duration: '',
    level: 'Principiante',
    category: ''
  })

  // Usar tRPC para obtener cursos
  const { data: courses, isLoading, error } = trpc.courses.getAll.useQuery()
  
  // Usar tRPC para crear cursos
  const createCourseMutation = trpc.courses.create.useMutation({
    onSuccess: () => {
      // Refrescar la lista de cursos
      window.location.reload()
    }
  })

  // Usar tRPC para obtener estadísticas
  const { data: stats } = trpc.courses.getStats.useQuery()

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault()
    createCourseMutation.mutate(newCourse)
    setNewCourse({
      title: '',
      description: '',
      price: 0,
      duration: '',
      level: 'Principiante',
      category: ''
    })
  }

  if (isLoading) return <div className="text-center py-8">Cargando cursos...</div>
  if (error) return <div className="text-red-500">Error: {error.message}</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Estadísticas */}
      {stats && (
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Estadísticas de Cursos</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-gray-600">Total de Cursos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.categories.length}</div>
              <div className="text-gray-600">Categorías</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">${stats.averagePrice.toFixed(0)}</div>
              <div className="text-gray-600">Precio Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.levels.length}</div>
              <div className="text-gray-600">Niveles</div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario para crear curso */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Crear Nuevo Curso</h2>
        <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Título del curso"
            value={newCourse.title}
            onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Categoría"
            value={newCourse.category}
            onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <textarea
            placeholder="Descripción"
            value={newCourse.description}
            onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
            className="p-2 border rounded md:col-span-2"
            rows={3}
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={newCourse.price}
            onChange={(e) => setNewCourse({...newCourse, price: Number(e.target.value)})}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Duración (ej: 12 semanas)"
            value={newCourse.duration}
            onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <select
            value={newCourse.level}
            onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
            className="p-2 border rounded"
            required
          >
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
          <button
            type="submit"
            disabled={createCourseMutation.isPending}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {createCourseMutation.isPending ? 'Creando...' : 'Crear Curso'}
          </button>
        </form>
      </div>

      {/* Lista de cursos */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Cursos Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <div key={course.id} className="bg-white border rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Imagen del curso</span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    ${course.price}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{course.duration}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    {course.level}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                    {course.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 