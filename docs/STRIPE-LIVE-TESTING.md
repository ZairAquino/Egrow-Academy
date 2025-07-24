# 🚀 Guía de Pruebas de Stripe Live - eGrow Academy

## 📋 Resumen de Configuración Actual

Basado en el análisis del código, tu proyecto tiene:

### ✅ **Lo que ya está configurado:**
- **Librerías de Stripe:** `stripe` y `@stripe/stripe-js` instaladas
- **APIs implementadas:** 
  - `/api/stripe/create-payment-intent` - Pagos únicos
  - `/api/stripe/create-subscription` - Suscripciones
  - `/api/stripe/webhook` - Webhooks
  - `/api/stripe/payment-status` - Verificar estado
- **Componentes:** `PaymentForm` y `SubscriptionModal`
- **Configuración:** `src/lib/stripe.ts` con todas las funciones necesarias
- **Scripts:** `init-stripe-products.ts` y `test-stripe-config.ts`

### ❌ **Lo que falta configurar:**
- **Variables de entorno** para modo live
- **Productos y precios** en Stripe
- **Webhook** configurado para producción
- **Pruebas** de funcionalidad

## 🔧 Pasos para Configurar Stripe Live

### 1. **Configurar Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL="tu-url-de-postgresql"

# JWT Secret
JWT_SECRET="tu-secreto-jwt"

# Email (Resend)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@egrowacademy.com"

# Stripe Configuration - MODO LIVE
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App Configuration
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="tu-nextauth-secret"

# UploadThing Configuration
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."
```

### 2. **Obtener Claves Live de Stripe**

1. Ve a [Dashboard de Stripe](https://dashboard.stripe.com)
2. Asegúrate de estar en **modo Live** (toggle en la esquina superior derecha)
3. Ve a **Developers > API keys**
4. Copia las claves **Live** (no las de test):
   - **Publishable key**: `pk_live_...`
   - **Secret key**: `sk_live_...`

### 3. **Crear Productos y Precios**

Ejecuta el script de inicialización:

```bash
npm run init-stripe
```

Este script creará:
- **Suscripciones:** Plan mensual ($6.99) y anual ($59.99)
- **Cursos individuales:** Desarrollo Web ($99.99), ML ($79.99), CV ($89.99), Monetización ($69.99)

### 4. **Configurar Webhook de Producción**

1. En el Dashboard de Stripe, ve a **Developers > Webhooks**
2. Haz clic en **Add endpoint**
3. URL: `https://tu-dominio.com/api/stripe/webhook`
4. Eventos a escuchar:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copia el **Signing secret** y agrégalo como `STRIPE_WEBHOOK_SECRET`

### 5. **Configurar Dominio**

En **Settings > Checkout settings**:
- Agregar tu dominio a los dominios permitidos
- Configurar métodos de pago deseados

## 🧪 Probar la Configuración

### **Paso 1: Verificar Configuración**

```bash
npm run test-stripe
```

Este comando verificará:
- ✅ Variables de entorno configuradas
- ✅ Conexión con Stripe
- ✅ Productos y precios existentes
- ✅ Modo live/test detectado

### **Paso 2: Probar en la Aplicación**

1. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

2. **Ir a la página de suscripción:**
   - URL: `http://localhost:3000/subscription`
   - O navegar desde el menú

3. **Probar suscripción:**
   - Seleccionar plan (mensual o anual)
   - Completar formulario de pago
   - Usar tarjeta real (en modo live)

### **Paso 3: Verificar Webhooks**

1. **Revisar logs del servidor** para eventos de webhook
2. **Verificar en Dashboard de Stripe** > Webhooks > Events
3. **Comprobar base de datos** para actualizaciones de usuario

## 🚨 Consideraciones para Modo Live

### **⚠️ Advertencias Importantes:**

1. **Tarjetas Reales:** En modo live, solo usar tarjetas reales
2. **Cargos Reales:** Los pagos generarán cargos reales
3. **Webhooks:** Asegurarse de que funcionen correctamente
4. **Backup:** Tener respaldo de datos antes de pruebas

### **🔒 Seguridad:**

1. **Variables de entorno:** Nunca commitear claves live
2. **HTTPS:** Usar siempre HTTPS en producción
3. **Validación:** Verificar webhook signatures
4. **Logs:** No loggear información sensible

## 📊 Monitoreo y Debugging

### **Logs a Revisar:**

```bash
# Logs del servidor Next.js
npm run dev

# Logs específicos de Stripe
# Buscar en consola: "stripe", "payment", "webhook"
```

### **Dashboard de Stripe:**

- **Payments:** Ver todos los pagos procesados
- **Subscriptions:** Gestionar suscripciones activas
- **Webhooks:** Ver eventos enviados y errores
- **Logs:** Revisar errores de API

### **Base de Datos:**

Verificar tablas:
- `users` - Campo `stripeCustomerId` y `membershipLevel`
- `subscriptions` - Suscripciones activas
- `payments` - Historial de pagos

## 🎯 Checklist de Verificación

### **Antes de Probar:**

- [ ] Variables de entorno configuradas (modo live)
- [ ] Productos y precios creados (`npm run init-stripe`)
- [ ] Webhook configurado para producción
- [ ] Dominio agregado a Stripe
- [ ] Métodos de pago habilitados

### **Durante las Pruebas:**

- [ ] Conexión con Stripe verificada (`npm run test-stripe`)
- [ ] Página de suscripción accesible
- [ ] Formulario de pago funciona
- [ ] Webhooks reciben eventos
- [ ] Base de datos se actualiza correctamente
- [ ] Usuario obtiene acceso premium

### **Después de las Pruebas:**

- [ ] Verificar acceso a cursos premium
- [ ] Comprobar facturación correcta
- [ ] Revisar logs sin errores
- [ ] Documentar cualquier problema encontrado

## 🆘 Solución de Problemas

### **Error: "Stripe no está configurado"**
```bash
# Verificar variables de entorno
npm run test-stripe
```

### **Error: "Webhook signature verification failed"**
- Verificar `STRIPE_WEBHOOK_SECRET`
- Asegurar que la URL del webhook sea correcta

### **Error: "Product not found"**
```bash
# Recrear productos
npm run init-stripe
```

### **Error: "Payment failed"**
- Verificar métodos de pago habilitados
- Comprobar configuración de monedas
- Revisar logs de Stripe para detalles

## 📞 Recursos de Ayuda

- **Documentación de Stripe:** [stripe.com/docs](https://stripe.com/docs)
- **Soporte de Stripe:** [support.stripe.com](https://support.stripe.com)
- **Dashboard de Stripe:** [dashboard.stripe.com](https://dashboard.stripe.com)
- **Documentación del proyecto:** [docs/STRIPE-SETUP.md](docs/STRIPE-SETUP.md)

---

## 🎉 ¡Listo para Monetizar!

Una vez completados todos los pasos, tu aplicación estará lista para procesar pagos reales y generar ingresos con eGrow Academy.

**¡Recuerda siempre probar primero en modo test antes de cambiar a live!** 