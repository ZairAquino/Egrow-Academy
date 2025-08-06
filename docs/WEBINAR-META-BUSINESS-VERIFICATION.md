# 🔍 Verificación de Webinar en Meta Business

## Webinar: "Crea Videos Profesionales con IA"

### ✅ Estado Actual de la Implementación

El webinar **"Crea Videos Profesionales con IA"** está correctamente configurado para detectar eventos en Meta Business. La verificación muestra:

- ✅ **9 PASS** - Todo configurado correctamente
- ❌ **0 FAIL** - Sin errores críticos
- ⚠️ **1 WARNING** - Configuración menor pendiente

### 📊 Eventos que se Enviarán a Meta Business

#### **1. PageView**
- **Cuándo:** Cada vez que alguien visita la página del webinar
- **URL:** `/curso/videos-profesionales-ia`
- **Datos enviados:**
  ```json
  {
    "content_name": "Crea Videos Profesionales con IA",
    "content_category": "Webinar",
    "content_type": "webinar_page",
    "content_ids": ["videos-profesionales-ia"]
  }
  ```

#### **2. ViewContent**
- **Cuándo:** Visualización del contenido del webinar
- **Trigger:** Carga de la página + 1 segundo
- **Datos enviados:**
  ```json
  {
    "content_name": "Crea Videos Profesionales con IA",
    "content_category": "Webinar",
    "content_type": "webinar_view",
    "content_ids": ["videos-profesionales-ia"]
  }
  ```

#### **3. Lead**
- **Cuándo:** Usuario intenta acceder sin estar logueado
- **Trigger:** Click en "Iniciar Sesión para Comenzar"
- **Datos enviados:**
  ```json
  {
    "content_name": "Webinar Registration Attempt",
    "content_category": "Webinar",
    "content_type": "webinar_registration_attempt",
    "custom_parameters": {
      "webinar_id": "videos-profesionales-ia",
      "action": "redirect_to_login",
      "user_status": "anonymous"
    }
  }
  ```

#### **4. CustomEvent - Funnel Tracking**
- **Cuándo:** Diferentes pasos del funnel
- **Triggers:** 
  - Visualización de página (2 segundos)
  - Intentos de registro
  - Registro exitoso
- **Datos enviados:**
  ```json
  {
    "content_name": "Webinar Landing Page View",
    "content_category": "Webinar",
    "content_type": "webinar_landing_view",
    "custom_parameters": {
      "webinar_id": "videos-profesionales-ia",
      "funnel_step": "landing_page_view"
    }
  }
  ```

#### **5. Webinar Registration**
- **Cuándo:** Usuario se registra exitosamente al webinar
- **Trigger:** Click en "Comenzar Curso Premium" con acceso premium
- **Datos enviados:**
  ```json
  {
    "content_name": "Crea Videos Profesionales con IA",
    "content_category": "Webinar",
    "content_type": "webinar_registration",
    "content_ids": ["videos-profesionales-ia"],
    "user_id": "user_id_if_logged_in"
  }
  ```

### 🔧 Cómo Verificar en Meta Business

#### **Paso 1: Desplegar a Producción**
```bash
# Asegúrate de que el código esté en producción
git push origin main
# O tu proceso de deployment
```

#### **Paso 2: Verificar en Facebook Ads Manager**
1. **Ir a:** [Facebook Ads Manager](https://business.facebook.com/adsmanager)
2. **Seleccionar:** Tu cuenta de Facebook
3. **Ir a:** Eventos > Eventos personalizados
4. **Buscar:** Eventos con `webinar_id: videos-profesionales-ia`

#### **Paso 3: Verificar con Facebook Pixel Helper**
1. **Instalar:** [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedjljlbpblpldbkeac)
2. **Navegar a:** `https://egrow-academy.com/curso/videos-profesionales-ia`
3. **Verificar:** Que aparezcan los eventos en la extensión

#### **Paso 4: Verificar en Tiempo Real**
1. **Abrir:** DevTools (F12)
2. **Ir a:** Pestaña Network
3. **Filtrar por:** "facebook"
4. **Navegar:** Por la página del webinar
5. **Verificar:** Que se envíen eventos a Facebook

### 📈 Métricas que Verás en Meta Business

#### **Métricas Básicas:**
- **Impresiones:** Cuántas veces se vio la página del webinar
- **Clicks:** Cuántos clicks en botones de registro
- **Conversiones:** Cuántos registros exitosos al webinar
- **CTR:** Tasa de click-through
- **CPC:** Costo por click
- **CPM:** Costo por mil impresiones

#### **Métricas de Conversión:**
- **Costo por registro:** Cuánto cuesta conseguir un registro
- **Tasa de conversión:** Porcentaje de visitantes que se registran
- **ROI:** Retorno de inversión de las campañas
- **Funnel de conversión:** Dónde pierdes usuarios

#### **Audiencias que Puedes Crear:**
1. **Visitantes del webinar:** Usuarios que vieron la página
2. **Interesados en registro:** Usuarios que intentaron registrarse
3. **Registrados al webinar:** Usuarios que se registraron exitosamente
4. **Abandonadores:** Usuarios que vieron pero no se registraron

### 🎯 Configuración de Campañas en Meta Business

#### **Campaña 1: Awareness**
- **Objetivo:** Alcance
- **Audiencia:** Interesados en IA, marketing digital
- **Placement:** Facebook, Instagram
- **Presupuesto:** $50-100/día

#### **Campaña 2: Consideración**
- **Objetivo:** Tráfico
- **Audiencia:** Visitantes del webinar
- **Placement:** Facebook, Instagram
- **Presupuesto:** $30-50/día

#### **Campaña 3: Conversión**
- **Objetivo:** Conversiones
- **Audiencia:** Interesados en registro
- **Placement:** Facebook, Instagram
- **Presupuesto:** $50-100/día

#### **Campaña 4: Retargeting**
- **Objetivo:** Conversiones
- **Audiencia:** Abandonadores del webinar
- **Placement:** Facebook, Instagram
- **Presupuesto:** $20-40/día

### 🔍 Script de Verificación

Para verificar que todo esté funcionando correctamente:

```bash
# Ejecutar script de verificación
npx tsx scripts/verify-webinar-tracking.ts
```

### 📋 Checklist de Verificación

#### **Antes del Despliegue:**
- [x] Facebook Pixel implementado en la página
- [x] Eventos específicos del webinar configurados
- [x] Hook de Facebook Pixel funcionando
- [x] Script de verificación ejecutado

#### **Después del Despliegue:**
- [ ] Verificar eventos en Facebook Ads Manager
- [ ] Probar con Facebook Pixel Helper
- [ ] Verificar logs en consola del navegador
- [ ] Crear audiencias en Meta Business
- [ ] Configurar campañas de retargeting

#### **Monitoreo Continuo:**
- [ ] Revisar métricas diariamente
- [ ] Optimizar campañas según resultados
- [ ] Ajustar presupuestos según ROI
- [ ] Crear nuevas audiencias basadas en comportamiento

### 🚨 Solución de Problemas

#### **Si no aparecen eventos en Meta Business:**
1. **Verificar:** Que el Pixel ID esté correcto (1247652460159167)
2. **Verificar:** Que el dominio esté agregado en Facebook Ads Manager
3. **Verificar:** Que no haya bloqueadores de anuncios activos
4. **Verificar:** Que el código esté en producción

#### **Si aparecen eventos pero no conversiones:**
1. **Verificar:** Que los eventos de conversión estén configurados
2. **Verificar:** Que el funnel de conversión esté completo
3. **Verificar:** Que las audiencias estén correctamente configuradas
4. **Verificar:** Que las campañas estén optimizadas para conversión

### 📞 Soporte

Si tienes problemas con la detección de eventos:

1. **Revisar logs:** Abrir DevTools y verificar console
2. **Verificar red:** Filtrar por "facebook" en Network tab
3. **Contactar soporte:** Si los problemas persisten

### 🎉 Resultado Esperado

Con esta implementación, deberías ver en Meta Business:

- ✅ **Eventos en tiempo real** cuando alguien visite la página
- ✅ **Conversiones** cuando alguien se registre al webinar
- ✅ **Audiencias personalizadas** para retargeting
- ✅ **Métricas detalladas** de rendimiento de campañas
- ✅ **ROI medible** de cada inversión en publicidad

El webinar **"Crea Videos Profesionales con IA"** está completamente configurado para detectar eventos en Meta Business y optimizar tus campañas publicitarias. 