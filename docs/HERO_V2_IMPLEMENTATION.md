# Hero V2 - Implementación del Nuevo Diseño

## Descripción
Nuevo hero principal con diseño de dos columnas basado en la imagen de referencia, implementado como una característica opcional que se puede activar/desactivar mediante un flag de configuración.

## Características Implementadas

### 🎨 **Diseño Visual**
- **Fondo degradado azul** con gradiente de 135° desde azul oscuro hasta azul claro
- **Layout de dos columnas** con grid responsivo
- **Tarjetas con sombras** y efectos de glassmorphism
- **Animaciones suaves** usando Framer Motion

### 📱 **Columna Izquierda - Contenido**
- **Título H1** con tipografía Geist Sans, peso 900
- **Subtítulo descriptivo** con peso 500
- **CTA principal** adaptativo (login/continuar según estado de autenticación)
- **Tarjeta blanca** con bordes redondeados y sombras

### 📱 **Columna Derecha - Mockup y Detalles**
- **Mockup de smartphone** con rotación de 5° en desktop
- **Video del instructor** con avatar circular y controles
- **Navegación del curso** con pestañas activas
- **Detalles del curso** con estadísticas, módulos y prerrequisitos

### 🔧 **Funcionalidades Técnicas**
- **Flag de configuración** `HERO_V2` para activar/desactivar
- **Responsive design** completo (mobile, tablet, desktop)
- **Animaciones de entrada** con delays escalonados
- **Integración con autenticación** existente
- **Sección de acceso ilimitado** integrada

## Configuración

### Activación del Hero V2
```bash
# En el archivo env.local o .env
NEXT_PUBLIC_HERO_V2=true
```

### Desactivación (volver al hero original)
```bash
# En el archivo env.local o .env
NEXT_PUBLIC_HERO_V2=false
# O simplemente comentar/eliminar la línea
```

## Estructura de Archivos

```
src/
├── components/
│   └── layout/
│       ├── Hero.tsx          # Hero original
│       └── HeroV2.tsx        # Nuevo hero implementado
├── lib/
│   └── config.ts             # Configuración de flags
└── app/
    ├── page.tsx              # Página principal con lógica condicional
    └── globals.css           # Estilos del nuevo hero
```

## Responsive Breakpoints

### Desktop (1024px+)
- Grid de 2 columnas
- Mockup con rotación de 5°
- Espaciado completo entre elementos

### Tablet (768px - 1023px)
- Grid de 2 columnas con gap reducido
- Mockup sin rotación
- Tamaños ajustados para pantallas medianas

### Mobile (≤767px)
- Grid de 1 columna (stack vertical)
- Mockup centrado sin rotación
- Tarjetas de ancho completo
- Texto centrado

## Accesibilidad

### ✅ **Implementado**
- **Contraste adecuado** entre texto y fondos
- **Jerarquía clara** de headings (H1, H3, H4)
- **Alt text** para imágenes y elementos visuales
- **Navegación por teclado** en botones y enlaces
- **Semántica HTML** correcta

### 🎯 **Verificaciones Recomendadas**
- Test de contraste con herramientas como WebAIM
- Navegación con lectores de pantalla
- Verificación de focus visible en elementos interactivos

## Personalización

### Colores
Los colores principales se pueden modificar en `globals.css`:
```css
.hero-v2-gradient {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
}
```

### Tipografía
La tipografía sigue los estándares globales de eGrow Academy:
- **H1**: Geist Sans, peso 900, tracking -0.02em
- **Subtítulos**: Peso 500-600
- **Texto**: Peso 500

### Animaciones
Las animaciones se pueden ajustar en el componente:
```tsx
transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
```

## Testing

### Verificación Visual
1. Activar el flag `HERO_V2=true`
2. Recargar la página principal
3. Verificar que se muestre el nuevo diseño
4. Probar en diferentes tamaños de pantalla

### Verificación de Fallback
1. Desactivar el flag `HERO_V2=false`
2. Recargar la página
3. Verificar que se muestre el hero original

## Mantenimiento

### Actualizaciones
- Los estilos están en `globals.css` bajo la sección "HERO V2"
- El componente principal está en `HeroV2.tsx`
- La lógica condicional está en `page.tsx`

### Debugging
- Verificar que el flag esté configurado correctamente
- Revisar la consola del navegador para errores
- Verificar que las importaciones estén correctas

## Próximos Pasos

### 🚀 **Mejoras Futuras**
- [ ] Añadir más variantes de mockups
- [ ] Implementar carrusel de cursos destacados
- [ ] Añadir métricas de engagement
- [ ] Optimizar imágenes con formatos WebP/AVIF
- [ ] Implementar lazy loading para mejor performance

### 🔧 **Optimizaciones**
- [ ] Comprimir imágenes del mockup
- [ ] Implementar skeleton loading
- [ ] Añadir tests unitarios
- [ ] Optimizar bundle size

---

**Implementado por**: Asistente IA  
**Fecha**: Enero 2025  
**Versión**: 1.0.0
