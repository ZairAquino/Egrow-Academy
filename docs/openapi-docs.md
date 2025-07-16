# Documentación de API - eGrow Academy

## 📋 Resumen del Proyecto

**eGrow Academy** es una plataforma educativa de Inteligencia Artificial con las siguientes características:

### 🎯 **Endpoints Principales**

#### **Páginas Públicas:**
- `GET /` - Página principal con hero, cursos destacados y newsletter
- `GET /cursos-cortos` - Cursos gratuitos de IA (1-4 horas)
- `GET /courses` - Catálogo completo de cursos (requiere suscripción)
- `GET /community` - Foro, eventos, FAQ y testimonios
- `GET /resources` - Biblioteca de papers, herramientas y datasets
- `GET /contacto` - Formulario de contacto y FAQ

#### **Enlaces Externos:**
- `External: https://egrow-theta.vercel.app/ai-news` - Blog de noticias IA
- `External: https://egrow.lat/ai-experts` - Sitio de AI Experts

### 🛠️ **Stack Tecnológico**

```yaml
Framework: Next.js 15.4.1 (Turbopack)
Language: TypeScript
Styling: CSS Custom + Tailwind CSS
Deployment: Vercel (recomendado)
Node: v18.19.1
Package Manager: npm 9.2.0
```

### 📁 **Estructura de Archivos**

```
src/
├── app/                    # App Router de Next.js
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout global
│   ├── globals.css        # Estilos globales
│   ├── community/         # Página de comunidad
│   ├── contacto/          # Formulario de contacto
│   ├── courses/           # Catálogo completo
│   ├── cursos-cortos/     # Cursos gratuitos
│   └── resources/         # Biblioteca de recursos
├── components/            # Componentes reutilizables
│   ├── Sidebar.tsx        # Navegación lateral
│   ├── Footer.tsx         # Footer global
│   ├── Hero.tsx          # Sección hero
│   └── [otros].tsx       # Más componentes
└── lib/                  # Utilidades y configuración
```

### 🎨 **Componentes Principales**

#### **Sidebar Navigation**
```typescript
// Estructura del menú principal
menuItems = [
  "Inicio" → "/",
  "Cursos" → {
    "Cursos Gratuitos" → "/cursos-cortos",
    "Todos los Cursos 🔒" → "/courses"
  },
  "AI-News" → "https://egrow-theta.vercel.app/ai-news",
  "Comunidad" → "/community",
  "Recursos" → "/resources",
  "Contacto" → "/contacto",
  "AI Experts©" → "https://egrow.lat/ai-experts"
]
```

#### **Footer Links**
```typescript
sections = {
  "Aprende": [
    "Cursos Gratuitos" → "/cursos-cortos",
    "Todos los Cursos" → "/courses"
  ],
  "Comunidad": [
    "Foro" → "/community#forum",
    "Eventos" → "/community#events", 
    "Blog" → "https://egrow-theta.vercel.app/ai-news"
  ],
  "AI Experts": [
    "Acerca de" → "https://egrow.lat/ai-experts",
    "Contacto" → "/contacto"
  ]
}
```

### 🚀 **Comandos de Desarrollo**

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev          # http://localhost:3000

# Construcción
npm run build        # Construir para producción
npm start           # Ejecutar build de producción

# Linting
npm run lint        # ESLint + TypeScript check
```

### 🎯 **Funcionalidades Implementadas**

- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Navegación Dinámica** - Sidebar con dropdown
- ✅ **Formulario de Contacto** - Con validación y estados
- ✅ **SEO Optimizado** - Meta tags y estructura semántica
- ✅ **Lazy Loading** - Componentes dinámicos
- ✅ **Animaciones CSS** - Hover effects y transiciones
- ✅ **External Integrations** - AI-News blog y AI Experts

### 📊 **Métricas del Proyecto**

- **Páginas:** 6 principales + componentes
- **Componentes:** 10+ reutilizables
- **Archivos CSS:** ~2000+ líneas de estilos custom
- **Enlaces externos:** 2 integraciones principales
- **Repositorio:** GitHub con ramas main/master organizadas

---

## 🔗 **Enlaces Importantes**

- **Repositorio:** https://github.com/ZairAquino/Egrow-Academy
- **Rama Principal:** main (eGrow Academy)
- **Rama Respaldo:** master (proyecto original)
- **Servidor Local:** http://localhost:3001 (puerto alternativo)

---

*Documentación generada automáticamente para eGrow Academy Platform*