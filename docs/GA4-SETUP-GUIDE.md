# 🎯 Guía de Configuración Google Analytics 4 - eGrow Academy

## 📋 RESUMEN RÁPIDO

| ✅ COMPLETADO | 🔄 PENDIENTE |
|---------------|--------------|
| Propiedad GA4 creada | Configurar variables de entorno |
| ID de medición obtenido | Iniciar servidor de desarrollo |
| Componentes configurados | Verificar en tiempo real |
| Eventos personalizados listos | Configurar conversiones |

---

## 🆔 TU CONFIGURACIÓN ACTUAL

```
🌐 Sitio Web: https://egrowacademy.com
📊 Propiedad GA4: eGrow Academy Web
🔑 ID de Medición: G-RSHD1HL9R0
📈 Stream ID: 11539759153
```

---

## 🚀 PASOS PARA ACTIVAR GA4

### PASO 1: Configurar Variables de Entorno

**Archivo a editar:** `.env.local`

**Agregar estas líneas:**
```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID="G-RSHD1HL9R0"
GOOGLE_ANALYTICS_ID="G-RSHD1HL9R0"
```

### PASO 2: Iniciar Servidor

**Comando en terminal:**
```bash
npm run dev
```

### PASO 3: Verificar Funcionamiento

**En tu navegador:**
1. Abre http://localhost:3000
2. Presiona F12 (DevTools)
3. Ve a pestaña "Console"
4. Busca mensajes de Google Analytics

**En Google Analytics:**
1. Ve a https://analytics.google.com/
2. Selecciona "eGrow Academy Web"
3. Ve a "Informes" → "Tiempo real"
4. Navega por tu sitio web
5. Deberías ver actividad en tiempo real

---

## 📊 EVENTOS CONFIGURADOS

### 🎓 Eventos de Cursos
- `course_view` - Ver un curso
- `course_enroll` - Inscribirse a curso
- `course_complete` - Completar curso
- `lesson_view` - Ver lección
- `video_play` - Reproducir video

### 💰 Eventos de Conversión
- `subscription_start` - Iniciar suscripción
- `payment_complete` - Completar pago
- `user_register` - Registrarse
- `user_login` - Iniciar sesión

### 🎯 Eventos de Engagement
- `cta_click` - Clic en botones
- `scroll_depth` - Scroll en página
- `time_on_page` - Tiempo en página

---

## 🔍 VERIFICACIÓN PASO A PASO

### ✅ Verificación 1: Variables de Entorno
```bash
node scripts/test-ga4.ts
```
**Resultado esperado:** ✅ ID de GA4 encontrado

### ✅ Verificación 2: Servidor Funcionando
```bash
npm run dev
```
**Resultado esperado:** Servidor corriendo en http://localhost:3000

### ✅ Verificación 3: Analytics Cargando
1. Abre http://localhost:3000
2. F12 → Console
3. Busca: "Google Analytics loaded"

### ✅ Verificación 4: Eventos Enviándose
1. Haz clic en un curso
2. Ve a GA4 → Tiempo real
3. Deberías ver: `course_view`

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE ACTIVAR

### 1. Configurar Conversiones
En Google Analytics:
- Ir a "Configurar" → "Eventos"
- Marcar como conversión:
  - `subscription_start`
  - `payment_complete`
  - `user_register`

### 2. Crear Audiencias
- Usuarios que vieron cursos
- Usuarios que se registraron
- Usuarios que pagaron

### 3. Configurar Informes
- Informe de conversiones
- Informe de engagement
- Informe de cursos populares

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### ❌ No veo datos en tiempo real
**Solución:**
1. Verifica que `.env.local` tenga el ID correcto
2. Reinicia el servidor: `npm run dev`
3. Limpia caché del navegador
4. Verifica que no haya bloqueadores de anuncios

### ❌ Errores en consola
**Solución:**
1. Verifica que el ID comience con "G-"
2. Asegúrate de que Analytics.tsx esté en layout.tsx
3. Revisa que useAnalytics.ts esté importado

### ❌ Eventos no aparecen
**Solución:**
1. Verifica que los componentes usen el hook useAnalytics
2. Asegúrate de que los eventos se llamen correctamente
3. Revisa la consola para errores de JavaScript

---

## 📞 CONTACTO Y SOPORTE

**Documentación generada:**
- `docs/ga4-configuration.md` - Configuración detallada
- `docs/ga4-verification.md` - Verificación paso a paso
- `scripts/test-ga4.ts` - Script de verificación automática

**Comandos útiles:**
```bash
# Verificar configuración
node scripts/test-ga4.ts

# Análisis SEO completo
npm run seo-analysis

# Medir Core Web Vitals
npm run measure-cwv
```

---

**🎉 ¡Tu Google Analytics 4 está listo para trackear el éxito de eGrow Academy!** 