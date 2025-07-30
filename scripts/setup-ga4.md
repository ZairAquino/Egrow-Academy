# 🎯 Configuración de Google Analytics 4

## 📋 Pasos para Configurar GA4

### 1. Crear Propiedad en Google Analytics
1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una nueva propiedad GA4
3. Obtén el **Measurement ID** (formato: G-XXXXXXXXXX)

### 2. Configurar Variables de Entorno
Agrega tu Measurement ID al archivo `.env`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Eventos de Promociones Configurados

#### Eventos Automáticos:
- `promotion_impression` - Cuando se muestra el banner
- `promotion_click` - Cuando se hace click en el CTA
- `promotion_close` - Cuando se cierra el banner
- `promotion_conversion` - Cuando se completa una suscripción

#### Parámetros Incluidos:
- `promotion_id` - ID único de la promoción
- `promotion_title` - Título de la promoción
- `promotion_type` - Tipo (PREMIUM_SUBSCRIPTION, NEW_COURSE, etc.)
- `cta_text` - Texto del botón de acción
- `cta_url` - URL de destino
- `session_id` - ID de sesión del usuario
- `user_id` - ID del usuario (si está logueado)
- `revenue` - Ingresos generados (para conversiones)
- `currency` - Moneda (USD por defecto)

### 4. Configurar Goals en GA4

#### Crear Goals para Promociones:
1. Ve a **Admin > Goals**
2. Crea un nuevo goal para cada tipo de evento:
   - **Goal 1:** `promotion_impression` - Impresiones de banners
   - **Goal 2:** `promotion_click` - Clicks en banners
   - **Goal 3:** `promotion_conversion` - Conversiones de promociones

#### Configurar Ecommerce:
1. Ve a **Admin > Ecommerce**
2. Habilita **Enhanced Ecommerce**
3. Los eventos de compra se enviarán automáticamente

### 5. Crear Reportes Personalizados

#### Reporte de Funnel de Promociones:
1. Ve a **Explore**
2. Crea un nuevo reporte
3. Configura el funnel:
   - Paso 1: `promotion_impression`
   - Paso 2: `promotion_click`
   - Paso 3: `promotion_conversion`

#### Reporte de Revenue por Promoción:
1. Crea un reporte de **Revenue**
2. Agrupa por `promotion_id`
3. Filtra por `promotion_conversion`

### 6. Verificar Implementación

#### En el Navegador:
1. Abre las **Developer Tools**
2. Ve a la pestaña **Network**
3. Busca requests a `google-analytics.com`
4. Verifica que los eventos se envíen correctamente

#### En Google Analytics:
1. Ve a **Real-time > Events**
2. Interactúa con los banners
3. Verifica que aparezcan los eventos en tiempo real

### 7. URLs de Acceso

#### Dashboard de Analytics:
- `http://localhost:3001/admin/analytics`

#### Panel de Promociones:
- `http://localhost:3001/admin/promotions`

### 8. Comandos de Verificación

```bash
# Verificar que GA4 esté cargado
curl http://localhost:3001/admin/analytics

# Verificar eventos en consola del navegador
# Los eventos aparecerán como: 📊 [GA4] Evento enviado: promotion_impression
```

### 9. Troubleshooting

#### Si los eventos no aparecen:
1. Verifica que `NEXT_PUBLIC_GA_MEASUREMENT_ID` esté configurado
2. Asegúrate de que no haya bloqueadores de anuncios
3. Verifica la consola del navegador para errores
4. Confirma que el Measurement ID sea correcto

#### Si el revenue no se registra:
1. Verifica que los eventos de conversión incluyan `revenue`
2. Confirma que el evento `purchase` se envíe correctamente
3. Verifica la configuración de Ecommerce en GA4

### 10. Métricas Disponibles

#### En GA4:
- **Page Views:** Visitas a páginas
- **Sessions:** Sesiones de usuario
- **Users:** Usuarios únicos
- **Bounce Rate:** Tasa de rebote
- **Events:** Eventos personalizados de promociones
- **Revenue:** Ingresos generados
- **Conversion Rate:** Tasa de conversión

#### En el Dashboard:
- **Impresiones:** Veces que se mostró el banner
- **Clicks:** Interacciones con el CTA
- **CTR:** Click Through Rate
- **Conversiones:** Suscripciones completadas
- **Revenue:** Ingresos estimados
- **Conversion Rate:** Tasa de conversión

### 11. Próximos Pasos

1. **Configurar Alertas:** Crear alertas para métricas importantes
2. **A/B Testing:** Implementar testing de diferentes mensajes
3. **Audiencias:** Crear audiencias basadas en comportamiento
4. **Remarketing:** Configurar campañas de remarketing
5. **Integración con Ads:** Conectar con Google Ads para optimización

---

**✅ Estado:** Google Analytics 4 completamente integrado y funcional 