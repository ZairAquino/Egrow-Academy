# 🚀 Configuración del Sistema de Suscripciones con Stripe

## 📋 Resumen del Sistema

El sistema de suscripciones de eGrow Academy permite a los usuarios acceder a cursos premium mediante suscripciones mensuales o anuales. Utiliza Stripe como pasarela de pagos y maneja automáticamente la verificación de acceso a cursos.

## 🏗️ Arquitectura del Sistema

### Componentes Principales
- **Frontend**: Páginas de suscripción y verificación de acceso
- **Backend**: APIs para manejo de suscripciones y verificación
- **Base de Datos**: Modelos de User, Subscription, Product, Price
- **Stripe**: Pasarela de pagos y webhooks

### Flujo de Suscripción
1. Usuario selecciona plan en `/subscription`
2. Se crea Checkout Session en Stripe
3. Usuario completa pago en Stripe
4. Webhook actualiza estado en base de datos
5. Usuario obtiene acceso automático a cursos premium

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Crear archivo `.env.local` con las siguientes variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3001
DATABASE_URL=postgresql://...
```

### 2. Configurar Stripe Dashboard

#### Crear Productos y Precios
1. Ir a [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navegar a **Products** → **Add Product**
3. Crear dos productos:
   - **eGrow Academy - Suscripción Mensual**
   - **eGrow Academy - Suscripción Anual**

#### Configurar Webhook
1. Ir a **Developers** → **Webhooks**
2. Agregar endpoint: `https://tu-dominio.com/api/stripe/webhook`
3. Seleccionar eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 3. Ejecutar Scripts de Configuración

```bash
# Configurar productos y precios en la base de datos
npx tsx scripts/setup-stripe-products.ts

# Simular suscripción para pruebas
npx tsx scripts/simulate-subscription.ts
```

## 🧪 Pruebas del Sistema

### Tarjetas de Prueba de Stripe

```bash
# Tarjeta exitosa
4242 4242 4242 4242

# Tarjeta que requiere autenticación
4000 0025 0000 3155

# Tarjeta que falla
4000 0000 0000 0002
```

### Flujo de Prueba
1. **Registrar usuario** en la plataforma
2. **Ir a página de suscripción** (`/subscription`)
3. **Seleccionar plan** (mensual o anual)
4. **Completar pago** con tarjeta de prueba
5. **Verificar acceso** a cursos premium
6. **Probar inscripción** en curso de desarrollo web

### Scripts de Prueba

```bash
# Simular suscripción activa
npx tsx scripts/simulate-subscription.ts

# Limpiar datos de prueba
npx tsx scripts/clean-test-subscriptions.ts
```

## 📁 Estructura de Archivos

### APIs
```
src/app/api/
├── auth/subscription-status/route.ts    # Verificar estado de suscripción
├── courses/[slug]/access/route.ts       # Verificar acceso a curso
├── stripe/
│   ├── create-checkout-session/route.ts # Crear sesión de pago
│   └── webhook/route.ts                 # Manejar webhooks
```

### Componentes
```
src/components/
├── payments/
│   ├── PaymentForm.tsx
│   ├── SubscriptionButton.tsx
│   └── SubscriptionModal.tsx
```

### Hooks
```
src/hooks/
├── useSubscriptionAccess.ts             # Hook para verificar suscripción
└── useCourseAccess.ts                   # Hook para verificar acceso a curso
```

### Páginas
```
src/app/
├── subscription/page.tsx                # Página de suscripción
├── payment/success/page.tsx             # Página de éxito
└── curso/desarrollo-web-fullstack/      # Curso premium de ejemplo
```

## 🔐 Verificación de Acceso

### Hook de Suscripción
```typescript
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

const { hasActiveSubscription, isLoading } = useSubscriptionAccess();
```

### Hook de Acceso a Curso
```typescript
import { useCourseAccess } from '@/hooks/useCourseAccess';

const { hasAccess, isLoading } = useCourseAccess('desarrollo-web-fullstack');
```

### API de Verificación
```typescript
// Verificar suscripción
GET /api/auth/subscription-status

// Verificar acceso a curso
GET /api/courses/[slug]/access
```

## 🎯 Estados de Suscripción

### En Base de Datos
- `ACTIVE`: Suscripción activa y pagada
- `CANCELED`: Suscripción cancelada
- `INCOMPLETE`: Pago pendiente
- `PAST_DUE`: Pago vencido
- `TRIALING`: En período de prueba

### En Frontend
- `hasActiveSubscription`: Boolean
- `subscriptionType`: 'monthly' | 'yearly'
- `currentPeriodEnd`: Fecha de expiración

## 🚨 Manejo de Errores

### Errores Comunes
1. **Token inválido**: Usuario no autenticado
2. **Suscripción expirada**: Renovar suscripción
3. **Pago fallido**: Verificar método de pago
4. **Webhook no configurado**: Configurar en Stripe Dashboard

### Logs de Debug
```bash
# Ver logs del servidor
npm run dev

# Ver logs de webhook
tail -f logs/stripe-webhook.log
```

## 🔄 Mantenimiento

### Actualizar Precios
1. Modificar en Stripe Dashboard
2. Ejecutar script de configuración
3. Actualizar constantes en `src/lib/stripe.ts`

### Limpiar Datos de Prueba
```bash
npx tsx scripts/clean-test-subscriptions.ts
```

### Backup de Suscripciones
```sql
-- Exportar suscripciones activas
SELECT * FROM subscriptions WHERE status = 'ACTIVE';
```

## 📞 Soporte

### Problemas Comunes
1. **Webhook no funciona**: Verificar URL y secret
2. **Acceso denegado**: Verificar suscripción activa
3. **Pago fallido**: Usar tarjetas de prueba correctas

### Recursos
- [Documentación de Stripe](https://stripe.com/docs)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)
- [API Reference](https://stripe.com/docs/api)

---

**Nota**: Este sistema está configurado para desarrollo. Para producción, cambiar a claves de Stripe en modo live y configurar webhooks con HTTPS. 