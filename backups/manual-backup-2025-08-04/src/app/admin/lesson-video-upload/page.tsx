'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

import UserProfile from '@/components/auth/UserProfile';
import LessonVideoUpload from '@/components/courses/LessonVideoUpload';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, Upload, ArrowLeft } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  order: number;
  courseId: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  lessons: Lesson[];
}

export default function LessonVideoUploadPage() {
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, token } = useAuth();
  const router = useRouter();

  // Verificar si el usuario es instructor
  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    // Aquí podrías verificar si el usuario es instructor
    // Por ahora, asumimos que todos los usuarios autenticados pueden acceder
    fetchCourses();
  }, [user, token, router]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simular datos de cursos (en producción, esto vendría de la API)
      const mockCourses: Course[] = [
        {
          id: 'desarrollo-web-fullstack',
          title: 'Desarrollo Web Full Stack con React y Node.js',
          slug: 'desarrollo-web-fullstack',
          lessons: [
            {
              id: 'lesson-1',
              title: 'Introducción al Desarrollo Full Stack',
              order: 1,
              courseId: 'desarrollo-web-fullstack',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
            {
              id: 'lesson-2',
              title: 'Configuración del Entorno de Desarrollo',
              order: 2,
              courseId: 'desarrollo-web-fullstack',
              videoUrl: 'https://www.youtube.com/watch?v=8Xa2cPwKOPY'
            },
            {
              id: 'lesson-3',
              title: 'Fundamentos de React',
              order: 3,
              courseId: 'desarrollo-web-fullstack'
            },
            {
              id: 'lesson-4',
              title: 'Creando APIs con Node.js',
              order: 4,
              courseId: 'desarrollo-web-fullstack'
            },
            {
              id: 'lesson-5',
              title: 'Despliegue en la Nube',
              order: 5,
              courseId: 'desarrollo-web-fullstack'
            }
          ]
        },
        {
          id: 'introduccion-llms',
          title: 'Introducción a los LLMs',
          slug: 'introduccion-llms',
          lessons: [
            {
              id: 'llm-lesson-1',
              title: '¿Qué son los LLMs?',
              order: 1,
              courseId: 'introduccion-llms'
            },
            {
              id: 'llm-lesson-2',
              title: 'Aplicaciones Prácticas',
              order: 2,
              courseId: 'introduccion-llms'
            }
          ]
        }
      ];

      setCourses(mockCourses);
    } catch (err) {
      setError('Error al cargar los cursos');
      console.error('Error fetching courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setSelectedLesson(null);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleVideoUploaded = (videoUrl: string) => {
    if (selectedLesson) {
      // Actualizar la lección en el estado local
      const updatedLesson = { ...selectedLesson, videoUrl };
      setSelectedLesson(updatedLesson);
      
      // Actualizar en la lista de lecciones del curso
      if (selectedCourse) {
        const updatedLessons = selectedCourse.lessons.map(lesson =>
          lesson.id === selectedLesson.id ? updatedLesson : lesson
        );
        const updatedCourse = { ...selectedCourse, lessons: updatedLessons };
        setSelectedCourse(updatedCourse);
        
        // Actualizar en la lista de cursos
        setCourses(courses.map(course =>
          course.id === selectedCourse.id ? updatedCourse : course
        ));
      }
    }
  };

  const handleVideoRemoved = () => {
    if (selectedLesson) {
      const updatedLesson = { ...selectedLesson, videoUrl: undefined };
      setSelectedLesson(updatedLesson);
      
      if (selectedCourse) {
        const updatedLessons = selectedCourse.lessons.map(lesson =>
          lesson.id === selectedLesson.id ? updatedLesson : lesson
        );
        const updatedCourse = { ...selectedCourse, lessons: updatedLessons };
        setSelectedCourse(updatedCourse);
        
        setCourses(courses.map(course =>
          course.id === selectedCourse.id ? updatedCourse : course
        ));
      }
    }
  };

  

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <Button onClick={fetchCourses}>Reintentar</Button>
      </div>
    );
  }

  return (
    <>
      
      <UserProfile className="user-profile-fixed" />
      
      <main className="main-content pt-16">
        {/* Header */}
        <section className="admin-header">
          <div className="container">
            <div className="header-content">
              <div className="header-left">
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin')}
                  className="mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Panel
                </Button>
                <h1 className="page-title">
                  <Video className="w-6 h-6 mr-2" />
                  Gestión de Videos de Lecciones
                </h1>
                <p className="page-description">
                  Sube y gestiona videos para las lecciones de tus cursos
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="admin-content">
          <div className="container">
            <div className="content-layout">
              {/* Course Selection */}
              <div className="course-selection">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Seleccionar Curso
                  </h2>
                  
                  <div className="courses-grid">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className={`course-card ${selectedCourse?.id === course.id ? 'selected' : ''}`}
                        onClick={() => handleCourseSelect(course)}
                      >
                        <h3 className="course-title">{course.title}</h3>
                        <p className="course-lessons">
                          {course.lessons.length} lecciones
                        </p>
                        <div className="course-videos">
                          {course.lessons.filter(l => l.videoUrl).length} con videos
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Lesson Selection and Video Upload */}
              {selectedCourse && (
                <div className="lesson-management">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      <Upload className="w-5 h-5 mr-2" />
                      Gestionar Videos - {selectedCourse.title}
                    </h2>
                    
                    <div className="lessons-grid">
                      {selectedCourse.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`lesson-card ${selectedLesson?.id === lesson.id ? 'selected' : ''}`}
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          <div className="lesson-header">
                            <span className="lesson-number">{lesson.order}</span>
                            <h3 className="lesson-title">{lesson.title}</h3>
                          </div>
                          <div className="lesson-status">
                            {lesson.videoUrl ? (
                              <span className="status-video">✅ Con video</span>
                            ) : (
                              <span className="status-no-video">❌ Sin video</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Video Upload Area */}
                    {selectedLesson && (
                      <div className="video-upload-area mt-6">
                        <h3 className="text-lg font-medium mb-4">
                          Video para: {selectedLesson.title}
                        </h3>
                        <LessonVideoUpload
                          lessonId={selectedLesson.id}
                          currentVideoUrl={selectedLesson.videoUrl}
                          onVideoUploaded={handleVideoUploaded}
                          onVideoRemoved={handleVideoRemoved}
                        />
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .admin-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }

        .page-description {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .admin-content {
          padding: 2rem 0;
        }

        .content-layout {
          display: grid;
          gap: 2rem;
          grid-template-columns: 1fr;
        }

        @media (min-width: 1024px) {
          .content-layout {
            grid-template-columns: 1fr 2fr;
          }
        }

        .courses-grid {
          display: grid;
          gap: 1rem;
        }

        .course-card {
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .course-card:hover {
          border-color: #3b82f6;
          background-color: #f8fafc;
        }

        .course-card.selected {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }

        .course-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .course-lessons {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .course-videos {
          font-size: 0.875rem;
          color: #059669;
        }

        .lessons-grid {
          display: grid;
          gap: 0.75rem;
        }

        .lesson-card {
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .lesson-card:hover {
          border-color: #3b82f6;
          background-color: #f8fafc;
        }

        .lesson-card.selected {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }

        .lesson-header {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .lesson-number {
          background-color: #3b82f6;
          color: white;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          margin-right: 0.75rem;
        }

        .lesson-title {
          font-weight: 500;
          flex: 1;
        }

        .lesson-status {
          font-size: 0.875rem;
        }

        .status-video {
          color: #059669;
        }

        .status-no-video {
          color: #dc2626;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
        }

        .loading-spinner {
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          text-align: center;
        }

        .error-message {
          color: #dc2626;
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
} 