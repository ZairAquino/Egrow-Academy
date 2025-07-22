import { useEffect, useState } from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-[9999] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div 
          className={`bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Header */}
          <div 
            className="rounded-t-2xl p-6 text-white text-center"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
            }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido a eGrow Academy!</h2>
            <p className="text-green-100">Tu suscripción premium ha sido activada</p>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Acceso Premium Completo</h3>
                  <p className="text-sm text-gray-600">Todos los cursos premium están ahora disponibles</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Recursos Exclusivos</h3>
                  <p className="text-sm text-gray-600">Acceso a materiales y recursos premium</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Soporte Prioritario</h3>
                  <p className="text-sm text-gray-600">Atención personalizada para miembros premium</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/courses';
                }}
                className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
                }}
              >
                🚀 Explorar Cursos Premium
              </button>
              
              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 