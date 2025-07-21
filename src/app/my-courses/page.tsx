'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import UserProfile from '@/components/auth/UserProfile';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  progress: number;
  status: 'enrolled' | 'in_progress' | 'completed';
  lastAccessed?: Date;
  completedAt?: Date;
  hasCertificate?: boolean;
  certificateUrl?: string;
}

interface UserCourse {
  id: string;
  courseId: string;
  course: Course;
  enrolledAt: Date;
  completedAt?: Date;
  progressPercentage: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export default function MyCoursesPage() {
  const { user, status } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [courses, setCourses] = useState<UserCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Cargar cursos del usuario
  useEffect(() => {
    const loadUserCourses = async () => {
      if (status !== 'authenticated' || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/courses/user-courses', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses || []);
        } else {
          setError('Error al cargar los cursos');
        }
      } catch (error) {
        console.error('Error loading courses:', error);
        setError('Error de conexión');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserCourses();
  }, [user, status]);

  // Filtrar cursos según la pestaña activa
  const getFilteredCourses = () => {
    switch (activeTab) {
      case 'pending':
        return courses.filter(course => 
          course.status === 'ACTIVE' && course.progressPercentage < 100
        );
      case 'completed':
        return courses.filter(course => 
          course.status === 'COMPLETED' || course.progressPercentage === 100
        );
      case 'certificates':
        return courses.filter(course => 
          (course.status === 'COMPLETED' || course.progressPercentage === 100) &&
          course.course.hasCertificate
        );
      default:
        return courses;
    }
  };

  const filteredCourses = getFilteredCourses();

  // Obtener estadísticas
  const stats = {
    total: courses.length,
    pending: courses.filter(c => c.status === 'ACTIVE' && c.progressPercentage < 100).length,
    completed: courses.filter(c => c.status === 'COMPLETED' || c.progressPercentage === 100).length,
    certificates: courses.filter(c => 
      (c.status === 'COMPLETED' || c.progressPercentage === 100) && 
      c.course.hasCertificate
    ).length
  };

  // Redirigir si no está autenticado
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Requerido</h1>
          <p className="mb-4">Necesitas iniciar sesión para ver tus cursos.</p>
          <Link href="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <UserProfile className="user-profile-top-right" />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Hero Section */}
        <section className="hero gradient-bg">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Mis Cursos
                <span className="block">Dashboard de Aprendizaje</span>
              </h1>
              <p className="hero-description">
                Gestiona tu progreso, continúa donde lo dejaste y obtén tus certificaciones.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.total}</h3>
                  <p className="stat-label">Total Cursos</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.pending}</h3>
                  <p className="stat-label">En Progreso</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.completed}</h3>
                  <p className="stat-label">Completados</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.certificates}</h3>
                  <p className="stat-label">Certificaciones</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="section">
          <div className="container">
            <div className="tabs-container">
              <div className="tabs">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                >
                  Todos los Cursos ({stats.total})
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                >
                  En Progreso ({stats.pending})
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                >
                  Completados ({stats.completed})
                </button>
                <button
                  onClick={() => setActiveTab('certificates')}
                  className={`tab ${activeTab === 'certificates' ? 'active' : ''}`}
                >
                  Certificaciones ({stats.certificates})
                </button>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="courses-section">
              {isLoading ? (
                <div className="loading-container">
                  <LoadingSpinner />
                  <p>Cargando tus cursos...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p className="error-message">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="btn btn-secondary"
                  >
                    Reintentar
                  </button>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📚</div>
                  <h3>No hay cursos en esta categoría</h3>
                  <p>
                    {activeTab === 'all' && 'Aún no te has inscrito a ningún curso.'}
                    {activeTab === 'pending' && 'No tienes cursos en progreso.'}
                    {activeTab === 'completed' && 'No has completado ningún curso aún.'}
                    {activeTab === 'certificates' && 'No tienes certificaciones disponibles.'}
                  </p>
                  <Link href="/courses" className="btn btn-primary">
                    Explorar Cursos
                  </Link>
                </div>
              ) : (
                <div className="courses-grid">
                  {filteredCourses.map((userCourse) => (
                    <CourseCard
                      key={userCourse.id}
                      userCourse={userCourse}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 12px;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }

        .stat-label {
          color: #6b7280;
          margin: 0;
          font-size: 0.875rem;
        }

        .tabs-container {
          margin-bottom: 2rem;
        }

        .tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
          overflow-x: auto;
        }

        .tab {
          padding: 0.75rem 1.5rem;
          border: none;
          background: none;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .tab:hover {
          color: #374151;
        }

        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .loading-container,
        .error-container,
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .error-message {
          color: #dc2626;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .tabs {
            flex-wrap: wrap;
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

// Componente de tarjeta de curso
function CourseCard({ userCourse }: { userCourse: UserCourse }) {
  const { course } = userCourse;
  const isCompleted = userCourse.status === 'COMPLETED' || userCourse.progressPercentage === 100;
  const isInProgress = userCourse.status === 'ACTIVE' && userCourse.progressPercentage > 0;

  const getActionButton = () => {
    if (isCompleted) {
      if (course.hasCertificate) {
        return (
          <Link 
            href={course.certificateUrl || `/certificate/${course.id}`}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            🏆 Ver Certificado
          </Link>
        );
      }
      return (
        <Link 
          href={`/curso/${course.id}`} 
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          🔄 Repasar Curso
        </Link>
      );
    }

    if (isInProgress) {
      return (
        <Link 
          href={`/curso/${course.id}`} 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          ▶️ Continuar
        </Link>
      );
    }

    return (
      <Link 
        href={`/curso/${course.id}`} 
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        🚀 Comenzar
      </Link>
    );
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✅ Completado
        </span>
      );
    }
    if (isInProgress) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          ⏳ En Progreso
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        📚 Inscrito
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4">
          {course.description}
        </p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <span>⏱️</span>
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <span>📊</span>
            {course.level}
          </span>
        </div>

        {isInProgress && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progreso</span>
              <span>{Math.round(userCourse.progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${userCourse.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {getActionButton()}
          
          {isCompleted && course.hasCertificate && (
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
              📥 Descargar PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 