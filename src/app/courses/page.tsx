import { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CoursesContent from '@/components/CoursesContent';

export default function CoursesPage() {
  console.log('📚 Estás en la página de cursos - Hero V2 NO se renderiza aquí');
  console.log('🏠 Para ver Hero V2, ve a: http://localhost:3000/');
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CoursesContent />
    </Suspense>
  );
}