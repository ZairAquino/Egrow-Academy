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
              <button
                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Todos los Cursos ({stats.total})
              </button>
              <button
                className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                En Progreso ({stats.pending})
              </button>
              <button
                className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                Completados ({stats.completed})
              </button>
              <button
                className={`tab ${activeTab === 'certificates' ? 'active' : ''}`}
                onClick={() => setActiveTab('certificates')}
              >
                Certificaciones ({stats.certificates})
              </button>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="section">
          <div className="container">
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
                  className="btn btn-primary"
                >
                  Reintentar
                </button>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="empty-container">
                <div className="empty-icon">📚</div>
                <h3>No hay cursos para mostrar</h3>
                <p>
                  {activeTab === 'all' && 'Aún no te has inscrito en ningún curso.'}
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
                  <CourseCard key={userCourse.id} userCourse={userCourse} />
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>

      <style jsx>{`
        .main-content {
          min-height: 100vh;
          background: #f8fafc;
        }

        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 0;
          text-align: center;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .hero-description {
          font-size: 1.25rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .section {
          padding: 3rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .stat-label {
          color: #6b7280;
          margin: 0;
        }

        .tabs-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .tab {
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab:hover {
          color: #3b82f6;
        }

        .tab.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
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
    if (isCompleted) {
      if (course.hasCertificate) {
        return (
          <Link 
            href={course.certificateUrl || `/certificate/${course.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              minWidth: '120px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🏆 Ver Certificado
          </Link>
        );
      }
      return (
        <Link 
          href={`/curso/${course.id}`} 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            minWidth: '120px',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4b5563';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6b7280';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🔄 Repasar Curso
        </Link>
      );
    }

    if (isInProgress) {
      return (
        <Link 
          href={`/curso/${course.id}`} 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            minWidth: '120px',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ▶️ Continuar
        </Link>
      );
    }

    return (
      <Link 
        href={`/curso/${course.id}`} 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '8px',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          minWidth: '120px',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#3b82f6';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        🚀 Comenzar
      </Link>
    );
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: '#dcfce7',
          color: '#166534'
        }}>
          ✅ Completado
        </span>
      );
    }
    if (isInProgress) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: '#fef3c7',
          color: '#92400e'
        }}>
          ⏳ En Progreso
        </span>
      );
    }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: '#dbeafe',
        color: '#1e40af'
      }}>
        📚 Inscrito
      </span>
    );
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }}
    >
      <div style={{
        position: 'relative',
        height: '200px',
        overflow: 'hidden'
      }}>
        <img 
          src={course.image} 
          alt={course.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px'
        }}>
          {getStatusBadge()}
        </div>
      </div>
      
      <div style={{
        padding: '24px'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1f2937',
          margin: '0 0 8px 0',
          lineHeight: '1.4'
        }}>
          {course.title}
        </h3>
        
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.5',
          margin: '0 0 16px 0'
        }}>
          {course.description}
        </p>
        
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            <span>⏱️</span>
            {course.duration}
          </span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            <span>📊</span>
            {course.level}
          </span>
        </div>

        {isInProgress && (
          <div style={{
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#6b7280',
              marginBottom: '4px'
            }}>
              <span>Progreso</span>
              <span>{Math.round(userCourse.progressPercentage)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div 
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                  width: `${userCourse.progressPercentage}%`
                }}
              ></div>
            </div>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {getActionButton()}
          
          {isCompleted && course.hasCertificate && (
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '120px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            >
              📥 Descargar PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 