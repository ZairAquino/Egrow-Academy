# 💳 Configuración Rápida de Stripe - eGrow Academy

## 🚀 Configuración en 5 Minutos

### 1. Crear Cuenta de Stripe
- Ve a [stripe.com](https://stripe.com) y crea una cuenta
- Completa la verificación de identidad

### 2. Obtener Claves de API
1. En el [Dashboard de Stripe](https://dashboard.stripe.com)
2. Ve a **Developers > API keys**
3. Copia las claves de prueba:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### 3. Configurar Variables de Entorno
Copia `env.example` a `.env` y agrega tus claves:

```env
STRIPE_SECRET_KEY="sk_test_tu_clave_secreta"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_tu_clave_publica"
```

### 4. Crear Productos de Ejemplo
```bash
npm run init-stripe
```

### 5. Configurar Webhook (Opcional)
Para desarrollo local, usa [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# Instalar Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 🧪 Probar Pagos

### Tarjetas de Prueba
- **Visa**: `4242424242424242`
- **Mastercard**: `5555555555554444`
- **CVC**: `123`
- **Fecha**: `12/25`

### Códigos de Error
- **Pago rechazado**: `4000000000000002`
- **Fondos insuficientes**: `4000000000009995`

## 📱 Uso en la Aplicación

### Componente de Pago
```tsx
import PaymentForm from '@/components/payments/PaymentForm';

<PaymentForm
  amount={9900} // $99.00 en centavos
  currency="usd"
  courseId="curso-123"
  description="Curso de Machine Learning"
  onSuccess={(paymentId) => console.log('¡Pago exitoso!')}
  onError={(error) => console.error('Error:', error)}
/>
```

### Crear Suscripción
```tsx
const response = await fetch('/api/stripe/create-subscription', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    priceId: 'price_1234567890',
    trialPeriodDays: 7,
  }),
});
```

## 🔧 APIs Disponibles

- `POST /api/stripe/create-payment-intent` - Pagos únicos
- `POST /api/stripe/create-subscription` - Suscripciones
- `GET /api/stripe/payment-status` - Verificar estado
- `POST /api/stripe/webhook` - Webhooks (automático)

## 📊 Monitoreo

### Dashboard de Stripe
- **Payments**: Ver todos los pagos
- **Subscriptions**: Gestionar suscripciones
- **Webhooks**: Ver eventos enviados
- **Logs**: Revisar errores

### Logs de la Aplicación
Los webhooks generan logs automáticos:
```
Webhook recibido: payment_intent.succeeded
Pago exitoso: pi_1234567890
```

## 🚀 Producción

### 1. Cambiar a Claves Live
```env
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

### 2. Configurar Webhook de Producción
- URL: `https://tu-dominio.com/api/stripe/webhook`
- Eventos: Todos los eventos de pago y suscripción

### 3. Configurar Dominio
En **Settings > Checkout settings**:
- Agregar tu dominio a dominios permitidos

## 📞 Soporte

- **Documentación**: [docs/STRIPE-SETUP.md](docs/STRIPE-SETUP.md)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Soporte**: [support.stripe.com](https://support.stripe.com)

## ✅ Checklist de Configuración

- [ ] Cuenta de Stripe creada
- [ ] Claves de API configuradas
- [ ] Variables de entorno agregadas
- [ ] Productos creados (`npm run init-stripe`)
- [ ] Webhook configurado (opcional para desarrollo)
- [ ] Pagos de prueba realizados
- [ ] Documentación revisada

¡Listo para monetizar! 🎉 