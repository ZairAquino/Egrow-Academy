#!/bin/bash

# Script para actualizar variables de entorno en Vercel
# Uso: bash scripts/deploy-env-vars.sh

echo "🚀 Actualizando variables de entorno en Vercel..."

# Verifica si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
fi

# Asegurar que estamos en el proyecto correcto
echo "📋 Configurando proyecto Vercel..."
vercel link --yes

# Variables de entorno requeridas para producción
echo "🔧 Configurando variables de entorno..."

# Database
vercel env add DATABASE_URL production < <(echo "postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require")

# JWT Secret
vercel env add JWT_SECRET production < <(echo "your-super-secret-jwt-key-here")

# Email (Resend)
vercel env add RESEND_API_KEY production < <(echo "re_3dBxozkz_8vtJ3EGNpGtr3C4PiAmgtU8d")
vercel env add RESEND_FROM_EMAIL production < <(echo "noreply@egrowacademy.com")

# Stripe Configuration (LIVE)
vercel env add STRIPE_SECRET_KEY production < <(echo "your-stripe-secret-key")
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production < <(echo "pk_live_51RmIsLFJoQPSn3lAfwAUTV13njPZKHSXj2V8BVgOMUTcVGNELPNLVRrRB9VaMNtB0W9PAitqaqkGUnylYhY4wq4900sSxVIFRI")
vercel env add STRIPE_WEBHOOK_SECRET production < <(echo "whsec_G08SmscdxmLyPIrwgIebrSDH4lIVoHMS")

# App Configuration
vercel env add NEXTAUTH_URL production < <(echo "https://egrowacademy.com")
vercel env add NEXTAUTH_SECRET production < <(echo "your-nextauth-secret")
vercel env add NEXT_PUBLIC_BASE_URL production < <(echo "https://egrowacademy.com")

# UploadThing Configuration
vercel env add UPLOADTHING_SECRET production < <(echo "your-uploadthing-secret")
vercel env add UPLOADTHING_APP_ID production < <(echo "3o0p1lzj4n")

echo "✅ Variables de entorno configuradas!"
echo "🔄 Ejecutando redeploy..."

# Hacer redeploy
vercel --prod

echo "🎉 ¡Despliegue completado!"
echo "🌐 Verifica tu aplicación en: https://egrowacademy.com"