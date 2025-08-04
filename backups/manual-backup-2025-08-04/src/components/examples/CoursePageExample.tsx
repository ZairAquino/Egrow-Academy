'use client';

import BreadcrumbsSEO from '@/components/seo/BreadcrumbsSEO';
import { breadcrumbUtils } from '@/lib/breadcrumbs-config';

// Ejemplo de página de curso con breadcrumbs SEO
export default function CoursePageExample({ course }: { course: any }) {
  // Generar breadcrumbs específicos para el curso
  const breadcrumbs = breadcrumbUtils.getCourseBreadcrumbs(
    course.slug,
    course.title
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs SEO */}
      <div className="container mx-auto px-4 py-6">
        <BreadcrumbsSEO 
          items={breadcrumbs}
          currentPageTitle={course.title}
        />
      </div>

      {/* Contenido de la página */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {course.title}
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              {course.description}
            </p>
            
            {/* Información del curso */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Duración</h3>
                <p className="text-blue-700">{course.duration}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Nivel</h3>
                <p className="text-green-700">{course.level}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Precio</h3>
                <p className="text-purple-700">${course.price} MXN</p>
              </div>
            </div>
            
            {/* Contenido del curso */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Lo que aprenderás
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {course.learningObjectives?.map((objective: string, index: number) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Ejemplo de página de categoría
export function CategoryPageExample({ category }: { category: any }) {
  const breadcrumbs = breadcrumbUtils.getCategoryBreadcrumbs(
    category.slug,
    category.name
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <BreadcrumbsSEO 
          items={breadcrumbs}
          currentPageTitle={category.name}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Cursos de {category.name}
        </h1>
        
        {/* Lista de cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.courses?.map((course: any) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-semibold">
                  ${course.price} MXN
                </span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Ver Curso
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Ejemplo de página de instructor
export function InstructorPageExample({ instructor }: { instructor: any }) {
  const breadcrumbs = breadcrumbUtils.getInstructorBreadcrumbs(
    instructor.slug,
    instructor.name
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <BreadcrumbsSEO 
          items={breadcrumbs}
          currentPageTitle={instructor.name}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <img
              src={instructor.avatar}
              alt={instructor.name}
              className="w-20 h-20 rounded-full mr-6"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {instructor.name}
              </h1>
              <p className="text-lg text-gray-600">{instructor.title}</p>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">{instructor.bio}</p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cursos de este instructor
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {instructor.courses?.map((course: any) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {course.description}
                  </p>
                  <span className="text-blue-600 font-semibold">
                    ${course.price} MXN
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 