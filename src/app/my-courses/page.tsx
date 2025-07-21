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
            className="course-btn course-btn-success"
          >
            🏆 Ver Certificado
          </Link>
        );
      }
      return (
        <Link 
          href={`/curso/${course.id}`} 
          className="course-btn course-btn-secondary"
        >
          🔄 Repasar Curso
        </Link>
      );
    }

    if (isInProgress) {
      return (
        <Link 
          href={`/curso/${course.id}`} 
          className="course-btn course-btn-primary"
        >
          ▶️ Continuar
        </Link>
      );
    }

    return (
      <Link 
        href={`/curso/${course.id}`} 
        className="course-btn course-btn-primary"
      >
        🚀 Comenzar
      </Link>
    );
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="status-badge status-badge-completed">
          ✅ Completado
        </span>
      );
    }
    if (isInProgress) {
      return (
        <span className="status-badge status-badge-progress">
          ⏳ En Progreso
        </span>
      );
    }
    return (
      <span className="status-badge status-badge-enrolled">
        📚 Inscrito
      </span>
    );
  };

  return (
    <div className="course-card">
      <div className="course-image-container">
        <img 
          src={course.image} 
          alt={course.title}
          className="course-image"
        />
        <div className="course-status-badge">
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
        
        <div className="course-meta">
          <span className="meta-item">
            <span>⏱️</span>
            {course.duration}
          </span>
          <span className="meta-item">
            <span>📊</span>
            {course.level}
          </span>
        </div>

        {isInProgress && (
          <div className="progress-container">
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
          
          {isCompleted && course.hasCertificate && (
            <button className="course-btn course-btn-outline">
              📥 Descargar PDF
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .course-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .course-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .course-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .course-status-badge {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge-completed {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge-progress {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge-enrolled {
          background: #dbeafe;
          color: #1e40af;
        }

        .course-content {
          padding: 24px;
        }

        .course-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .course-description {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
          margin: 0 0 16px 0;
        }

        .course-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #6b7280;
        }

        .progress-container {
          margin-bottom: 16px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .course-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .course-btn {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 120px;
          justify-content: center;
        }

        .course-btn-primary {
          background: #3b82f6;
          color: white;
        }

        .course-btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .course-btn-secondary {
          background: #6b7280;
          color: white;
        }

        .course-btn-secondary:hover {
          background: #4b5563;
          transform: translateY(-1px);
        }

        .course-btn-success {
          background: #10b981;
          color: white;
        }

        .course-btn-success:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .course-btn-outline {
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .course-btn-outline:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
      `}</style>
    </div>
  );
} 