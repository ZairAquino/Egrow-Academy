'use client'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '2rem'
    }}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: index < currentStep ? '#667eea' : '#e5e7eb',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
        >
          {index < currentStep && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '6px',
              height: '6px',
              backgroundColor: 'white',
              borderRadius: '50%'
            }} />
          )}
        </div>
      ))}
      
      <span style={{
        marginLeft: '1rem',
        fontSize: '0.9rem',
        color: '#6b7280',
        fontWeight: '500'
      }}>
        Paso {currentStep} de {totalSteps}
      </span>
    </div>
  )
} 