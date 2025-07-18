# Configuración de Stripe para eGrow Academy

## 📋 Requisitos Previos

1. **Cuenta de Stripe**: Crear una cuenta en [stripe.com](https://stripe.com)
2. **Base de datos**: PostgreSQL configurado y funcionando
3. **Variables de entorno**: Configurar las claves de API de Stripe

## 🔑 Variables de Entorno

Agregar las siguientes variables a tu archivo `.env`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Clave secreta de Stripe (modo test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Clave pública de Stripe (modo test)
STRIPE_WEBHOOK_SECRET=whsec_... # Secreto del webhook de Stripe

# Para producción, usar las claves live:
# STRIPE_SECRET_KEY=sk_live_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 🚀 Configuración Inicial

### 1. Obtener las Claves de API

1. Inicia sesión en tu [Dashboard de Stripe](https://dashboard.stripe.com)
2. Ve a **Developers > API keys**
3. Copia las claves de prueba (test keys) para desarrollo
4. Para producción, usa las claves live

### 2. Configurar Webhooks

1. En el Dashboard de Stripe, ve a **Developers > Webhooks**
2. Haz clic en **Add endpoint**
3. URL del endpoint: `https://tu-dominio.com/api/stripe/webhook`
4. Eventos a escuchar:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

5. Copia el **Signing secret** y agrégalo como `STRIPE_WEBHOOK_SECRET`

### 3. Crear Productos y Precios

#### Opción A: Desde el Dashboard de Stripe

1. Ve a **Products** en el Dashboard
2. Crea productos para tus cursos/suscripciones
3. Configura los precios (one-time o recurring)
4. Copia los IDs de productos y precios

#### Opción B: Usando la API

```typescript
// Ejemplo de creación de producto y precio
import { createStripeProduct, createStripePrice } from '@/lib/stripe';

// Crear producto
const product = await createStripeProduct({
  name: 'Curso de Marketing Digital',
  description: 'Aprende marketing digital desde cero',
  metadata: {
    courseId: 'curso-marketing-123',
    type: 'course'
  }
});

// Crear precio
const price = await createStripePrice({
  productId: product.id,
  unitAmount: 9900, // $99.00 en centavos
  currency: 'usd',
  type: 'one_time'
});
```

## 🧪 Modo de Prueba

### Tarjetas de Prueba

Stripe proporciona tarjetas de prueba para desarrollo:

- **Visa**: `4242424242424242`
- **Visa (débito)**: `4000056655665556`
- **Mastercard**: `5555555555554444`
- **American Express**: `378282246310005`

### Códigos de Seguridad

- **CVC**: Cualquier número de 3 dígitos (ej: `123`)
- **Fecha de expiración**: Cualquier fecha futura (ej: `12/25`)

### Códigos de Error

Para probar diferentes escenarios de error:

- **Pago rechazado**: `4000000000000002`
- **Fondos insuficientes**: `4000000000009995`
- **Tarjeta expirada**: `4000000000000069`

## 🔧 Uso en la Aplicación

### Componente de Pago

```tsx
import PaymentForm from '@/components/payments/PaymentForm';

function CoursePayment({ course }) {
  return (
    <PaymentForm
      amount={course.price * 100} // Convertir a centavos
      currency="usd"
      courseId={course.id}
      description={`Pago por: ${course.title}`}
      onSuccess={(paymentId) => {
        console.log('Pago exitoso:', paymentId);
        // Redirigir o mostrar mensaje de éxito
      }}
      onError={(error) => {
        console.error('Error en pago:', error);
        // Mostrar mensaje de error
      }}
    />
  );
}
```

### Crear Suscripción

```tsx
import { useState } from 'react';

function SubscriptionForm({ priceId }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId,
          trialPeriodDays: 7, // Opcional: período de prueba
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Redirigir al usuario para completar el pago
        window.location.href = data.redirectUrl;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSubscribe}
      disabled={isLoading}
    >
      {isLoading ? 'Procesando...' : 'Suscribirse'}
    </button>
  );
}
```

## 📊 Monitoreo y Logs

### Verificar Webhooks

1. En el Dashboard de Stripe, ve a **Developers > Webhooks**
2. Selecciona tu endpoint
3. Ve a **Events** para ver los eventos enviados
4. Revisa los logs de tu aplicación para errores

### Logs de la Aplicación

Los webhooks generan logs en la consola del servidor:

```
Webhook recibido: payment_intent.succeeded
Pago exitoso: pi_1234567890
Suscripción creada: sub_1234567890
```

## 🔒 Seguridad

### Validación de Webhooks

- Siempre verificar la firma del webhook
- Usar HTTPS en producción
- Validar los datos recibidos antes de procesarlos

### Manejo de Errores

- Implementar reintentos para webhooks fallidos
- Logging detallado de errores
- Notificaciones para errores críticos

## 🚀 Despliegue en Producción

### 1. Cambiar a Claves Live

```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 2. Configurar Webhook de Producción

- URL: `https://tu-dominio.com/api/stripe/webhook`
- Usar el secreto de producción

### 3. Configurar Dominio

En el Dashboard de Stripe:
- **Settings > Checkout settings**
- Agregar tu dominio a los dominios permitidos

### 4. Configurar Métodos de Pago

- Habilitar los métodos de pago deseados
- Configurar monedas soportadas
- Configurar impuestos si aplica

## 📞 Soporte

- **Documentación de Stripe**: [stripe.com/docs](https://stripe.com/docs)
- **Soporte de Stripe**: [support.stripe.com](https://support.stripe.com)
- **Comunidad**: [stripe.com/community](https://stripe.com/community)

## 🔄 Actualizaciones

Mantener actualizadas las dependencias de Stripe:

```bash
npm update @stripe/stripe-js stripe
```

Revisar regularmente la [documentación de migración](https://stripe.com/docs/upgrades) para cambios importantes. 