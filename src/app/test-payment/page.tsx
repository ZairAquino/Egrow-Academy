'use client';

import { useState } from 'react';
import PaymentForm from '@/components/payments/PaymentForm';
import SubscriptionButton from '@/components/payments/SubscriptionButton';

export default function TestPaymentPage() {
  const [paymentResult, setPaymentResult] = useState<string>('');

  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentResult(`✅ Pago exitoso! ID: ${paymentId}`);
  };

  const handlePaymentError = (error: string) => {
    setPaymentResult(`❌ Error en el pago: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Página de Prueba de Pagos
          </h1>
          <p className="text-gray-600">
            Esta página es para probar la integración de Stripe. Usa las tarjetas de prueba de Stripe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulario de Pago Directo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">💳 Pago Directo</h2>
            <p className="text-sm text-gray-600 mb-4">
              Prueba un pago único de $9.99
            </p>
            
            <PaymentForm
              amount={999}
              currency="usd"
              description="Prueba de pago - eGrow Academy"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>

          {/* Botón de Suscripción */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">🔄 Suscripción</h2>
            <p className="text-sm text-gray-600 mb-4">
              Prueba una suscripción mensual de $19.99
            </p>
            
            <SubscriptionButton
              amount={1999}
              currency="usd"
              description="Suscripción Premium - eGrow Academy"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Suscribirse por $19.99/mes
            </SubscriptionButton>
          </div>
        </div>

        {/* Resultado */}
        {paymentResult && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">📊 Resultado</h3>
            <div className={`p-4 rounded-lg ${
              paymentResult.includes('✅') 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              {paymentResult}
            </div>
          </div>
        )}

        {/* Tarjetas de Prueba */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">💳 Tarjetas de Prueba de Stripe</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✅ Pago Exitoso</h4>
              <p><strong>Número:</strong> 4242 4242 4242 4242</p>
              <p><strong>Fecha:</strong> Cualquier fecha futura</p>
              <p><strong>CVC:</strong> Cualquier 3 dígitos</p>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">❌ Pago Fallido</h4>
              <p><strong>Número:</strong> 4000 0000 0000 0002</p>
              <p><strong>Fecha:</strong> Cualquier fecha futura</p>
              <p><strong>CVC:</strong> Cualquier 3 dígitos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 