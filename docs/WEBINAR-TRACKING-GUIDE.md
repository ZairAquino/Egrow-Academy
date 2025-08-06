# Webinar Tracking Guide - "Aprende a crear videos profesionales con IA"

## 📊 Estado del Tracking

### ✅ Configuración Implementada
- **Webinar ID:** `videos-profesionales-ia`
- **Webinar Name:** "Aprende a crear videos profesionales con IA"
- **Meta Pixel ID:** `1247652460159167`
- **Componente específico:** `WebinarVideoIATracker`
- **Hook personalizado:** `useWebinarVideoIATracker`

### 🔧 Archivos Modificados
1. **`src/components/analytics/WebinarVideoIATracker.tsx`** - Tracker específico del webinar
2. **`src/app/webinar/videos-profesionales-ia/page.tsx`** - Página del webinar con tracking
3. **`src/components/webinar/WebinarRegistrationForm.tsx`** - Formulario con tracking
4. **`scripts/verify-webinar-tracking.ts`** - Script de verificación

## 🎯 Eventos Configurados

### 1. Eventos Automáticos
- **PageView:** Se ejecuta automáticamente cuando un usuario autenticado visita la página
- **ViewContent:** Se ejecuta cuando se visualiza el contenido del webinar
- **Lead:** Se ejecuta cuando un usuario se registra al webinar

### 2. Eventos de Engagement
- **scroll_25:** Cuando el usuario hace scroll del 25% de la página
- **scroll_50:** Cuando el usuario hace scroll del 50% de la página
- **scroll_75:** Cuando el usuario hace scroll del 75% de la página
- **time_30s:** Cuando el usuario pasa 30 segundos en la página
- **time_60s:** Cuando el usuario pasa 60 segundos en la página
- **time_120s:** Cuando el usuario pasa 120 segundos en la página
- **registration_success:** Cuando el registro al webinar es exitoso

## 👤 Metadatos del Usuario

### Información Personal
- `user_id`: ID único del usuario
- `user_email`: Email del usuario
- `user_first_name`: Nombre del usuario
- `user_last_name`: Apellido del usuario
- `user_username`: Nombre de usuario (si existe)
- `user_bio`: Biografía del usuario (si existe)
- `user_profile_image`: Imagen de perfil (si existe)

### Información de Membresía
- `user_membership_level`: Nivel de membresía (FREE/PREMIUM)
- `user_has_been_premium`: Si alguna vez fue premium
- `user_stripe_customer_id`: ID de cliente en Stripe (si existe)

### Información de Actividad
- `user_created_at`: Fecha de creación de la cuenta
- `user_last_login`: Último login del usuario
- `user_is_active`: Si la cuenta está activa
- `user_email_verified`: Si el email está verificado
- `user_country`: País del usuario (si especificado)

## 📈 Eventos Específicos del Webinar

### PageView Event
```javascript
{
  content_name: "Aprende a crear videos profesionales con IA",
  content_category: "Webinar",
  content_type: "webinar_landing_page",
  content_ids: ["videos-profesionales-ia"],
  user_id: "user_id",
  custom_parameters: {
    // Todos los metadatos del usuario
    webinar_id: "videos-profesionales-ia",
    webinar_type: "ia_video_creation",
    webinar_category: "Marketing Digital",
    webinar_duration: "90 minutos",
    webinar_level: "Principiante",
    funnel_step: "landing_page_view",
    page_url: "https://egrow-academy.com/webinar/videos-profesionales-ia",
    timestamp: "2025-01-27T...",
    session_id: "abc123..."
  }
}
```

### Lead Event (Registro)
```javascript
{
  content_name: "Aprende a crear videos profesionales con IA",
  content_category: "Webinar",
  content_type: "webinar_registration",
  content_ids: ["videos-profesionales-ia"],
  user_id: "user_id",
  custom_parameters: {
    // Todos los metadatos del usuario
    webinar_id: "videos-profesionales-ia",
    webinar_type: "ia_video_creation",
    webinar_category: "Marketing Digital",
    webinar_duration: "90 minutos",
    webinar_level: "Principiante",
    funnel_step: "registration_completed",
    registration_method: "form_submission",
    registration_timestamp: "2025-01-27T...",
    session_id: "abc123..."
  }
}
```

### CustomEvent (Engagement)
```javascript
{
  content_name: "Aprende a crear videos profesionales con IA",
  content_category: "Webinar",
  content_type: "webinar_engagement_type",
  content_ids: ["videos-profesionales-ia"],
  user_id: "user_id",
  custom_parameters: {
    // Todos los metadatos del usuario
    webinar_id: "videos-profesionales-ia",
    webinar_type: "ia_video_creation",
    webinar_category: "Marketing Digital",
    engagement_type: "scroll_50",
    engagement_timestamp: "2025-01-27T...",
    session_id: "abc123...",
    // Datos adicionales específicos del evento
    scroll_percentage: 50
  }
}
```

## 🧪 Verificación del Tracking

### 1. Verificación Local
```bash
# Ejecutar script de verificación
npx tsx scripts/verify-webinar-tracking.ts
```

### 2. Verificación en Navegador
1. Ir a: `http://localhost:3000/webinar/videos-profesionales-ia`
2. Abrir DevTools (F12)
3. Ir a la pestaña "Console"
4. Buscar mensajes:
   - `📊 [Facebook Pixel] Evento enviado: ViewContent`
   - `📊 [Webinar Video IA] PageView tracked with full user metadata`
   - `📊 [Webinar Video IA] Registration tracked with full user metadata`

### 3. Verificación en Facebook Business Manager
1. Ir a: https://business.facebook.com/events_manager2
2. Seleccionar el pixel: `1247652460159167`
3. Ir a "Eventos" para ver eventos en tiempo real
4. Verificar que aparezcan los eventos:
   - ViewContent (webinar landing page)
   - Lead (registro al webinar)
   - CustomEvent (engagement)

## 🎯 Uso en Componentes

### En la Página del Webinar
```tsx
import WebinarVideoIATracker from '@/components/analytics/WebinarVideoIATracker';

export default function WebinarPage() {
  return (
    <>
      {/* Contenido del webinar */}
      
      {/* Tracking específico */}
      <WebinarVideoIATracker
        webinarId="videos-profesionales-ia"
        webinarName="Aprende a crear videos profesionales con IA"
        trackPageView={true}
        trackRegistration={true}
        trackEngagement={true}
      />
    </>
  );
}
```

### En el Formulario de Registro
```tsx
import { useWebinarVideoIATracker } from '@/components/analytics/WebinarVideoIATracker';

export default function RegistrationForm() {
  const { trackRegistration, trackEngagement } = useWebinarVideoIATracker();
  
  const handleRegistrationSuccess = () => {
    trackRegistration();
    trackEngagement('registration_success', {
      registration_method: 'form_submission',
      webinar_details: {
        id: webinar.id,
        title: webinar.title,
        duration: webinar.duration
      }
    });
  };
  
  return (
    // Formulario de registro
  );
}
```

## 📊 Métricas Disponibles

### En Facebook Business Manager
- **Impresiones de la página del webinar**
- **Clicks en botones de registro**
- **Conversiones de registro al webinar**
- **Costo por registro al webinar**
- **ROI de campañas del webinar**

### En Google Analytics
- **Page Views de la página del webinar**
- **Tiempo en página**
- **Tasa de rebote**
- **Fuentes de tráfico**
- **Comportamiento del usuario**

## 🚨 Troubleshooting

### Problemas Comunes
1. **Eventos no aparecen en Facebook:**
   - Verificar que el usuario esté autenticado
   - Verificar que el Meta Pixel esté cargado
   - Verificar bloqueadores de anuncios

2. **Metadatos incompletos:**
   - Verificar que el usuario tenga todos los campos
   - Verificar que el hook esté funcionando correctamente

3. **Eventos duplicados:**
   - Verificar que el tracking no se ejecute múltiples veces
   - Verificar el estado de los flags de tracking

### Soluciones
1. **Deshabilitar bloqueadores:** Para testing
2. **Verificar logs:** Usar el componente de prueba
3. **Revisar consola:** Verificar mensajes de error

## 📋 Checklist de Verificación

### ✅ Configuración Básica
- [x] Meta Pixel configurado en layout.tsx
- [x] ID del pixel correcto: 1247652460159167
- [x] Componente WebinarVideoIATracker creado
- [x] Hook useWebinarVideoIATracker implementado

### ✅ Eventos Configurados
- [x] PageView automático
- [x] ViewContent en landing page
- [x] Lead en registro
- [x] CustomEvent para engagement

### ✅ Metadatos del Usuario
- [x] Información personal completa
- [x] Información de membresía
- [x] Información de actividad
- [x] Información de pagos

### ✅ Verificación en Producción
- [x] Eventos aparecen en Facebook Business Manager
- [x] Metadatos se envían correctamente
- [x] Engagement tracking funciona
- [x] Registro tracking funciona

## 🎯 Próximos Pasos

### 1. Configurar Audiencias en Facebook
- Crear audiencia de usuarios que visitaron la página del webinar
- Crear audiencia de usuarios que se registraron al webinar
- Crear audiencia de usuarios con alto engagement

### 2. Configurar Campañas de Retargeting
- Campaña para usuarios que visitaron pero no se registraron
- Campaña para usuarios que se registraron pero no asistieron
- Campaña para usuarios con alto engagement

### 3. Optimizar Conversión
- A/B testing de diferentes elementos de la página
- Optimización del formulario de registro
- Mejora de la experiencia del usuario

---

**Última actualización:** 2025-01-27
**Versión:** 1.0.0
**Estado:** ✅ Implementado y Funcionando 