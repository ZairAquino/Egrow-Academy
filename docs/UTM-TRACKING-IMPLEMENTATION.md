# 🚀 Sistema de Tracking UTM - Egrow Academy

## 📋 Resumen

El sistema de tracking UTM implementado permite rastrear campañas publicitarias en múltiples plataformas (LinkedIn, Meta, Google Ads, TikTok) con eventos automáticos en Google Analytics 4.

## 🎯 Características Principales

- ✅ **Tracking automático** de parámetros UTM
- ✅ **Eventos GA4** automáticos para conversiones
- ✅ **Dashboard de administración** en `/admin/utm-analytics`
- ✅ **URLs optimizadas** para cada plataforma publicitaria
- ✅ **Session persistence** de datos UTM
- ✅ **Debug panel** para verificar parámetros

## 📁 Estructura de Archivos

### Archivos Principales
```
src/lib/utm-tracking.ts              # Sistema core de tracking UTM
src/components/analytics/UTMTracker.tsx  # Componente tracker
src/app/admin/utm-analytics/page.tsx     # Dashboard de administración
scripts/test-utm-tracking.ts             # Script de testing
docs/UTM-TRACKING-IMPLEMENTATION.md      # Esta documentación
```

### Archivos Modificados
```
src/lib/social-tracking.ts          # URLs UTM para campaña
src/app/layout.tsx                   # Integración del tracker
package.json                         # Script de test
```

## 🔧 URLs de Campaña Generadas

### LinkedIn (CPC)
```
https://egrowacademy.com/curso/monetiza-voz-ia-elevenlabs?utm_source=linkedin&utm_medium=cpc&utm_campaign=curso_lanzamiento_2025
```

### Meta/Facebook (Paid Social)
```
https://egrowacademy.com/curso/monetiza-voz-ia-elevenlabs?utm_source=meta&utm_medium=paid_social&utm_campaign=curso_lanzamiento_2025
```

### Google Ads (CPC)
```
https://egrowacademy.com/curso/monetiza-voz-ia-elevenlabs?utm_source=google&utm_medium=cpc&utm_campaign=curso_lanzamiento_2025
```

### TikTok (Paid Social)
```
https://egrowacademy.com/curso/monetiza-voz-ia-elevenlabs?utm_source=tiktok&utm_medium=paid_social&utm_campaign=curso_lanzamiento_2025
```

## 📊 Eventos Trackeados

### 1. UTM Arrival
- **Evento**: `utm_arrival`
- **Trigger**: Cuando se detectan parámetros UTM
- **Datos**: UTM params + referrer + user agent

### 2. UTM Page View
- **Evento**: `utm_pageview`
- **Trigger**: Cada cambio de página con UTM
- **Datos**: UTM params + page title + page URL

### 3. Course View
- **Evento**: `utm_conversion` (type: course_view)
- **Trigger**: Vista de página del curso
- **Datos**: UTM params + course_id + course_name

### 4. Course Enrollment
- **Evento**: `utm_conversion` (type: course_enroll)
- **Trigger**: Inscripción al curso
- **Datos**: UTM params + value + currency

### 5. Payment
- **Evento**: `utm_conversion` (type: payment) + `purchase`
- **Trigger**: Pago completado
- **Datos**: UTM params + transaction details

## 🎛️ Dashboard de Administración

### Acceso
```
https://egrowacademy.com/admin/utm-analytics
```

### Funcionalidades
- 📊 **Estadísticas en tiempo real** de URLs UTM
- 🔗 **Listado completo** de URLs por plataforma
- 📋 **Botón de copia** para cada URL
- 🧪 **Botón de test** para probar URLs
- 🎯 **Parámetros UTM detectados** actualmente
- ✅ **Estado del sistema** de tracking

## 🧪 Testing y Verificación

### Script de Testing
```bash
npm run test-utm-tracking
```

### Verificaciones Automáticas
- ✅ Parámetros UTM obligatorios presentes
- ✅ utm_source coincide con plataforma
- ✅ utm_medium correcto por plataforma
- ✅ utm_campaign correcto
- ✅ URLs válidas y accesibles

### Testing Manual
1. Ejecutar: `npm run test-utm-tracking`
2. Copiar una URL UTM del output
3. Abrirla en el navegador
4. Verificar eventos en GA4 Debug View
5. Comprobar parámetros en el dashboard

## 📈 Configuración de Google Analytics 4

### Variables de Entorno Requeridas
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### Custom Parameters en GA4
- `custom_parameter_1`: utm_source
- `custom_parameter_2`: utm_medium  
- `custom_parameter_3`: utm_campaign
- `custom_parameter_4`: utm_content
- `custom_parameter_5`: utm_term

## 🔧 API del Sistema

### Funciones Principales

#### `initializeUTMTracking()`
Inicializa el tracking UTM en cada carga de página.

#### `trackUTMConversion(conversionData, utmData)`
Trackea eventos de conversión con parámetros UTM.

#### `getStoredUTMData()`
Obtiene datos UTM guardados en sessionStorage.

#### `getAllCourseLaunchUrls()`
Retorna todas las URLs UTM para la campaña.

### Funciones Globales (Disponibles en window)
```javascript
// Trackear vista de curso
window.trackUTMCourseView('course-id', 'Course Name');

// Trackear inscripción
window.trackUTMCourseEnroll('course-id', 'Course Name', 97);

// Trackear pago
window.trackUTMPayment('course-id', 'Course Name', 97);
```

## 🚀 Uso en Campañas Publicitarias

### LinkedIn Ads
- **Medium**: `cpc`
- **Tipo**: LinkedIn Ads Manager
- **Objetivo**: Professionals interesados en IA

### Meta Ads (Facebook/Instagram)
- **Medium**: `paid_social`
- **Tipo**: Facebook Ads Manager
- **Objetivo**: Audiencia de contenido de IA

### Google Ads
- **Medium**: `cpc`
- **Tipo**: Google Ads (Search/Display)
- **Objetivo**: Keywords relacionadas con IA

### TikTok Ads
- **Medium**: `paid_social`
- **Tipo**: TikTok Ads Manager
- **Objetivo**: Audiencia joven interesada en IA

## 🔍 Debugging

### Console Logs
El sistema genera logs detallados:
```
📊 [UTM Tracking] Parámetros detectados: {...}
📊 [GA4 UTM] Evento enviado: utm_arrival
💰 [GA4 UTM] Conversión trackeada: course_view
```

### Session Storage
Los parámetros UTM se guardan automáticamente:
```javascript
sessionStorage.getItem('utm_data')
```

### Debug View en GA4
1. Ir a GA4 > Configure > DebugView
2. Habilitar debug mode
3. Probar URLs UTM
4. Verificar eventos en tiempo real

## 🔐 Seguridad y Privacidad

- ✅ **Solo tracking de marketing** (no datos personales)
- ✅ **Cumple con GDPR** (datos de marketing legítimo)
- ✅ **Session storage** (no persistencia permanente)
- ✅ **Parámetros públicos** en URLs (no información sensible)

## 📝 Mantenimiento

### Monitoreo Regular
1. Verificar dashboard mensualmente
2. Revisar eventos en GA4
3. Validar URLs con script de test
4. Actualizar campaña según resultados

### Actualizaciones
- Para nuevas campañas: actualizar `COURSE_LAUNCH_UTM_URLS`
- Para nuevas plataformas: añadir en configuración
- Para nuevos eventos: extender `UTMConversionData`

## 🎉 Estado del Sistema

✅ **Implementación Completa**  
✅ **Testing Verificado**  
✅ **Documentación Actualizada**  
✅ **Dashboard Funcional**  
✅ **URLs Generadas**  
✅ **GA4 Configurado**  

**¡Sistema listo para la campaña de lanzamiento "Monetiza tu Voz con IA"!**

---

**Fecha de Implementación**: Enero 2025  
**Versión**: 1.0  
**Estado**: ✅ Activo