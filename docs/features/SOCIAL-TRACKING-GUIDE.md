# 📱 Guía de Tracking de Redes Sociales - eGrow Academy

## 🎯 **Descripción General**

Sistema completo de tracking para medir el tráfico y conversiones desde redes sociales, especialmente Instagram, TikTok y LinkedIn. Permite generar URLs específicas con parámetros UTM para cada campaña y plataforma.

## 🚀 **Características Principales**

### **URLs de Tracking Automáticas**
- URLs específicas para cada plataforma (Instagram, TikTok, LinkedIn)
- Parámetros UTM predefinidos para cada campaña
- Generación automática de URLs personalizadas
- Tracking de impresiones, clicks y conversiones

### **Eventos de Google Analytics 4**
- `social_impression`: Cuando alguien visita desde red social
- `social_click`: Cuando alguien hace click en elementos específicos
- `social_conversion`: Cuando alguien se registra o compra

### **Plataformas Soportadas**
- ✅ Instagram
- ✅ TikTok  
- ✅ LinkedIn
- 🔄 YouTube (próximamente)
- 🔄 Twitter (próximamente)

## 📊 **Campañas Disponibles**

### **Instagram**
```
/courses?utm_source=instagram&utm_medium=social&utm_campaign=curso_ia
/resources?utm_source=instagram&utm_medium=social&utm_campaign=recursos_gratuitos
/community?utm_source=instagram&utm_medium=social&utm_campaign=comunidad
/?utm_source=instagram&utm_medium=social&utm_campaign=newsletter
/curso/monetiza-ia?utm_source=instagram&utm_medium=social&utm_campaign=curso_monetiza
/curso/asistentes-virtuales-ia?utm_source=instagram&utm_medium=social&utm_campaign=curso_asistentes
```

### **TikTok**
```
/courses?utm_source=tiktok&utm_medium=social&utm_campaign=curso_ia
/resources?utm_source=tiktok&utm_medium=social&utm_campaign=recursos_gratuitos
/community?utm_source=tiktok&utm_medium=social&utm_campaign=comunidad
/?utm_source=tiktok&utm_medium=social&utm_campaign=newsletter
```

### **LinkedIn**
```
/courses?utm_source=linkedin&utm_medium=social&utm_campaign=curso_ia
/resources?utm_source=linkedin&utm_medium=social&utm_campaign=recursos_gratuitos
/community?utm_source=linkedin&utm_medium=social&utm_campaign=comunidad
/?utm_source=linkedin&utm_medium=social&utm_campaign=newsletter
```

## 🛠️ **Cómo Usar**

### **1. Generar URLs de Tracking**

```bash
# Generar todas las URLs
npm run generate-social-urls

# Generar URL para post específico
npm run generate-social-urls post 123 instagram curso_ia
```

### **2. Usar en Redes Sociales**

1. **Copiar la URL** de la campaña deseada
2. **Pegar en bio** o posts de la red social
3. **Monitorear** en Google Analytics

### **3. Ver Estadísticas**

- Ve a `/admin/social-tracking` para ver URLs y estadísticas
- Google Analytics → Adquisición → Canales
- Eventos personalizados en GA4

## 📈 **Métricas que se Miden**

### **Tráfico**
- Visitas desde cada plataforma
- Páginas más visitadas
- Tiempo en sitio
- Tasa de rebote

### **Conversiones**
- Registros de usuarios
- Inscripciones a cursos
- Suscripciones al newsletter
- Descargas de recursos

### **Engagement**
- Clicks en elementos específicos
- Interacciones con contenido
- Navegación por el sitio

## 🔧 **Configuración Técnica**

### **Archivos Principales**
```
src/lib/social-tracking.ts          # Lógica principal de tracking
src/hooks/useSocialTracking.ts      # Hook para componentes
src/components/social/              # Componentes de UI
scripts/generate-social-urls.ts     # Script de generación
```

### **Integración en Layout**
```tsx
// En src/app/layout.tsx
<SocialTrackingWrapper>
  {children}
</SocialTrackingWrapper>
```

### **Uso en Componentes**
```tsx
import { useSocialTracking } from '@/hooks/useSocialTracking';

const MyComponent = () => {
  const { trackConversion, isFromSocialMedia } = useSocialTracking();
  
  const handleRegistration = () => {
    trackConversion('registration');
  };
  
  return (
    <div>
      {isFromSocialMedia() && <p>¡Bienvenido desde redes sociales!</p>}
    </div>
  );
};
```

## 📊 **Dashboard de Administración**

### **Acceso**
- URL: `/admin/social-tracking`
- Funcionalidades:
  - Ver URLs por plataforma
  - Copiar URLs con un click
  - Estadísticas básicas
  - Instrucciones de uso

### **Estadísticas Mostradas**
- Visitas por plataforma
- Conversiones por campaña
- Tasa de conversión
- Eventos de GA4

## 🎯 **Mejores Prácticas**

### **Para Instagram**
- Usar URLs cortas en bio
- Crear URLs específicas para stories
- Trackear diferentes tipos de contenido (posts, reels, carousels)

### **Para TikTok**
- Enfocarse en contenido educativo
- Usar URLs en descripción de videos
- Crear campañas específicas para tendencias

### **Para LinkedIn**
- URLs profesionales en posts
- Enfocarse en contenido B2B
- Trackear engagement en artículos

## 🔍 **Análisis en Google Analytics**

### **Reportes Recomendados**
1. **Adquisición → Canales**
   - Ver tráfico por fuente
   - Comparar rendimiento entre plataformas

2. **Eventos → Eventos personalizados**
   - `social_impression`
   - `social_click`
   - `social_conversion`

3. **Conversiones → Objetivos**
   - Configurar objetivos por campaña
   - Medir ROI de cada plataforma

### **Dimensiones Personalizadas**
- `social_platform`: Plataforma de origen
- `social_campaign`: Campaña específica
- `social_content_type`: Tipo de contenido

## 🚀 **Próximas Mejoras**

### **Funcionalidades Planificadas**
- [ ] Dashboard con estadísticas en tiempo real
- [ ] Integración con APIs de redes sociales
- [ ] A/B testing de URLs
- [ ] Automatización de posts con tracking
- [ ] Reportes automáticos por email

### **Plataformas Adicionales**
- [ ] YouTube
- [ ] Twitter/X
- [ ] Facebook
- [ ] Pinterest

## 📞 **Soporte**

Para dudas o problemas con el sistema de tracking:
- Revisar logs en consola del navegador
- Verificar configuración de GA4
- Consultar documentación de Google Analytics
- Contactar al equipo de desarrollo

---

**Última actualización:** 2025-01-08
**Versión:** 1.0.0 