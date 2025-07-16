import CoursesList from '../components/CoursesList'
import Head from 'next/head'

export default function CoursesPage() {
  return (
    <>
      <Head>
        <title>Cursos - eGrow Academy</title>
        <meta name="description" content="Explora todos nuestros cursos disponibles" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-4">Gestión de Cursos</h1>
            <p className="text-xl opacity-90">
              Administra y visualiza todos los cursos de eGrow Academy usando tRPC
            </p>
          </div>
        </div>
        
        <CoursesList />
      </div>
    </>
  )
} 