# ✅ CHECKLIST - Google Analytics 4

## 🎯 ESTADO ACTUAL

- [x] ✅ Propiedad GA4 creada: "eGrow Academy Web"
- [x] ✅ ID de medición obtenido: G-RSHD1HL9R0
- [x] ✅ Componentes de analytics configurados
- [x] ✅ Eventos personalizados implementados
- [x] ✅ Layout integrado con Analytics

## 🔄 PASOS PENDIENTES

### 1. CONFIGURAR VARIABLES DE ENTORNO
- [ ] Crear archivo `.env.local`
- [ ] Agregar: `NEXT_PUBLIC_GA_ID="G-RSHD1HL9R0"`
- [ ] Agregar: `GOOGLE_ANALYTICS_ID="G-RSHD1HL9R0"`

### 2. INICIAR SERVIDOR
- [ ] Ejecutar: `npm run dev`
- [ ] Verificar que el servidor esté corriendo
- [ ] Abrir http://localhost:3000

### 3. VERIFICAR FUNCIONAMIENTO
- [ ] Abrir DevTools (F12)
- [ ] Ir a pestaña "Console"
- [ ] Buscar mensajes de Google Analytics
- [ ] No debe haber errores

### 4. VERIFICAR EN GOOGLE ANALYTICS
- [ ] Ir a https://analytics.google.com/
- [ ] Seleccionar propiedad "eGrow Academy Web"
- [ ] Ir a "Informes" → "Tiempo real"
- [ ] Navegar por el sitio web
- [ ] Verificar actividad en tiempo real

## 📊 EVENTOS A VERIFICAR

### Eventos Automáticos
- [ ] `page_view` - Al cargar páginas
- [ ] `scroll` - Al hacer scroll (si está habilitado)

### Eventos Personalizados
- [ ] `course_view` - Al ver un curso
- [ ] `cta_click` - Al hacer clic en botones
- [ ] `user_register` - Al registrarse
- [ ] `user_login` - Al iniciar sesión

## 🎯 CONFIGURACIÓN AVANZADA

### Conversiones (Después de activar)
- [ ] Marcar `subscription_start` como conversión
- [ ] Marcar `payment_complete` como conversión
- [ ] Marcar `user_register` como conversión

### Audiencias
- [ ] Crear audiencia "Usuarios que vieron cursos"
- [ ] Crear audiencia "Usuarios registrados"
- [ ] Crear audiencia "Usuarios que pagaron"

### Informes Personalizados
- [ ] Informe de conversiones
- [ ] Informe de engagement
- [ ] Informe de cursos populares

## 🆘 SOLUCIÓN DE PROBLEMAS

### Si no ves datos:
- [ ] Verificar que `.env.local` tenga el ID correcto
- [ ] Reiniciar servidor: `npm run dev`
- [ ] Limpiar caché del navegador
- [ ] Desactivar bloqueadores de anuncios

### Si hay errores:
- [ ] Verificar que el ID comience con "G-"
- [ ] Asegurar que Analytics.tsx esté en layout.tsx
- [ ] Revisar que useAnalytics.ts esté importado

## 📞 COMANDOS ÚTILES

```bash
# Verificar configuración
node scripts/test-ga4.ts

# Iniciar servidor
npm run dev

# Análisis SEO
npm run seo-analysis

# Medir rendimiento
npm run measure-cwv
```

---

## 🎉 ¡LISTO PARA TRACKEAR!

Una vez completado este checklist, tu Google Analytics 4 estará completamente funcional y trackeando todas las acciones importantes de los usuarios en eGrow Academy. 