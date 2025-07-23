# Configuración de Dominio en Resend

## 🎯 Objetivo
Configurar un dominio verificado en Resend para poder enviar emails a cualquier dirección de correo electrónico.

## 📋 Pasos para Configurar Dominio

### 1. Acceder a Resend Dashboard
1. Ve a [resend.com](https://resend.com)
2. Inicia sesión con tu cuenta
3. Ve a la sección **Domains**

### 2. Agregar Dominio
1. Haz clic en **"Add Domain"**
2. Ingresa tu dominio (ej: `egrowacademy.com`)
3. Haz clic en **"Add Domain"**

### 3. Configurar Registros DNS
Resend te proporcionará registros DNS que debes agregar a tu proveedor de dominio:

#### Registros TXT para verificación:
```
TXT | @ | resend-verification=abc123...
```

#### Registros MX para recibir emails:
```
MX | @ | 10 | inbound.resend.com
```

#### Registros SPF para autenticación:
```
TXT | @ | v=spf1 include:spf.resend.com ~all
```

#### Registros DKIM para firma digital:
```
TXT | resend._domainkey | v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
```

### 4. Verificar Dominio
1. Agrega todos los registros DNS en tu proveedor de dominio
2. Espera 24-48 horas para que se propaguen los cambios
3. Regresa a Resend y haz clic en **"Verify Domain"**

### 5. Configurar Variables de Entorno
Una vez verificado el dominio, actualiza tu archivo `.env.local`:

```env
# Email (Resend)
RESEND_API_KEY="re_tu_api_key_aqui"
RESEND_FROM_EMAIL="noreply@egrowacademy.com"
```

## 🔧 Configuración por Entorno

### Desarrollo
- Usa `onboarding@resend.dev` (solo para emails de prueba)
- Solo funciona con tu email personal

### Producción
- Usa tu dominio verificado (ej: `noreply@egrowacademy.com`)
- Funciona con cualquier dirección de email

## 🚀 Probar Configuración

### 1. Verificar en Consola
```bash
npm run dev
```

### 2. Crear Usuario de Prueba
1. Ve a `/register`
2. Completa el formulario
3. Verifica que el email se envíe correctamente

### 3. Verificar Logs
En la consola del servidor deberías ver:
```
✅ [EMAIL] Email de verificación enviado exitosamente a: usuario@ejemplo.com
```

## ❌ Solución de Problemas

### Error: "You can only send testing emails to your own email address"
**Causa:** Dominio no verificado o usando dominio de prueba
**Solución:** 
1. Verificar que el dominio esté configurado correctamente
2. Asegurar que `RESEND_FROM_EMAIL` use tu dominio verificado

### Error: "Domain not verified"
**Causa:** Registros DNS no configurados correctamente
**Solución:**
1. Verificar que todos los registros DNS estén agregados
2. Esperar 24-48 horas para propagación
3. Verificar dominio nuevamente en Resend

### Error: "Invalid API key"
**Causa:** API key incorrecta o expirada
**Solución:**
1. Generar nueva API key en Resend
2. Actualizar `RESEND_API_KEY` en variables de entorno

## 📞 Soporte
- [Documentación oficial de Resend](https://resend.com/docs)
- [Guía de configuración de dominios](https://resend.com/docs/domains)
- [Soporte técnico de Resend](https://resend.com/support) 