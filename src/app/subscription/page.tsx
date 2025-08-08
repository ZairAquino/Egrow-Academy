'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

import './subscription.css';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  savings?: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Plan Gratuito',
    price: 0,
    interval: 'month',
    features: [
      'Acceso a cursos públicos gratuitos',
      'Sistema básico de rachas',
      'Comunidad básica',
      'Soporte por email estándar',
      '✕ Acceso a cursos especializados premium',
      '✕ Certificados de finalización',
      '✕ Badge visible en navbar',
      '✕ Personalización de badges y rachas'
    ]
  },
  {
    id: 'monthly',
    name: 'Plan Mensual',
    price: 12.49,
    interval: 'month',
    popular: true,
    features: [
      'Acceso a todos los cursos especializados',
      'Contenido actualizado mensualmente',
      'Certificados de finalización',
      'Sistema completo de rachas',
      'Badge visible en navbar',
      'Personalización de badges y rachas',
      'Soporte técnico prioritario',
      'Acceso a la comunidad exclusiva'
    ]
  },
  {
    id: 'yearly',
    name: 'Plan Anual',
    price: 149.99,
    interval: 'year',
    popular: true,
    savings: 'Ahorra Más',
    features: [
      'Todo lo del plan mensual',
      '2 meses gratis',
      'Personalización completa de badges y rachas',
      'Badge visible en barra de navegación',
      'Acceso anticipado a nuevos cursos',
      'Mentorías grupales mensuales',
      'Recursos premium adicionales',
      'Garantía de satisfacción de 30 días'
    ]
  }
];

export default function SubscriptionPage() {
  const { user, status } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountCodes, setDiscountCodes] = useState<{[key: string]: string}>({});
  const [appliedDiscounts, setAppliedDiscounts] = useState<{[key: string]: {code: string, discount: number, planId: string}}>({});
  const [discountErrors, setDiscountErrors] = useState<{[key: string]: string}>({});
  const [premiumCourses, setPremiumCourses] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Cargar cursos premium dinámicamente - Solo los 4 cursos premium reales
  useEffect(() => {
    const loadPremiumCourses = async () => {
      try {
        // Solo los cursos que realmente son premium
        const premiumCourseRoutes = [
          'videos-profesionales-ia',
          'vibe-coding-claude-cursor', 
          'monetiza-voz-ia-elevenlabs',
          'desarrollo-web-fullstack'
        ];

        const courses = premiumCourseRoutes.map((route) => {
          // Mapeo de rutas a información de curso - Solo cursos premium
          const courseInfo = {
            'videos-profesionales-ia': {
              title: 'Videos Profesionales con IA',
              description: 'Domina las herramientas de IA para crear contenido audiovisual profesional',
              image: '/images/15.png',
              duration: '18h 30min',
              lessons: '11 lecciones',
              level: 'Intermedio',
              category: 'Marketing Digital'
            },
            'vibe-coding-claude-cursor': {
              title: 'Vibe Coding con Claude & Cursor',
              description: 'Aprende a programar de manera eficiente con IA usando Claude y Cursor',
              image: '/images/17.png',
              duration: '20h',
              lessons: '7 lecciones',
              level: 'Intermedio',
              category: 'Desarrollo Web'
            },
            'monetiza-voz-ia-elevenlabs': {
              title: 'Monetiza tu Voz con IA',
              description: 'Genera ingresos creando contenido de audio con inteligencia artificial',
              image: '/images/21.png',
              duration: '8h',
              lessons: '15 lecciones',
              level: 'Principiante',
              category: 'IA para Emprender'
            },
            'desarrollo-web-fullstack': {
              title: 'Desarrollo Web Full Stack',
              description: 'Conviértete en desarrollador completo con tecnologías modernas',
              image: '/images/16.png',
              duration: '25h',
              lessons: '6 lecciones',
              level: 'Intermedio',
              category: 'Desarrollo Web'
            }
          };

          return {
            id: route,
            slug: route,
            ...courseInfo[route as keyof typeof courseInfo]
          };
        }).filter(course => course !== undefined);

        setPremiumCourses(courses);
      } catch (error) {
        console.error('Error loading premium courses:', error);
        // Fallback a cursos premium estáticos si falla la carga dinámica
        setPremiumCourses([
          {
            id: 'videos-profesionales-ia',
            slug: 'videos-profesionales-ia',
            title: 'Videos Profesionales con IA',
            description: 'Domina las herramientas de IA para crear contenido audiovisual profesional',
            image: '/images/15.png',
            duration: '18h 30min',
            lessons: '11 lecciones',
            level: 'Intermedio',
            category: 'Marketing Digital'
          },
          {
            id: 'vibe-coding-claude-cursor',
            slug: 'vibe-coding-claude-cursor',
            title: 'Vibe Coding con Claude & Cursor',
            description: 'Aprende a programar de manera eficiente con IA usando Claude y Cursor',
            image: '/images/17.png',
            duration: '20h',
            lessons: '7 lecciones',
            level: 'Intermedio',
            category: 'Desarrollo Web'
          },
          {
            id: 'monetiza-voz-ia-elevenlabs',
            slug: 'monetiza-voz-ia-elevenlabs',
            title: 'Monetiza tu Voz con IA',
            description: 'Genera ingresos creando contenido de audio con inteligencia artificial',
            image: '/images/21.png',
            duration: '8h',
            lessons: '15 lecciones',
            level: 'Principiante',
            category: 'IA para Emprender'
          },
          {
            id: 'desarrollo-web-fullstack',
            slug: 'desarrollo-web-fullstack',
            title: 'Desarrollo Web Full Stack',
            description: 'Conviértete en desarrollador completo con tecnologías modernas',
            image: '/images/16.png',
            duration: '25h',
            lessons: '6 lecciones',
            level: 'Intermedio',
            category: 'Desarrollo Web'
          }
        ]);
      }
    };

    loadPremiumCourses();
  }, []);

  const handleSubscribe = async (planId: string) => {
    // Si es plan gratuito y no hay usuario, redirigir al registro
    if (planId === 'free' && !user) {
      router.push(`/register?plan=${planId}`);
      return;
    }

    // Para planes de pago, solo requerir login cuando intentan suscribirse
    if (!user) {
      router.push(`/register?plan=${planId}`);
      return;
    }

    // Si es plan gratuito y ya está logueado, ya tiene el plan gratuito
    if (planId === 'free' && user) {
      alert('Ya tienes el plan gratuito activado');
      return;
    }

    setIsProcessing(true);
    try {
      // Capturar parámetros de tracking de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const trackingData = {
        promotionId: urlParams.get('promotionId'),
        sessionId: urlParams.get('sessionId'),
        pageUrl: urlParams.get('pageUrl'),
        referrer: urlParams.get('referrer'),
        userAgent: urlParams.get('userAgent'),
      };

      // Preparar datos del descuento si aplica
      const discount = appliedDiscounts[planId];
      const discountData = discount && discount.planId === planId ? {
        code: discount.code,
        discount: discount.discount
      } : null;

      // Crear sesión de checkout con Stripe
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          planId,
          discountData,
          trackingData: Object.fromEntries(
            Object.entries(trackingData).filter(([_, value]) => value !== null)
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear sesión de pago');
      }

      // Redirigir a Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout no recibida');
      }
      
    } catch (error) {
      console.error('Error al procesar suscripción:', error);
      
      // Mostrar error más específico
      let errorMessage = 'Error al procesar el pago. Por favor, intenta de nuevo.';
      
      if (error instanceof Error) {
        if (error.message.includes('No autorizado')) {
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        } else if (error.message.includes('Plan inválido')) {
          errorMessage = 'Plan de suscripción no válido.';
        } else if (error.message.includes('Usuario no encontrado')) {
          errorMessage = 'Error de autenticación. Por favor, inicia sesión nuevamente.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleDiscountCode = (planId: string) => {
    const currentCode = discountCodes[planId] || '';
    
    // Definir códigos con sus fechas de expiración
    const allCodes = {
      'WEBINAR50': { 
        discount: 0.5, 
        planId: 'monthly',
        expiryDate: new Date('2025-08-08T23:59:59-06:00') // 11:59 PM hora México (CST) - HOY
      },
      'EXPIRED30': { 
        discount: 0.3, 
        planId: 'monthly',
        expiryDate: new Date('2025-08-07T23:59:59-06:00') // Ejemplo de código expirado (ayer)
      },
      'OLDCODE': { 
        discount: 0.2, 
        planId: 'yearly',
        expiryDate: new Date('2025-07-31T23:59:59-06:00') // Ejemplo de código expirado
      }
    };

    const codeData = allCodes[currentCode as keyof typeof allCodes];
    
    // Verificar si el código existe
    if (!codeData) {
      setDiscountErrors(prev => ({
        ...prev,
        [planId]: 'Código de descuento inválido'
      }));
      setAppliedDiscounts(prev => {
        const newState = { ...prev };
        delete newState[planId];
        return newState;
      });
      return;
    }

    // Verificar si el código ha expirado
    const now = new Date();
    if (now > codeData.expiryDate) {
      setDiscountErrors(prev => ({
        ...prev,
        [planId]: 'Código de descuento expirado'
      }));
      setAppliedDiscounts(prev => {
        const newState = { ...prev };
        delete newState[planId];
        return newState;
      });
      return;
    }

    // Verificar que el código sea válido para este plan específico
    if (codeData.planId !== planId) {
      if (planId === 'yearly') {
        setDiscountErrors(prev => ({
          ...prev,
          [planId]: 'Este código solo es válido para el Plan Mensual'
        }));
      } else {
        setDiscountErrors(prev => ({
          ...prev,
          [planId]: 'Este código no es válido para este plan'
        }));
      }
      setAppliedDiscounts(prev => {
        const newState = { ...prev };
        delete newState[planId];
        return newState;
      });
      return;
    }

    setAppliedDiscounts(prev => ({
      ...prev,
      [planId]: { code: currentCode, discount: codeData.discount, planId: codeData.planId }
    }));
    setDiscountErrors(prev => {
      const newState = { ...prev };
      delete newState[planId];
      return newState;
    });
  };

  const getDiscountedPrice = (plan: SubscriptionPlan) => {
    const discount = appliedDiscounts[plan.id];
    if (discount && discount.planId === plan.id) {
      return (plan.price * (1 - discount.discount)).toFixed(2);
    }
    return plan.price;
  };

  const getCodeExpiryInfo = () => {
    const expiryDate = new Date('2025-08-08T23:59:59-06:00'); // HOY a las 23:59 PM hora México
    const now = new Date();
    const timeLeft = expiryDate.getTime() - now.getTime();
    
    if (timeLeft <= 0) {
      return null; // Código expirado
    }

    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursLeft > 0) {
      return `Válido por ${hoursLeft}h ${minutesLeft}m más`;
    } else {
      return `Válido por ${minutesLeft}m más`;
    }
  };

  const getMonthlyPrice = (plan: SubscriptionPlan) => {
    if (plan.interval === 'month') {
      return plan.price;
    }
    return (plan.price / 12).toFixed(2);
  };

  // Funciones del carrusel
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // desktop
      if (window.innerWidth >= 768) return 2;  // tablet
      return 1; // mobile
    }
    return 3; // default
  };

  const totalSlides = Math.ceil(premiumCourses.length / getItemsPerView());

  const nextSlide = () => {
    if (premiumCourses.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (premiumCourses.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="subscription-page">
        {/* Header */}
        <div className="subscription-header">
          <div className="subscription-header-content">
            <Link href="/" className="subscription-logo">
              <img src="/images/egacademylogoblanco.png" alt="eGrow Academy" />
              <span className="subscription-logo-text">eGrow Academy</span>
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="subscription-back-link"
            >
              ← Volver
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="subscription-hero">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="subscription-title">
              Elige tu Plan de Suscripción
            </h1>
            <p className="subscription-description">
              Desbloquea todo el potencial de eGrow Academy con acceso ilimitado a nuestros cursos especializados
            </p>
            <p className="text-sm text-gray-500 mt-2">
              ¿Tienes preguntas? Consulta nuestra{' '}
              <Link href="/community#faq" className="text-blue-600 hover:text-blue-700 underline">
                sección de FAQ
              </Link>
            </p>
            {/* Plan Toggle */}
            <div className="plan-toggle">
              <div className="plan-toggle-container">
                <div className="flex">
                  {subscriptionPlans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`plan-toggle-button ${
                        selectedPlan === plan.id ? 'active' : ''
                      }`}
                    >
                      {plan.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="plans-grid">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? 'popular' : ''} ${plan.id === 'yearly' && plan.popular ? 'yearly-popular' : ''}`}
            >
              {plan.popular && (
                <div className={`plan-popular-badge ${plan.id === 'yearly' ? 'yearly-badge' : ''}`}>
                  {plan.id === 'yearly' ? '🏆 Ahorra Más' : '⭐ Más Popular'}
                </div>
              )}
              
              {plan.savings && !plan.popular && (
                <div className="plan-savings-badge">
                  {plan.savings}
                </div>
              )}

              <div className="plan-content">
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    {appliedDiscounts[plan.id] && appliedDiscounts[plan.id].planId === plan.id ? (
                      <div className="plan-price-container">
                        <div className="plan-price-original-line">
                          <span className="plan-price-original">${plan.price}</span>
                          <span className="plan-interval-original">
                            /{plan.interval === 'month' ? 'mes' : 'año'}
                          </span>
                        </div>
                        <div className="plan-price-discounted-line">
                          <span className="plan-price-discounted">${getDiscountedPrice(plan)}</span>
                          <span className="plan-interval">
                            /{plan.interval === 'month' ? 'mes' : 'año'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        ${plan.price}
                        <span className="plan-interval">
                          /{plan.interval === 'month' ? 'mes' : 'año'}
                        </span>
                      </>
                    )}
                  </div>
                  {appliedDiscounts[plan.id] && appliedDiscounts[plan.id].planId === plan.id && (
                    <div className="plan-discount-badge">
                      🎉 {Math.round(appliedDiscounts[plan.id].discount * 100)}% de descuento aplicado
                    </div>
                  )}
                  {plan.interval === 'year' && (
                    <p className="plan-monthly-price">
                      ${getMonthlyPrice(plan)}/mes facturado anualmente
                    </p>
                  )}
                </div>

                <ul className="plan-features">
                  {plan.features.map((feature, index) => {
                    const isNotIncluded = feature.startsWith('✕');
                    const displayFeature = isNotIncluded ? feature.substring(2) : feature;
                    
                    return (
                      <li key={index} className={`plan-feature ${isNotIncluded ? 'not-included' : ''}`}>
                        <span className={`plan-feature-icon ${isNotIncluded ? 'not-included-icon' : ''}`}>
                          {isNotIncluded ? '✕' : '✓'}
                        </span>
                        <span className={`plan-feature-text ${isNotIncluded ? 'not-included-text' : ''}`}>
                          {displayFeature}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* Discount Code Box - Solo mostrar para planes de pago */}
                {plan.id !== 'free' && (
                  <div className="discount-code-box">
                    <div className="discount-code-header">
                      <span className="discount-code-icon">🎫</span>
                      <span className="discount-code-title">¿Tienes un código de descuento?</span>
                    </div>
                    <div className="discount-code-input-container">
                      <input
                        type="text"
                        placeholder="Ingresa tu código"
                        value={discountCodes[plan.id] || ''}
                        onChange={(e) => {
                          setDiscountCodes(prev => ({
                            ...prev,
                            [plan.id]: e.target.value.toUpperCase()
                          }));
                          setDiscountErrors(prev => {
                            const newState = { ...prev };
                            delete newState[plan.id];
                            return newState;
                          });
                        }}
                        className="discount-code-input"
                      />
                      <button
                        type="button"
                        onClick={() => handleDiscountCode(plan.id)}
                        className="discount-code-button"
                        disabled={!(discountCodes[plan.id] || '').trim()}
                      >
                        Aplicar
                      </button>
                    </div>
                    {discountErrors[plan.id] && (
                      <div className="discount-code-error">
                        {discountErrors[plan.id]}
                      </div>
                    )}
                    {appliedDiscounts[plan.id] && appliedDiscounts[plan.id].planId === plan.id && (
                      <div className="discount-code-success">
                        ✅ Código "{appliedDiscounts[plan.id].code}" aplicado - {Math.round(appliedDiscounts[plan.id].discount * 100)}% de descuento
                        {getCodeExpiryInfo() && (
                          <div className="discount-code-expiry">
                            ⏰ {getCodeExpiryInfo()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing || (plan.id === 'free' && user?.membershipLevel === 'FREE')}
                  className={`plan-button ${plan.popular ? 'primary' : 'secondary'} ${plan.id === 'free' && user?.membershipLevel === 'FREE' ? 'current-plan' : ''}`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : plan.id === 'free' && user?.membershipLevel === 'FREE' ? (
                    'Plan Actual ✓'
                  ) : plan.id === 'free' ? (
                    !user ? 'Registrarse Gratis' : 'Plan Gratuito'
                  ) : !user ? (
                    'Registrarse y Suscribirse'
                  ) : appliedDiscounts[plan.id] && appliedDiscounts[plan.id].planId === plan.id ? (
                    `Suscribirse por $${getDiscountedPrice(plan)} (${Math.round(appliedDiscounts[plan.id].discount * 100)}% desc.)`
                  ) : (
                    `Suscribirse por $${plan.price}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Courses Carousel Section */}
        {premiumCourses.length > 0 && (
          <div className="premium-courses-section">
            <div className="premium-courses-container">
              <div className="section-header">
                <div className="header-content">
                  <div className="header-text">
                    <h2>Nuestros Cursos Premium</h2>
                    <p>Suscríbete para acceder a todos estos cursos especializados y transformar tu carrera profesional</p>
                  </div>
                </div>
              </div>

              <div className="courses-carousel-infinite">
                <div className="courses-track-infinite">
                  {/* Duplicamos los cursos para crear efecto infinito */}
                  {[...premiumCourses, ...premiumCourses, ...premiumCourses].map((course, index) => (
                    <div key={`${course.id}-${index}`} className="premium-course-card">
                      <div className="course-image">
                        <img src={course.image} alt={course.title} />
                        <div className="course-overlay">
                          <span className="course-premium-badge">🔒 Premium</span>
                        </div>
                      </div>
                      <div className="course-content">
                        <div className="course-meta">
                          <span className="course-level">{course.level}</span>
                        </div>
                        <h3 className="course-title">{course.title}</h3>
                        <div className="course-stats">
                          <span className="course-duration">⏱️ {course.duration}</span>
                          <span className="course-lessons">📚 {course.lessons}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="premium-courses-cta">
                <div className="premium-cta-content">
                  <h3 className="premium-cta-title">
                    ¡Accede a todos estos cursos y más!
                  </h3>
                  <p className="premium-cta-description">
                    Con tu suscripción premium tendrás acceso inmediato a todos nuestros cursos especializados, 
                    contenido actualizado mensualmente y certificados de finalización.
                  </p>
                  <div className="premium-cta-benefits">
                    <div className="benefit-item">
                      <span className="benefit-icon">✅</span>
                      <span>+150 horas de contenido premium</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit-icon">✅</span>
                      <span>Certificados oficiales</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit-icon">✅</span>
                      <span>Actualizaciones mensuales</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit-icon">✅</span>
                      <span>Soporte prioritario</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        <div className="testimonials-section">
          <div className="testimonials-container">
            <div className="testimonials-header">
              <h2>Lo que dicen nuestros estudiantes</h2>
              <p>Descubre cómo eGrow Academy ha transformado la carrera de miles de profesionales</p>
            </div>

            {/* Video Testimonial */}
            <div className="video-testimonials">
              <h3>Testimonio de Estudiante</h3>
              <div className="video-grid-single">
                <div className="video-testimonial-card">
                  <div className="video-container">
                    <iframe 
                      className="testimonial-video"
                      src="https://www.youtube.com/embed/DgmWmSH2ffs?rel=0&modestbranding=1"
                      title="Testimonio de Carlos Rodríguez - eGrow Academy"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="video-info">
                    <h4>David Solis</h4>
                    <p className="student-role">Desarrollador Full Stack</p>
                    <p className="video-description">"Los cursos de eGrow Academy revolucionaron mi desarrollo como programador. Aprendí técnicas avanzadas de IA que me permitieron acelerar mis proyectos y conseguir el trabajo de mis sueños como desarrollador."</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </>
  );
} 