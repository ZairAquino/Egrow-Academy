# Configuración de Variables de Entorno en Vercel

## 🚨 Variables Faltantes Críticas

Las siguientes variables faltan en producción, causando errores en el checkout:
- **`RESEND_FROM_EMAIL`** - Requerida para envío de emails
- **`NEXT_PUBLIC_BASE_URL`** - Requerida para URLs de redirección de Stripe

## 📋 Pasos para Configurar en Vercel Dashboard

1. **Ve a Vercel Dashboard**: https://vercel.com/dashboard
2. **Selecciona tu proyecto**: `Egrow-Academy`
3. **Ve a Settings** → **Environment Variables**
4. **Agrega la variable faltante**:

### Variables Críticas Faltantes:
```
RESEND_FROM_EMAIL = noreply@egrowacademy.com
NEXT_PUBLIC_BASE_URL = https://egrowacademy.com
```

### Variables Completas de Producción:

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Email (Resend)
RESEND_API_KEY=re_3dBxozkz_8vtJ3EGNpGtr3C4PiAmgtU8d
RESEND_FROM_EMAIL=noreply@egrowacademy.com

# Stripe Configuration (LIVE)
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RmIsLFJoQPSn3lAfwAUTV13njPZKHSXj2V8BVgOMUTcVGNELPNLVRrRB9VaMNtB0W9PAitqaqkGUnylYhY4wq4900sSxVIFRI
STRIPE_WEBHOOK_SECRET=whsec_G08SmscdxmLyPIrwgIebrSDH4lIVoHMS

# App Configuration
NEXTAUTH_URL=https://egrowacademy.com
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_BASE_URL=https://egrowacademy.com

# UploadThing Configuration
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=3o0p1lzj4n
```

## 🔄 Después de Agregar Variables

1. **Redeploy el proyecto** en Vercel
2. **Verifica en los logs** si hay errores
3. **Prueba el flujo de suscripción** en producción

## 🎯 Solución Rápida

**Solo necesitas agregar `RESEND_FROM_EMAIL=noreply@egrowacademy.com` y hacer redeploy.**

## 🔍 Verificación

Después del deploy, verifica que funcione:
- Ve a https://egrowacademy.com/subscription
- Inicia sesión como usuario válido
- Intenta seleccionar el plan mensual
- Debería redirigir a Stripe sin errores

## 🎯 Causa del Error

El error "Internal Server Error" en el checkout se debe a:
1. **Variable faltante**: `RESEND_FROM_EMAIL` no está configurada en producción
2. **Variable faltante**: `NEXT_PUBLIC_BASE_URL` no está configurada en producción
3. Sin estas variables, el endpoint `/api/stripe/create-checkout-session` falla

## ✅ Solución Confirmada

Una vez agregadas ambas variables y redeployado, el error debería resolverse completamente.