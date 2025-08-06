'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

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
  profileImage: string;
  notifications: {
    email: boolean;
    push: boolean;
    courseUpdates: boolean;
    newCourses: boolean;
    achievements: boolean;
  };
  privacy: {
    showProgress: boolean;
    showCertificates: boolean;
    allowMessages: boolean;
  };
  badgeCustomization: {
    preferredBadgeStyle: 'emoji' | 'text' | 'colorful';
    badgeColor: string;
    showBadgeInNavbar: boolean;
    preferredEmojis: {
      [key: string]: string;
    };
  };
}

export default function ProfilePage() {
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());
  const [originalData, setOriginalData] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Store original data for comparison
    if (user) {
      const original = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        profileImage: user.profileImage || ''
      };
      setOriginalData(original);
      console.log('📋 [PROFILE] Original data initialized:', original);
      
      // Update formData to match user data
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        profileImage: user.profileImage || ''
      }));
    }
  }, [user]);

  // Load user preferences on component mount
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user?.userPreferences) {
            const prefs = data.user.userPreferences;
            
            // Load notification preferences
            if (prefs.notificationPreferences) {
              setFormData(prev => ({
                ...prev,
                notifications: prefs.notificationPreferences
              }));
            }
            
            // Load privacy settings
            if (prefs.privacySettings) {
              setFormData(prev => ({
                ...prev,
                privacy: prefs.privacySettings
              }));
            }
            
            // Load badge customization
            if (prefs.badgeCustomization) {
              try {
                const badgeData = typeof prefs.badgeCustomization === 'string' 
                  ? JSON.parse(prefs.badgeCustomization) 
                  : prefs.badgeCustomization;
                setFormData(prev => ({
                  ...prev,
                  badgeCustomization: badgeData
                }));
              } catch (e) {
                console.error('Error parsing badge customization:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    };

    loadUserPreferences();
  }, []);

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    profileImage: user?.profileImage || '',
    notifications: {
      email: true,
      push: true,
      courseUpdates: true,
      newCourses: true,
      achievements: true,
    },
    privacy: {
      showProgress: true,
      showCertificates: true,
      allowMessages: true,
    },
    badgeCustomization: {
      preferredBadgeStyle: 'emoji',
      badgeColor: '#3b82f6',
      showBadgeInNavbar: true,
      preferredEmojis: {
        PRINCIPIANTE: '🌱',
        ESTUDIANTE: '📚',
        DEDICADO: '🎯',
        EN_LLAMAS: '🔥',
        IMPARABLE: '⚡',
        MAESTRO: '👑',
        LEYENDA: '🚀'
      },
    },
  });

  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage('❌ Formato de imagen no válido. Use JPG, PNG o WebP');
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setMessage('❌ La imagen es muy grande. Tamaño máximo: 2MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setFormData(prev => ({
        ...prev,
        profileImage: result // Use data URL temporarily
      }));
      // Mark profileImage as modified
      setModifiedFields(prev => new Set(prev).add('profileImage'));
    };
    reader.readAsDataURL(file);
    setMessage('');
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      profileImage: ''
    }));
    // Mark profileImage as modified
    setModifiedFields(prev => new Set(prev).add('profileImage'));
    // Clear file input
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
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
      } else if (name.startsWith('badgeCustomization.')) {
        const badgeKey = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          badgeCustomization: {
            ...prev.badgeCustomization,
            [badgeKey]: checked
          }
        }));
      }
    } else {
      // Manejar actualizaciones de emojis personalizados
      if (name.startsWith('emoji.')) {
        const level = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          badgeCustomization: {
            ...prev.badgeCustomization,
            preferredEmojis: {
              ...prev.badgeCustomization.preferredEmojis,
              [level]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        
        // Track modified fields (exclude email)
        if (name !== 'email' && originalData && originalData[name] !== value) {
          console.log(`🔄 [PROFILE] Field "${name}" modified:`, { original: originalData[name], new: value });
          setModifiedFields(prev => new Set(prev).add(name));
        } else if (originalData && originalData[name] === value) {
          // If value is back to original, remove from modified fields
          console.log(`🔄 [PROFILE] Field "${name}" restored to original:`, value);
          setModifiedFields(prev => {
            const newSet = new Set(prev);
            newSet.delete(name);
            return newSet;
          });
        }
      }
    }
  };

  const validateForm = (fieldsToValidate: Set<string>) => {
    // Only validate required fields if they were modified or are empty
    if ((fieldsToValidate.has('firstName') || !formData.firstName.trim()) && !formData.firstName.trim()) {
      setMessage('❌ El nombre es requerido');
      return false;
    }
    if ((fieldsToValidate.has('lastName') || !formData.lastName.trim()) && !formData.lastName.trim()) {
      setMessage('❌ El apellido es requerido');
      return false;
    }
    if ((fieldsToValidate.has('username') || !formData.username.trim()) && !formData.username.trim()) {
      setMessage('❌ El nombre de usuario es requerido');
      return false;
    }
    if (fieldsToValidate.has('username') && formData.username.length < 3) {
      setMessage('❌ El nombre de usuario debe tener al menos 3 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Check if there are any modifications
    if (modifiedFields.size === 0) {
      setMessage('ℹ️ No se han realizado cambios');
      setIsLoading(false);
      return;
    }

    console.log('🔄 [PROFILE] Modified fields:', Array.from(modifiedFields));

    // Validate only modified fields
    if (!validateForm(modifiedFields)) {
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      console.log('🔄 [PROFILE] Starting profile update...');
      
      // Create profileData with only modified fields (exclude email)
      const profileData: any = {};
      
      if (modifiedFields.has('firstName')) {
        profileData.firstName = formData.firstName.trim();
      }
      if (modifiedFields.has('lastName')) {
        profileData.lastName = formData.lastName.trim();
      }
      if (modifiedFields.has('username')) {
        profileData.username = formData.username.trim();
      }
      if (modifiedFields.has('profileImage')) {
        profileData.profileImage = formData.profileImage;
      }

      console.log('📝 [PROFILE] Only modified fields to save:', profileData);
      
      // Add notifications and privacy to profile data if in those tabs
      if (activeTab === 'notifications') {
        profileData.notifications = formData.notifications;
      }
      if (activeTab === 'privacy') {
        profileData.privacy = formData.privacy;
      }

      // Only call API if there are actual fields to update
      if (Object.keys(profileData).length > 0 || activeTab === 'notifications' || activeTab === 'privacy') {
        const profileResponse = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(profileData)
        });

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          console.error('❌ [PROFILE] Profile save failed:', errorData);
          throw new Error(errorData.error || errorData.details || 'Error al actualizar perfil');
        }

        console.log('✅ [PROFILE] Modified profile fields saved successfully');
      }

      // Save badge customization separately if in badges tab
      if (formData.badgeCustomization && activeTab === 'badges') {
        console.log('🎨 [PROFILE] Saving badge customization...');
        const badgeResponse = await fetch('/api/profile/badge-customization', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(formData.badgeCustomization)
        });

        if (!badgeResponse.ok) {
          const errorData = await badgeResponse.json();
          console.warn('⚠️ Badge customization save failed:', errorData);
        } else {
          console.log('✅ [PROFILE] Badge customization saved');
          // Notify navbar to update
          window.dispatchEvent(new CustomEvent('badgeCustomizationUpdated'));
        }
      }

      // Clear modified fields after successful save
      setModifiedFields(new Set());
      
      // Update original data to current values
      if (originalData) {
        const updatedOriginal = { ...originalData };
        modifiedFields.forEach(field => {
          if (field !== 'email') {
            updatedOriginal[field] = formData[field];
          }
        });
        setOriginalData(updatedOriginal);
      }
      
      setMessage('✅ Perfil actualizado exitosamente');
      
      // Trigger a refresh of streak display if badge settings changed
      if (formData.badgeCustomization && (window as any).refreshStreaks) {
        setTimeout(() => {
          (window as any).refreshStreaks();
        }, 1000);
      }

    } catch (error) {
      console.error('❌ [PROFILE] Error al actualizar perfil:', error);
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Error al actualizar el perfil'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', name: 'Información Personal', icon: '👤' },
    ...((user?.membershipLevel === 'PREMIUM' || user?.membershipLevel === 'BASIC') ? [{ id: 'badges', name: 'Badges y Rachas', icon: '🏆' }] : []),
    { id: 'notifications', name: 'Notificaciones', icon: '🔔' },
    { id: 'privacy', name: 'Privacidad', icon: '🔒' },
    { id: 'security', name: 'Seguridad', icon: '🛡️' }
  ];


  return (
    <>
      <Navbar  />
      
      
      
      <main className="main-content pt-16">
        {/* Hero Section */}
        <section className="hero gradient-bg">
          <img
            src="/images/background.png"
            alt="Header background"
            className="hero-background"
          />
          
          <div className="container" style={{ position: 'relative', zIndex: 10 }}>
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
                          <label htmlFor="profileImage">Imagen de Perfil</label>
                          
                          {/* Image Preview */}
                          {(formData.profileImage || imagePreview) && (
                            <div className="image-preview-container mb-4 text-center">
                              <div className="relative inline-block mx-auto">
                                <img
                                  src={imagePreview || formData.profileImage}
                                  alt="Vista previa"
                                  className="profile-image-preview"
                                  style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '3px solid #e5e7eb',
                                    display: 'block'
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={clearImage}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md"
                                  title="Eliminar imagen"
                                >
                                  ✕
                                </button>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                Vista previa de tu imagen de perfil
                              </p>
                            </div>
                          )}

                          {/* File Upload */}
                          <div className="upload-section">
                            <input
                              type="file"
                              id="imageFile"
                              name="imageFile"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={handleFileChange}
                              className="file-input"
                            />
                            <label htmlFor="imageFile" className="file-upload-label">
                              <span className="upload-icon">📷</span>
                              <span>Seleccionar imagen</span>
                            </label>
                            <div className="format-specs">
                              <p className="text-xs text-gray-600 mt-2">
                                <strong>Formatos permitidos:</strong> JPG, PNG, WebP<br/>
                                <strong>Tamaño máximo:</strong> 2MB<br/>
                                <strong>Recomendado:</strong> 400x400px, formato cuadrado
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Badges y Rachas */}
                  {activeTab === 'badges' && (
                    <div className="tab-content">
                      <h2 className="tab-title">Personalización de Badges y Rachas</h2>
                      
                      {/* Verificar si el usuario tiene plan de pago */}
                      {user?.membershipLevel !== 'PREMIUM' && user?.membershipLevel !== 'BASIC' ? (
                        <div className="premium-feature-locked">
                          <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔒</div>
                            <h3 className="text-xl font-semibold mb-2">Funcionalidad de Pago</h3>
                            <p className="text-gray-600 mb-6">
                              La personalización de badges y rachas está disponible para usuarios con planes de pago.
                            </p>
                            <div className="space-y-3 text-sm text-gray-500 mb-6">
                              <p>✨ Personaliza colores y emojis de tus badges</p>
                              <p>🎨 Estilos únicos para tu perfil</p>
                              <p>🏆 Badge visible en la barra de navegación</p>
                            </div>
                            <a 
                              href="/subscription" 
                              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                              🚀 Ver Planes de Pago
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="badge-customization-grid">
                        <div className="badge-style-section mb-6">
                          <h3 className="text-lg font-semibold mb-4">Estilo de Badge</h3>
                          <div className="flex gap-4">
                            <label className="badge-style-option">
                              <input
                                type="radio"
                                name="badgeCustomization.preferredBadgeStyle"
                                value="emoji"
                                checked={formData.badgeCustomization.preferredBadgeStyle === 'emoji'}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  badgeCustomization: {
                                    ...prev.badgeCustomization,
                                    preferredBadgeStyle: e.target.value as 'emoji' | 'text' | 'colorful'
                                  }
                                }))}
                              />
                              <div className="badge-style-preview">
                                <span className="text-2xl">🔥</span>
                                <span className="text-sm">Emoji</span>
                              </div>
                            </label>
                            <label className="badge-style-option">
                              <input
                                type="radio"
                                name="badgeCustomization.preferredBadgeStyle"
                                value="text"
                                checked={formData.badgeCustomization.preferredBadgeStyle === 'text'}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  badgeCustomization: {
                                    ...prev.badgeCustomization,
                                    preferredBadgeStyle: e.target.value as 'emoji' | 'text' | 'colorful'
                                  }
                                }))}
                              />
                              <div className="badge-style-preview">
                                <span className="text-sm font-bold">EN LLAMAS</span>
                                <span className="text-sm">Texto</span>
                              </div>
                            </label>
                            <label className="badge-style-option">
                              <input
                                type="radio"
                                name="badgeCustomization.preferredBadgeStyle"
                                value="colorful"
                                checked={formData.badgeCustomization.preferredBadgeStyle === 'colorful'}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  badgeCustomization: {
                                    ...prev.badgeCustomization,
                                    preferredBadgeStyle: e.target.value as 'emoji' | 'text' | 'colorful'
                                  }
                                }))}
                              />
                              <div className="badge-style-preview">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-red-500"></div>
                                <span className="text-sm">Colorido</span>
                              </div>
                            </label>
                          </div>
                        </div>

                        <div className="badge-color-section mb-6">
                          <h3 className="text-lg font-semibold mb-4">Color del Badge</h3>
                          <div className="flex items-center gap-4">
                            <input
                              type="color"
                              name="badgeCustomization.badgeColor"
                              value={formData.badgeCustomization.badgeColor}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                badgeCustomization: {
                                  ...prev.badgeCustomization,
                                  badgeColor: e.target.value
                                }
                              }))}
                              className="w-16 h-10 rounded border"
                            />
                            <span className="text-sm text-gray-600">
                              Color personalizado para tus badges
                            </span>
                          </div>
                        </div>

                        <div className="navbar-badge-section mb-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">Mostrar Badge en Navbar</h3>
                              <p className="text-sm text-gray-600">Muestra tu racha actual en la barra de navegación</p>
                            </div>
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                name="badgeCustomization.showBadgeInNavbar"
                                checked={formData.badgeCustomization.showBadgeInNavbar}
                                onChange={handleInputChange}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </div>
                        </div>

                        <div className="emoji-customization-section">
                          <h3 className="text-lg font-semibold mb-4">Emojis Personalizados</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(formData.badgeCustomization.preferredEmojis).map(([level, emoji]) => (
                              <div key={level} className="emoji-input-group">
                                <label className="block text-sm font-medium mb-2">
                                  {level.replace('_', ' ')}
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    name={`emoji.${level}`}
                                    value={emoji}
                                    onChange={handleInputChange}
                                    className="w-16 h-10 text-center text-lg border rounded"
                                    maxLength={2}
                                    placeholder="🏆"
                                  />
                                  <span className="text-sm text-gray-600">
                                    Para nivel {level.toLowerCase()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="badge-preview-section mt-6">
                          <h3 className="text-lg font-semibold mb-4">Vista Previa del Badge</h3>
                          <div className="flex flex-wrap gap-4">
                            <div className="preview-item">
                              <h4 className="text-sm font-medium mb-2">Estilo Emoji</h4>
                              <div className="flex items-center px-3 py-1 rounded-full text-sm border bg-gradient-to-r from-blue-100 to-purple-100">
                                <span className="text-lg">{formData.badgeCustomization.preferredEmojis.EN_LLAMAS}</span>
                                <span className="ml-1 font-semibold text-gray-700">8</span>
                              </div>
                            </div>
                            
                            <div className="preview-item">
                              <h4 className="text-sm font-medium mb-2">Estilo Texto</h4>
                              <div className="flex items-center px-3 py-1 rounded-full text-sm border bg-gradient-to-r from-blue-100 to-purple-100">
                                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                  EN LLAMAS
                                </span>
                              </div>
                            </div>
                            
                            <div className="preview-item">
                              <h4 className="text-sm font-medium mb-2">Estilo Colorido</h4>
                              <div 
                                className="flex items-center px-3 py-1 rounded-full text-sm border transition-all duration-300"
                                style={{
                                  background: `linear-gradient(135deg, ${formData.badgeCustomization.badgeColor}40, ${formData.badgeCustomization.badgeColor}20)`,
                                  borderColor: `${formData.badgeCustomization.badgeColor}80`
                                }}
                              >
                                <div 
                                  className="w-4 h-4 rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold"
                                  style={{ backgroundColor: formData.badgeCustomization.badgeColor }}
                                >
                                  8
                                </div>
                                <span className="text-xs font-semibold text-gray-700">EN LLAMAS</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Así se verá tu badge en la barra de navegación según el estilo seleccionado
                          </p>
                        </div>
                        </div>
                      )}
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {modifiedFields.size > 0 && (
                          <span className="text-sm text-orange-600 mr-4">
                            ⚠️ {modifiedFields.size} campo{modifiedFields.size > 1 ? 's' : ''} modificado{modifiedFields.size > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <button 
                        type="submit" 
                        className={`btn btn-primary ${modifiedFields.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading || modifiedFields.size === 0}
                      >
                        {isLoading ? 'Guardando...' : modifiedFields.size > 0 ? 'Guardar Cambios' : 'Sin Cambios'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      <style jsx>{`
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -1;
        }

        .badge-style-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .badge-style-option input[type="radio"] {
          margin-bottom: 0.5rem;
        }

        .badge-style-option:hover {
          border-color: #3b82f6;
        }

        .badge-style-option:has(input:checked) {
          border-color: #3b82f6;
          background-color: #f0f9ff;
        }

        .badge-style-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .emoji-input-group {
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background-color: #f9fafb;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #3b82f6;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .premium-feature-locked {
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          margin: 1rem 0;
        }

        .upload-section {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 0.5rem;
          text-align: center;
        }

        .file-input {
          display: none;
        }

        .file-upload-label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
          border: none;
          margin: 0 auto;
        }

        .file-upload-label:hover {
          background: #2563eb;
        }

        .upload-icon {
          font-size: 1.2em;
        }

        .format-specs {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 0.75rem;
          margin-top: 1rem;
          text-align: left;
        }


        .privacy-grid {
          display: grid;
          gap: 1.5rem;
        }

        .privacy-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .privacy-info h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
        }

        .privacy-info p {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
        }
      `}</style>
    </>
  );
} 