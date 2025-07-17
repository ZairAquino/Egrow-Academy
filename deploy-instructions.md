# Instrucciones para Deploy en Vercel

## 1. Preparación del proyecto

### Variables de entorno requeridas en Vercel:
- `DATABASE_URL`: postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
- `JWT_SECRET`: 2b02440516c29043661288c1aed90bd89fdd5b8e884651e8d5664f8233a48648
- `RESEND_API_KEY`: re_7To7BCjq_YcyPK4VsUHeESkvk64cAKKpSre_7To7BCjq_YcyPK4VsUHeESkvk64cAKKpS
- `RESEND_FROM_EMAIL`: noreply@egrow-academy.com
- `NEXTAUTH_SECRET`: 2b02440516c29043661288c1aed90bd89fdd5b8e884651e8d5664f8233a48648
- `NEXTAUTH_URL`: https://tu-dominio.vercel.app (actualizar con el dominio real)
- `GOOGLE_CLIENT_ID`: (necesita ser actualizado con el ID real de Google Console)
- `GOOGLE_CLIENT_SECRET`: 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

## 2. Configuración en Google Console

Una vez que tengas el dominio de Vercel, configurar en Google Console:

### Authorized JavaScript origins:
- https://tu-dominio.vercel.app

### Authorized redirect URIs:
- https://tu-dominio.vercel.app/api/auth/callback/google

## 3. Pasos para deploy

1. **Conectar repositorio a Vercel**
   - Ir a https://vercel.com
   - Importar proyecto desde GitHub
   - Seleccionar este repositorio

2. **Configurar variables de entorno**
   - En el dashboard de Vercel, ir a Settings > Environment Variables
   - Agregar todas las variables listadas arriba

3. **Deploy**
   - Vercel automáticamente detectará que es un proyecto Next.js
   - El build se ejecutará automáticamente

## 4. Después del deploy

1. **Actualizar NEXTAUTH_URL**
   - Obtener la URL del deploy (ej: https://egrow-academy.vercel.app)
   - Actualizar la variable `NEXTAUTH_URL` en Vercel

2. **Actualizar Google Console**
   - Agregar el dominio real a las URLs autorizadas
   - Actualizar `GOOGLE_CLIENT_ID` si es necesario

3. **Probar login de Google**
   - Ir a https://tu-dominio.vercel.app/login
   - Probar el botón "Continuar con Google"
   - Verificar que funcione con luisdavid.ls47@gmail.com

## 5. Usuario de prueba

El usuario Luis Solis (luisdavid.ls47@gmail.com) ya existe en la base de datos Neon y se vinculará automáticamente con Google OAuth al hacer login por primera vez.