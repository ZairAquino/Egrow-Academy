'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PaymentForm from './PaymentForm';

interface SubscriptionButtonProps {
  amount: number;
  currency?: string;
  description?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function SubscriptionButton({
  amount,
  currency = 'usd',
  description = 'Suscripción Premium',
  onSuccess,
  onError,
  onStart,
  className = '',
  children,
  disabled = false
}: SubscriptionButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const { user, status } = useAuth();

  const handleClick = () => {
    if (status === 'loading' || disabled) {
      return;
    }

    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (user.membershipLevel === 'PREMIUM') {
      alert('¡Ya tienes una suscripción premium activa!');
      return;
    }

    onStart?.();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    // No mostrar alert aquí, la página de éxito se encarga de mostrar el mensaje
    closeModal();
    onSuccess?.(paymentId);
    // Redirigir a la página de éxito
    window.location.href = '/payment/success';
  };

  const handlePaymentError = (error: string) => {
    // No mostrar alert y no cerrar el modal
    // El error se maneja dentro del PaymentForm
    console.log('Error en el pago:', error);
    onError?.(error);
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={status === 'loading' || disabled}
        className={`subscription-button ${className}`}
      >
        {children || `Suscribirse por ${formatAmount(amount, currency)}`}
      </button>

      {/* Modal de Suscripción */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Suscribirse a eGrow Academy Premium</h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="subscription-info">
                <h4>Acceso completo a todos los cursos premium</h4>
                <ul>
                  <li>✅ Todos los cursos premium</li>
                  <li>✅ Certificados de finalización</li>
                  <li>✅ Soporte prioritario</li>
                  <li>✅ Proyectos prácticos</li>
                  <li>✅ Comunidad exclusiva</li>
                  <li>✅ Contenido actualizado regularmente</li>
                </ul>
                <div className="subscription-price">
                  <span className="price">{formatAmount(amount, currency)}</span>
                  <span className="period">/mes</span>
                </div>
              </div>
              <PaymentForm
                amount={amount}
                currency={currency}
                description={description}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Información importante</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Si tu pago no se procesa, puedes intentar con otra tarjeta o método de pago. 
                      El formulario se reiniciará automáticamente para un nuevo intento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .subscription-button {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .subscription-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }

        .subscription-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
        }

        .modal-body {
          padding: 20px;
        }

        .subscription-info {
          margin-bottom: 24px;
        }

        .subscription-info h4 {
          margin: 0 0 16px 0;
          color: #1f2937;
        }

        .subscription-info ul {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
        }

        .subscription-info li {
          padding: 8px 0;
          color: #374151;
        }

        .subscription-price {
          text-align: center;
          margin: 20px 0;
        }

        .subscription-price .price {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .subscription-price .period {
          font-size: 1rem;
          color: #6b7280;
        }
      `}</style>
    </>
  );
} 