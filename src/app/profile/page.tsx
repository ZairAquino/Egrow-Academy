'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import UserProfile from '@/components/auth/UserProfile';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

interface ProfileFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  profileImage: string;
  timezone: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    courseUpdates: boolean;
    newCourses: boolean;
    achievements: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showProgress: boolean;
    showCertificates: boolean;
    allowMessages: boolean;
  };
}

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
    timezone: 'America/Mexico_City',
    language: 'es',
    notifications: {
      email: true,
      push: true,
      courseUpdates: true,
      newCourses: true,
      achievements: true,
    },
    privacy: {
      profileVisibility: 'public',
      showProgress: true,
      showCertificates: true,
      allowMessages: true,
    },
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('notifications.')) {
        const notificationKey = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            [notificationKey]: checked
          }
        }));
      } else if (name.startsWith('privacy.')) {
        const privacyKey = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          privacy: {
            ...prev.privacy,
            [privacyKey]: checked
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Simular actualización - en el futuro esto será una API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('✅ Perfil actualizado exitosamente');
    } catch (error) {
      setMessage('❌ Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', name: 'Información Personal', icon: '👤' },
    { id: 'preferences', name: 'Preferencias', icon: '⚙️' },
    { id: 'notifications', name: 'Notificaciones', icon: '🔔' },
    { id: 'privacy', name: 'Privacidad', icon: '🔒' },
    { id: 'security', name: 'Seguridad', icon: '🛡️' }
  ];

  const timezones = [
    { value: 'America/Mexico_City', label: 'México (GMT-6)' },
    { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
    { value: 'America/Los_Angeles', label: 'Los Ángeles (GMT-8)' },
    { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
    { value: 'America/Buenos_Aires', label: 'Buenos Aires (GMT-3)' }
  ];

  const languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' }
  ];

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
                Mi Perfil
                <span className="block">y Configuración</span>
              </h1>
              <p className="hero-description">
                Personaliza tu experiencia y gestiona tu información
              </p>
            </div>
          </div>
        </section>

        {/* Companies Marquee */}
        <Suspense fallback={<LoadingSpinner />}>
          <CompaniesMarquee />
        </Suspense>

        {/* Profile Section */}
        <section className="section">
          <div className="container">
            <div className="profile-layout">
              {/* Tabs */}
              <div className="profile-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-name">{tab.name}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="profile-content">
                <form onSubmit={handleSubmit} className="profile-form">
                  {/* Información Personal */}
                  {activeTab === 'personal' && (
                    <div className="tab-content">
                      <h2 className="tab-title">Información Personal</h2>
                      
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="firstName">Nombre *</label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="lastName">Apellido *</label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="username">Nombre de Usuario *</label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="email">Email *</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            disabled
                          />
                          <small>El email no se puede cambiar por seguridad</small>
                        </div>

                        <div className="form-group full-width">
                          <label htmlFor="bio">Biografía</label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Cuéntanos sobre ti..."
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="profileImage">URL de Imagen de Perfil</label>
                          <input
                            type="url"
                            id="profileImage"
                            name="profileImage"
                            value={formData.profileImage}
                            onChange={handleInputChange}
                            placeholder="https://ejemplo.com/imagen.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferencias */}
                  {activeTab === 'preferences' && (
                    <div className="tab-content">
                      <h2 className="tab-title">Preferencias</h2>
                      
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="timezone">Zona Horaria</label>
                          <select
                            id="timezone"
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleInputChange}
                          >
                            {timezones.map(tz => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label htmlFor="language">Idioma</label>
                          <select
                            id="language"
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                          >
                            {languages.map(lang => (
                              <option key={lang.value} value={lang.value}>
                                {lang.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notificaciones */}
                  {activeTab === 'notifications' && (
                    <div className="tab-content">
                      <h2 className="tab-title">Configuración de Notificaciones</h2>
                      
                      <div className="notifications-grid">
                        <div className="notification-item">
                          <div className="notification-info">
                            <h3>Notificaciones por Email</h3>
                            <p>Recibe actualizaciones importantes por correo electrónico</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              name="notifications.email"
                              checked={formData.notifications.email}
                              onChange={handleInputChange}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="notification-item">
                          <div className="notification-info">
                            <h3>Notificaciones Push</h3>
                            <p>Recibe notificaciones en tiempo real en tu navegador</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              name="notifications.push"
                              checked={formData.notifications.push}
                              onChange={handleInputChange}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="notification-item">
                          <div className="notification-info">
                            <h3>Actualizaciones de Cursos</h3>
                            <p>Notificaciones sobre nuevos contenidos en tus cursos</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              name="notifications.courseUpdates"
                              checked={formData.notifications.courseUpdates}
                              onChange={handleInputChange}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="notification-item">
                          <div className="notification-info">
                            <h3>Nuevos Cursos</h3>
                            <p>Información sobre nuevos cursos disponibles</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              name="notifications.newCourses"
                              checked={formData.notifications.newCourses}
                              onChange={handleInputChange}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="notification-item">
                          <div className="notification-info">
                            <h3>Logros y Certificaciones</h3>
                            <p>Celebra tus logros y certificaciones obtenidas</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              name="notifications.achievements"
                              checked={formData.notifications.achievements}
                              onChange={handleInputChange}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Privacidad */}
                  {activeTab === 'privacy' && (
                    <div className="tab-content">
                      <h2 className="tab-title">Configuración de Privacidad</h2>
                      
                      <div className="privacy-grid">
                        <div className="privacy-item">
                          <div className="privacy-info">
                            <h3>Mostrar Progreso</h3>
                            <p>Permite que otros vean tu progreso en los cursos</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              name="privacy.showProgress"
                              checked={formData.privacy.showProgress}
                              onChange={handleInputChange}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="privacy-item">
                          <div className="privacy-info">
                            <h3>Mostrar Certificaciones</h3>
                            <p>Permite que otros vean tus certificaciones</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              name="privacy.showCertificates"
                              checked={formData.privacy.showCertificates}
                              onChange={handleInputChange}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="privacy-item">
                          <div className="privacy-info">
                            <h3>Permitir Mensajes</h3>
                            <p>Permite que otros usuarios te envíen mensajes</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              name="privacy.allowMessages"
                              checked={formData.privacy.allowMessages}
                              onChange={handleInputChange}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Seguridad */}
                  {activeTab === 'security' && (
                    <div className="tab-content">
                      <h2 className="tab-title">Seguridad de la Cuenta</h2>
                      
                      <div className="security-grid">
                        <div className="security-item">
                          <div className="security-info">
                            <h3>Cambiar Contraseña</h3>
                            <p>Actualiza tu contraseña para mayor seguridad</p>
                          </div>
                          <button type="button" className="btn btn-secondary">
                            Cambiar Contraseña
                          </button>
                        </div>

                        <div className="security-item">
                          <div className="security-info">
                            <h3>Autenticación de Dos Factores</h3>
                            <p>Añade una capa extra de seguridad a tu cuenta</p>
                          </div>
                          <button type="button" className="btn btn-secondary">
                            Configurar 2FA
                          </button>
                        </div>

                        <div className="security-item">
                          <div className="security-info">
                            <h3>Sesión Activa</h3>
                            <p>Gestiona las sesiones activas en tu cuenta</p>
                          </div>
                          <button type="button" className="btn btn-secondary">
                            Ver Sesiones
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  {message && (
                    <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                      {message}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 