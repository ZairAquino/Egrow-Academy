# 🛣️ Guía de Endpoints - eGrow Academy

## 📍 **Rutas Principales**

### **🏠 Página Principal**
```
GET /
├── Hero Section (CTA buttons)
├── Companies Marquee  
├── Featured Courses
├── Why Choose Section
├── Newsletter
└── Footer
```

### **🆓 Cursos Gratuitos**  
```
GET /cursos-cortos
├── Hero + Badge "100% Gratuito"
├── Features (4 cards) + Stats (sidebar)
├── 15 Cursos gratuitos reales
└── CTA "Ver Todos los Cursos"
```

### **📚 Catálogo Completo**
```
GET /courses  
├── Filtros por categoría
├── Cursos premium + gratuitos
├── Indicadores de suscripción
└── Sistema de paginación
```

### **👥 Comunidad**
```
GET /community
├── /community#forum → Sección foro
├── /community#events → Eventos próximos  
├── /community#faq → Preguntas frecuentes
└── Testimonios + CTA unión
```

### **📖 Recursos**
```
GET /resources
├── Recursos destacados (3 cards)
├── Filtros: todos|libros|papers|herramientas|datasets|tutoriales|podcasts
├── 20+ recursos con enlaces reales
└── Estadísticas de recursos
```

### **✉️ Contacto**
```
GET /contacto
├── Métodos de contacto (3 opciones)
├── Formulario funcional
│   ├── POST /contacto → Simulado (alert)
│   └── Campos: nombre, email, asunto, mensaje
└── FAQ lateral
```

---

## 🔗 **Enlaces Externos**

### **AI-News Blog**
```
External: https://egrow-theta.vercel.app/ai-news
├── Target: _blank (nueva pestaña)
├── Estilo: Botón retro 90's
└── Acceso: Menú principal + Footer
```

### **AI Experts**
```
External: https://egrow.lat/ai-experts  
├── Target: _blank (nueva pestaña)
├── Secciones: Acerca de
└── Contacto → redirige a /contacto interno
```

---

## 🧭 **Navegación Interna**

### **Sidebar Menu**
```
📁 Menú Principal
├── 🏠 Inicio → /
├── 📚 Cursos (dropdown)
│   ├── 🆓 Cursos Gratuitos → /cursos-cortos
│   └── 🔒 Todos los Cursos → /courses
├── 🤖 AI-News → [externo]
├── 👥 Comunidad → /community
├── 📖 Recursos → /resources  
├── ✉️ Contacto → /contacto
└── 🏢 AI Experts© → [externo]
```

### **Footer Links**
```
📁 Footer Global
├── Aprende
│   ├── Cursos Gratuitos → /cursos-cortos
│   └── Todos los Cursos → /courses
├── Comunidad  
│   ├── Foro → /community#forum
│   ├── Eventos → /community#events
│   └── Blog → [AI-News externo]
└── AI Experts
    ├── Acerca de → [externo]
    └── Contacto → /contacto
```

---

## ⚡ **Funcionalidades por Endpoint**

### **/ (Inicio)**
- Hero buttons → /courses, /resources
- Featured courses → Enlaces reales a DeepLearning.AI
- Newsletter → Simulación de suscripción

### **/cursos-cortos (Gratuitos)**  
- Badge animado "100% Gratuito"
- 15 cursos con enlaces externos funcionales
- Layout: Features + Stats sidebar
- CTA → /courses

### **/courses (Todos)**
- Filtros funcionales por categoría
- Cards con información completa
- Indicadores de nivel y duración

### **/community (Comunidad)**
- Navegación interna (#forum, #events, #faq)
- FAQ acordeón interactivo  
- Eventos con registro simulado
- Stats sidebar sticky

### **/resources (Recursos)**
- Filtros por 7 categorías  
- 20+ enlaces reales (arXiv, GitHub, etc.)
- Recursos destacados siempre visibles
- Imágenes de referencia

### **/contacto (Contacto)**
- Formulario HTML5 con validación
- Estados: normal, loading, success
- Dropdown de asuntos categorizados
- FAQ lateral sticky

---

## 🔍 **IDs y Anclas**

### **Community Anchors**
```
/community#forum → Sección foro
/community#events → Eventos próximos  
/community#faq → Preguntas frecuentes
```

### **Smooth Scrolling**
Implementado con CSS `scroll-behavior: smooth`

---

## 📱 **Responsive Breakpoints**

```css
/* Mobile First */
Default: 320px+
Tablet: 768px+  
Desktop: 1024px+
Large: 1440px+
```

### **Comportamientos Responsive**
- **Sidebar:** Overlay en móvil, fixed en desktop
- **Grids:** 1 columna móvil → 2-3 columnas desktop
- **Layout comunidad:** Vertical móvil → horizontal desktop
- **Footer:** Stack vertical → grid horizontal

---

## 🚀 **Estados de Carga**

### **Lazy Loading**
- CompaniesMarquee → Dynamic import
- Formulario contacto → Loading states
- Navegación → Instant loading

### **Error Handling**  
- 404 → Páginas no encontradas
- Form validation → HTML5 + JavaScript
- External links → target="_blank" + rel="noopener noreferrer"

---

*Guía completa de endpoints y navegación de eGrow Academy*