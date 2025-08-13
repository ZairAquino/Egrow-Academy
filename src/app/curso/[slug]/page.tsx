'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import CourseTemplateV1 from '@/components/course/templates/CourseTemplateV1';

interface CoursePage {
  params: Promise<{ slug: string }>;
}

export default function CoursePage({ params }: CoursePage) {
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const { user, status } = useAuth();
  const { hasPremiumAccess } = useSubscriptionStatus();
  const router = useRouter();

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const { slug } = await params;
        const response = await fetch(`/api/courses/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Curso no encontrado');
          } else {
            setError('Error al cargar el curso');
          }
          return;
        }

        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error loading course:', error);
        setError('Error al cargar el curso');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [params]);

  const goToCourseContent = async () => {
    if (status === 'loading') return;

    const { slug } = await params;
    
    if (!user || status === 'unauthenticated') {
      const loginUrl = `/login?redirect=/curso/${slug}/contenido`;
      window.location.href = loginUrl;
      return;
    }

    if (!hasPremiumAccess && !course?.isFree) {
      window.location.href = '/subscription';
      return;
    }

    window.location.href = `/curso/${slug}/contenido`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {error || 'Curso no encontrado'}
          </h1>
          <p className="text-gray-600 mb-8">
            El curso que buscas no existe o ha sido removido.
          </p>
          <button
            onClick={() => router.push('/courses')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Ver todos los cursos
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CourseTemplateV1 course={course} onPrimaryAction={goToCourseContent} />
      <Footer />
    </div>
  );
}