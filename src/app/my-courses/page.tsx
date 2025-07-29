'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  durationHours: number;
  difficulty: string;
  progress: number;
  status: 'enrolled' | 'in_progress' | 'completed';
  lastAccessed?: Date;
  completedAt?: Date;
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
      console.log('🔍 [MY-COURSES] Estado actual:', { status, hasUser: !!user });
      
      if (status !== 'authenticated' || !user) {
        console.log('❌ [MY-COURSES] No se puede cargar - status:', status, 'user:', !!user);
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 [MY-COURSES] Cargando cursos...');
        
        const response = await fetch('/api/courses/user-courses', {
          credentials: 'include' // Incluir cookies automáticamente
        });

        console.log('🔍 [MY-COURSES] Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ [MY-COURSES] Cursos cargados:', data.courses?.length || 0);
          setCourses(data.courses || []);
        } else {
          const errorText = await response.text();
          console.error('❌ [MY-COURSES] Error response:', errorText);
          setError('Error al cargar los cursos');
        }
      } catch (error) {
        console.error('❌ [MY-COURSES] Error loading courses:', error);
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
      <Navbar onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''} pt-16`}>
        {/* Hero Section */}
        <section className="hero gradient-bg">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Mis Cursos
                <span className="block">Dashboard de Aprendizaje</span>
              </h1>
              <p className="hero-description">
                Gestiona tu progreso y continúa donde lo dejaste en tu aprendizaje de IA.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.total}</div>
                  <div className="stat-label">Total Cursos</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.pending}</div>
                  <div className="stat-label">En Progreso</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.completed}</div>
                  <div className="stat-label">Completados</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="section">
          <div className="container">
            <div className="filters-container">
              <button
                className={`filter-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <span className="filter-icon">📚</span>
                Todos ({stats.total})
              </button>
              <button
                className={`filter-btn ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                <span className="filter-icon">⏳</span>
                En Progreso ({stats.pending})
              </button>
              <button
                className={`filter-btn ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                <span className="filter-icon">✅</span>
                Completados ({stats.completed})
              </button>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="section">
          <div className="container">
            {isLoading ? (
              <div className="loading-container">
                <LoadingSpinner />
                <p>Cargando tus cursos...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <div className="error-message">{error}</div>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  Reintentar
                </button>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="empty-container">
                <div className="empty-icon">📚</div>
                <h3>No tienes cursos inscritos</h3>
                <p>Explora nuestros cursos y comienza tu aprendizaje</p>
                <Link href="/courses" className="btn btn-primary">
                  Ver Cursos
                </Link>
              </div>
            ) : (
              <div className="courses-grid">
                {filteredCourses.map((userCourse) => (
                  <CourseCard key={userCourse.id} userCourse={userCourse} />
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>

      <style jsx>{`
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading-container,
        .error-container,
        .empty-container {
          text-align: center;
          padding: 4rem 0;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .error-message {
          color: #dc2626;
          margin-bottom: 1rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }
      `}</style>
    </>
  );
}

function CourseCard({ userCourse }: { userCourse: UserCourse }) {
  const { course } = userCourse;
  const isCompleted = userCourse.status === 'COMPLETED' || userCourse.progressPercentage === 100;
  const isInProgress = userCourse.status === 'ACTIVE' && userCourse.progressPercentage > 0;

  const getActionButton = () => {
        return (
          <Link 
        href={`/curso/${course.slug}`} 
        className="course-action-btn continue-btn"
          >
        ▶️ Continuar Curso
          </Link>
        );
  };


  const getStatusBadge = () => {
    if (isCompleted) {
      return <span className="status-badge completed">✅ Completado</span>;
    }
    if (isInProgress) {
      return <span className="status-badge progress">⏳ En Progreso</span>;
    }
    return <span className="status-badge enrolled">📚 Inscrito</span>;
  };

  return (
    <div className="course-card">
      <div className="course-image">
          <img 
          src={course.imageUrl || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center&q=85'} 
            alt={course.title}
            onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center&q=85';
            }}
          />
          <div className="status-badge-wrapper">
            {getStatusBadge()}
        </div>
      </div>
      
              <div className="course-content">
          <h3 className="course-title">
          {course.title}
        </h3>
        
          <p className="course-description">
          {course.description}
        </p>
        
          {/* Información adicional para cursos completados */}
          {isCompleted && (
            <div className="course-completion-info">
              <div className="completion-badge">
                <span className="completion-icon">✅</span>
                <span className="completion-text">Curso Completado</span>
              </div>
            </div>
          )}
          
          <div className="course-meta">
            <span className="meta-item">
            <span className="meta-icon">⏱️</span>
            {course.durationHours ? `${course.durationHours} horas` : '2 horas'}
          </span>
            <span className="meta-item">
            <span className="meta-icon">📊</span>
            {course.difficulty || 'Principiante'}
          </span>
        </div>

        {isInProgress && (
            <div className="progress-section">
              <div className="progress-header">
              <span>Progreso</span>
              <span>{Math.round(userCourse.progressPercentage)}%</span>
            </div>
              <div className="progress-bar">
              <div 
                  className="progress-fill"
                style={{ width: `${userCourse.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

          <div className="course-actions">
          {getActionButton()}
        </div>
      </div>

      <style jsx>{`
        .course-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }

        .course-image {
          position: relative;
          height: 160px;
          overflow: hidden;
        }

        .course-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .course-card:hover .course-image img {
          transform: scale(1.05);
        }

        .status-badge-wrapper {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          backdrop-filter: blur(8px);
        }

        .status-badge.completed {
          background: rgba(34, 197, 94, 0.9);
          color: white;
        }

        .status-badge.progress {
          background: rgba(59, 130, 246, 0.9);
          color: white;
        }

        .status-badge.enrolled {
          background: rgba(107, 114, 128, 0.9);
          color: white;
        }

        .course-content {
          padding: 1.25rem;
        }

        .course-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }

        .course-description {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0 0 1rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }

        .meta-icon {
          font-size: 0.875rem;
        }

        .progress-section {
          margin-bottom: 1rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: #f3f4f6;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 2px;
          transition: width 0.6s ease;
        }

        .course-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .course-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          min-width: 140px;
          text-align: center;
        }

        .continue-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          border: none;
          position: relative;
          overflow: hidden;
          font-weight: 600;
          letter-spacing: 0.025em;
          transition: all 0.3s ease;
        }

        .continue-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .continue-btn:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .continue-btn:hover::before {
          left: 100%;
        }

        .continue-btn:active {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.5);
        }

        .review-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
        }

        .review-btn:hover {
          background: linear-gradient(135deg, #d97706, #b45309);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }


        .course-completion-info {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border-radius: 8px;
          border-left: 4px solid #10b981;
        }

        .completion-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .completion-icon {
          font-size: 1rem;
        }

        .completion-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: #10b981;
        }
      `}</style>
    </div>
  );
} 