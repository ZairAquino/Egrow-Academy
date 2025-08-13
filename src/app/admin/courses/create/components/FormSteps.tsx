'use client';

interface FormStepsProps {
  currentStep: number;
  goToStep: (step: number) => void;
  isStepValid: (step: number) => boolean;
  stepTitles: Record<number, string>;
}

export default function FormSteps({ currentStep, goToStep, isStepValid, stepTitles }: FormStepsProps) {
  const steps = [
    { number: 1, title: 'Información Básica', description: 'Título, descripción y detalles generales', icon: '📝' },
    { number: 2, title: 'Objetivos', description: 'Qué aprenderán, herramientas y prerrequisitos', icon: '🎯' },
    { number: 3, title: 'Módulos', description: 'Estructura de módulos y lecciones', icon: '📚' },
    { number: 4, title: 'Instructor', description: 'Información del instructor del curso', icon: '👨‍🏫' },
    { number: 5, title: 'Testimonios', description: 'Reviews y testimonios de estudiantes', icon: '⭐' },
    { number: 6, title: 'Precios', description: 'Configuración de precios y planes', icon: '💰' },
    { number: 7, title: 'Preview', description: 'Vista previa y publicación', icon: '🚀' }
  ];

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      return 'completed';
    } else if (stepNumber === currentStep) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  const canNavigateToStep = (stepNumber: number) => {
    // Permitir navegar a steps anteriores o al step actual
    if (stepNumber <= currentStep) return true;
    
    // Para steps futuros, verificar que todos los steps anteriores sean válidos
    for (let i = 1; i < stepNumber; i++) {
      if (!isStepValid(i)) return false;
    }
    return true;
  };

  const handleStepClick = (stepNumber: number) => {
    if (canNavigateToStep(stepNumber)) {
      goToStep(stepNumber);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Progreso del Curso</h3>
      
      {/* Barra de progreso general */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progreso</span>
          <span>{Math.round(((currentStep - 1) / 6) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Lista de steps */}
      <nav className="space-y-2">
        {steps.map((step, index) => {
          const status = getStepStatus(step.number);
          const canNavigate = canNavigateToStep(step.number);
          
          return (
            <button
              key={step.number}
              onClick={() => handleStepClick(step.number)}
              disabled={!canNavigate}
              className={`
                w-full text-left p-3 rounded-lg transition-all duration-200 group
                ${status === 'current' 
                  ? 'bg-blue-50 border-2 border-blue-200' 
                  : status === 'completed'
                  ? 'bg-green-50 border border-green-200 hover:bg-green-100'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }
                ${!canNavigate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start space-x-3">
                {/* Icono o número del step */}
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${status === 'current' 
                    ? 'bg-blue-600 text-white' 
                    : status === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                  }
                `}>
                  {status === 'completed' ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Contenido del step */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{step.icon}</span>
                    <p className={`
                      text-sm font-medium
                      ${status === 'current' 
                        ? 'text-blue-900' 
                        : status === 'completed'
                        ? 'text-green-900'
                        : 'text-gray-600'
                      }
                    `}>
                      {step.title}
                    </p>
                  </div>
                  <p className={`
                    text-xs mt-1
                    ${status === 'current' 
                      ? 'text-blue-700' 
                      : status === 'completed'
                      ? 'text-green-700'
                      : 'text-gray-500'
                    }
                  `}>
                    {step.description}
                  </p>
                </div>

                {/* Indicador de estado */}
                {status === 'current' && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Información adicional */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">💡 Consejos</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Los cambios se guardan automáticamente cada 30 segundos</li>
          <li>• Puedes navegar entre steps completados</li>
          <li>• El preview final mostrará exactamente cómo se verá tu curso</li>
        </ul>
      </div>
    </div>
  );
}