
## 🔍 Verificación Manual de GA4

### 1. Verificar en el Navegador
1. Abre https://egrow-academy.com
2. Abre DevTools (F12)
3. Ve a la pestaña "Console"
4. Busca mensajes de Google Analytics
5. No debe haber errores relacionados con GA4

### 2. Verificar en Google Analytics
1. Ve a https://analytics.google.com/
2. Selecciona tu propiedad "eGrow Academy Web"
3. Ve a "Informes" > "Tiempo real"
4. Deberías ver actividad en tiempo real

### 3. Verificar Eventos
1. En Google Analytics, ve a "Informes" > "Engagement" > "Events"
2. Deberías ver eventos como:
   - page_view
   - course_view
   - cta_click

### 4. Verificar en Google Tag Assistant
1. Instala la extensión "Google Tag Assistant Legacy"
2. Activa el modo de depuración
3. Navega por tu sitio
4. Verifica que GA4 esté funcionando

## 📊 Eventos que Deberías Ver

### Eventos Automáticos:
- page_view (automático)
- scroll (si está habilitado)
- click (enlaces externos)

### Eventos Personalizados:
- course_view (al ver un curso)
- cta_click (al hacer clic en CTA)
- user_register (al registrarse)
- user_login (al iniciar sesión)

## 🛠️ Comandos de Verificación

```bash
# Verificar que el servidor esté corriendo
npm run dev

# En otra terminal, verificar analytics
node scripts/test-ga4.ts

# Verificar configuración SEO
npm run seo-analysis
```

## 📝 Notas Importantes

- **Tiempo de propagación**: Los datos pueden tardar hasta 24-48 horas en aparecer
- **Modo de depuración**: Usa Google Tag Assistant para verificar en tiempo real
- **Privacidad**: Asegúrate de cumplir con GDPR/LGPD
- **Consentimiento**: Implementa banner de cookies si es necesario

## 🎯 Próximos Pasos

1. **Verificar en tiempo real**: Usa Google Analytics Real-Time
2. **Configurar conversiones**: Marca eventos importantes como conversiones
3. **Crear audiencias**: Configura segmentos de usuarios
4. **Configurar informes**: Crea informes personalizados
5. **Monitorear métricas**: Revisa métricas semanalmente

---

**ID de GA4 configurado**: G-RSHD1HL9R0
**Fecha de verificación**: 2025-07-26T17:18:45.077Z
