'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import DynamicLogo from '@/components/ui/DynamicLogo';

export default function TestPremiumPage() {
  const { user, status } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/subscription-status');
      const data = await response.json();
      setSubscriptionData(data);
      console.log('📊 [TEST] Subscription data:', data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && user) {
      checkSubscription();
    }
  }, [status, user]);

  const isPremium = status === 'authenticated' && user && (
    user.membershipLevel === 'PREMIUM' ||
    subscriptionData?.membershipLevel === 'PREMIUM' ||
    subscriptionData?.hasActiveSubscription === true
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Test Premium Status</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Estado de Autenticación</h2>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Usuario:</strong> {user?.email || 'No autenticado'}</p>
      </div>

      {user && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Información del Usuario</h2>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Membership Level:</strong> {user.membershipLevel}</p>
          <p><strong>Email Verified:</strong> {user.emailVerified ? 'Sí' : 'No'}</p>
          <p><strong>Is Active:</strong> {user.isActive ? 'Sí' : 'No'}</p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h2>Datos de Suscripción</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : subscriptionData ? (
          <div>
            <p><strong>Has Active Subscription:</strong> {subscriptionData.hasActiveSubscription ? 'Sí' : 'No'}</p>
            <p><strong>Membership Level:</strong> {subscriptionData.membershipLevel}</p>
            {subscriptionData.subscription && (
              <div>
                <h3>Detalles de Suscripción</h3>
                <p><strong>Status:</strong> {subscriptionData.subscription.status}</p>
                <p><strong>Current Period End:</strong> {new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleString()}</p>
                <p><strong>Price:</strong> {subscriptionData.subscription.price.unitAmount} {subscriptionData.subscription.price.currency}</p>
                <p><strong>Product:</strong> {subscriptionData.subscription.price.product.name}</p>
              </div>
            )}
          </div>
        ) : (
          <p>No hay datos de suscripción</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Resultado Final</h2>
        <p><strong>¿Es Premium?</strong> {isPremium ? '✅ SÍ' : '❌ NO'}</p>
        <p><strong>Logo que debería mostrar:</strong> {isPremium ? 'logop.webp (Dorado)' : 'logog.png (Gratuito)'}</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '20px', border: '2px solid #ccc', borderRadius: '10px' }}>
        <h2>🎨 Test del Logo Dinámico</h2>
        <p><strong>Logo que se está mostrando:</strong></p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <DynamicLogo width={95} height={95} priority={true} />
        </div>
      </div>

      <button 
        onClick={checkSubscription}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginRight: '10px'
        }}
      >
        {loading ? 'Verificando...' : 'Verificar Suscripción'}
      </button>

      <button 
        onClick={() => window.location.reload()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Recargar Página
      </button>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>🔧 Debug Info</h3>
        <p><strong>User Membership Level:</strong> {user?.membershipLevel || 'No disponible'}</p>
        <p><strong>API Membership Level:</strong> {subscriptionData?.membershipLevel || 'No disponible'}</p>
        <p><strong>API Has Active Subscription:</strong> {subscriptionData?.hasActiveSubscription ? 'Sí' : 'No'}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>User Authenticated:</strong> {status === 'authenticated' ? 'Sí' : 'No'}</p>
      </div>
    </div>
  );
}