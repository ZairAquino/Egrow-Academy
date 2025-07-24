'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/layout/Footer';
import UserProfile from '@/components/auth/UserProfile';
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
    id: 'monthly',
    name: 'Plan Mensual',
    price: 6.99,
    interval: 'month',
    features: [
      'Acceso a todos los cursos especializados',
      'Contenido actualizado mensualmente',
      'Certificados de finalización',
      'Soporte técnico prioritario',
      'Acceso a la comunidad exclusiva',
      'Proyectos prácticos incluidos'
    ]
  },
  {
    id: 'yearly',
    name: 'Plan Anual',
    price: 59.99,
    interval: 'year',
    popular: true,
    savings: 'Ahorra 40%',
    features: [
      'Todo lo del plan mensual',
      '2 meses gratis',
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
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string>('');

  useEffect(() => {
    if (status !== 'loading' && !user) {
      router.push('/login?redirect=/subscription');
    }
  }, [user, status, router]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Por favor ingresa un código de cupón');
      return;
    }

    setIsProcessing(true);
    setCouponError('');

    try {
      const response = await fetch('/api/stripe/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponCode: couponCode.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al validar cupón');
      }

      setCouponApplied(true);
      setCouponError('');
      alert(`✅ Cupón aplicado: ${data.coupon.name}`);
      
    } catch (error) {
      console.error('Error al aplicar cupón:', error);
      setCouponError(error instanceof Error ? error.message : 'Error al aplicar cupón');
      setCouponApplied(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push('/login?redirect=/subscription');
      return;
    }

    setIsProcessing(true);
    try {
      // Crear sesión de checkout con Stripe
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          planId,
          couponCode: couponApplied ? couponCode : undefined 
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

  const getMonthlyPrice = (plan: SubscriptionPlan) => {
    if (plan.interval === 'month') {
      return plan.price;
    }
    return (plan.price / 12).toFixed(2);
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
      <UserProfile className="user-profile-fixed" />
      <main className="subscription-page">
        {/* Header */}
        <div className="subscription-header">
          <div className="subscription-header-content">
            <Link href="/" className="subscription-logo">
              <img src="/images/egacademylogoblanco.png" alt="eGrow Academy" />
              <span className="subscription-logo-text">eGrow Academy</span>
            </Link>
            <Link href="/courses" className="subscription-back-link">
              ← Volver a Cursos
            </Link>
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
            
            {/* Cupón Section */}
            <div className="coupon-section mb-6">
              <div className="coupon-container">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  ¿Tienes un código de descuento?
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Ingresa tu código de cupón"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={couponApplied}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isProcessing || couponApplied}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {couponApplied ? '✅ Aplicado' : 'Aplicar'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-sm mt-2">{couponError}</p>
                )}
                {couponApplied && (
                  <p className="text-green-600 text-sm mt-2">
                    ✅ Cupón aplicado: {couponCode}
                  </p>
                )}
              </div>
            </div>

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
              className={`plan-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && (
                <div className="plan-popular-badge">
                  ⭐ Más Popular
                </div>
              )}
              
              {plan.savings && (
                <div className="plan-savings-badge">
                  {plan.savings}
                </div>
              )}

              <div className="plan-content">
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    ${plan.price}
                    <span className="plan-interval">
                      /{plan.interval === 'month' ? 'mes' : 'año'}
                    </span>
                  </div>
                  {plan.interval === 'year' && (
                    <p className="plan-monthly-price">
                      ${getMonthlyPrice(plan)}/mes facturado anualmente
                    </p>
                  )}
                </div>

                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="plan-feature">
                      <span className="plan-feature-icon">✓</span>
                      <span className="plan-feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing}
                  className={`plan-button ${plan.popular ? 'primary' : 'secondary'}`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    `Suscribirse por $${plan.price}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>



        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-container">
            <h2 className="cta-title">
              ¿Listo para transformar tu carrera?
            </h2>
            <p className="cta-description">
              Únete a miles de estudiantes que ya están aprendiendo con eGrow Academy
            </p>
            <div className="cta-buttons">
              <button
                onClick={() => handleSubscribe('yearly')}
                disabled={isProcessing}
                className="cta-button primary"
              >
                Comenzar Plan Anual
              </button>
              <button
                onClick={() => handleSubscribe('monthly')}
                disabled={isProcessing}
                className="cta-button secondary"
              >
                Comenzar Plan Mensual
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
} 