# 🧑‍💻 eGrow Academy - Documentación Técnica

## 🏗️ **Arquitectura del Proyecto**

### **Stack Tecnológico**
```yaml
Framework: Next.js 15.4.1 (App Router + Turbopack)
Language: TypeScript
Styling: CSS Custom + CSS Variables
Node.js: v18.19.1
Package Manager: npm 9.2.0
Git: Main/Master branching strategy
```

### **Estructura de Directorios**
```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── layout.tsx         # Layout raíz con metadata
│   ├── page.tsx           # Página principal (/)
│   ├── globals.css        # Estilos globales (~2,145 líneas)
│   ├── community/         # Página comunidad + subfunciones
│   ├── contacto/          # Formulario de contacto
│   ├── courses/           # Catálogo completo de cursos
│   ├── cursos-cortos/     # Cursos gratuitos específicos
│   └── resources/         # Biblioteca de recursos IA
├── components/            # Componentes reutilizables
│   ├── Sidebar.tsx        # Navegación principal con dropdown
│   ├── Footer.tsx         # Footer global (todas las páginas)
│   ├── Hero.tsx          # Sección hero del inicio
│   ├── CourseCard.tsx    # Tarjeta de curso reutilizable
│   └── [8+ componentes]  # Otros componentes modulares
└── lib/                   # Utilidades y configuración
    ├── trpc-client.ts    # Cliente tRPC (legacy)
    └── trpc.ts           # Configuración tRPC (legacy)
```

---

## ⚙️ **Configuración Técnica**

### **Next.js Configuration**
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbo: true,           // Turbopack para desarrollo
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com']
  }
}
```

### **CSS Architecture**
```css
/* Metodología: CSS Variables + Utility Classes */
:root {
  --primary-blue: #3b82f6;
  --accent-blue: #1d4ed8;
  --gray-50: #f9fafb;
  --gray-900: #111827;
  /* 20+ variables CSS */
}
```

### **TypeScript Configuration**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

---

## 🎨 **Sistema de Diseño**

### **Paleta de Colores**
```scss
// Colores principales
$primary-blue: #3b82f6;    // Azul principal
$accent-blue: #1d4ed8;     // Azul acento
$success-green: #10b981;   // Verde para badges gratuitos
$warning-orange: #f59e0b;  // Naranja para advertencias

// Escala de grises
$gray-50: #f9fafb;         // Fondos sutiles
$gray-100: #f3f4f6;        // Fondos de cards
$gray-200: #e5e7eb;        // Bordes
$gray-600: #4b5563;        // Texto secundario
$gray-900: #111827;        // Texto principal
```

### **Tipografía**
```css
/* Fuentes del sistema */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'

/* Fuente especial para AI-News */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
```

### **Breakpoints Responsive**
```scss
$mobile: 320px;
$tablet: 768px;
$desktop: 1024px;
$large: 1440px;

// Mobile-first approach
@media (max-width: 768px) { /* Móvil */ }
@media (min-width: 769px) { /* Tablet+ */ }
@media (min-width: 1024px) { /* Desktop+ */ }
```

---

## 🧩 **Componentes Principales**

### **Sidebar Component**
```typescript
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Features:
- Estado local para dropdown activo
- Enlaces Next.js Link + externos
- Responsive overlay/fixed positioning
- Smooth animations con CSS transitions
```

### **Footer Component**
```typescript
// Estructura de datos
footerData = {
  sections: [
    { title: "Aprende", links: [...] },
    { title: "Comunidad", links: [...] },
    { title: "AI Experts", links: [...] }
  ]
}

// Features:
- Logo clickeable → home
- Enlaces contextuales (#anchors)
- External links con target="_blank"
```

### **Course Card Component**  
```typescript
interface CourseCardProps {
  image: string;
  title: string;
  description: string;
  tag: string;
  duration: string;
  level: string;
  link: string;
}

// Reutilizable en: /cursos-cortos, /courses
```

---

## 📡 **Gestión de Estado**

### **React State Management**
```typescript
// Nivel de página (useState)
const [sidebarOpen, setSidebarOpen] = useState(false);
const [formData, setFormData] = useState({...});
const [selectedCategory, setSelectedCategory] = useState('todos');

// No se usa Context API (proyecto simple)
// No se usa Redux (innecesario para el scope)
```

### **Form Handling**
```typescript
// Formulario de contacto
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  // Simulación (placeholder para backend real)
  setTimeout(() => {
    alert('¡Mensaje enviado correctamente!');
    setFormData(initialState);
    setIsSubmitting(false);
  }, 1500);
};
```

---

## 🔗 **Routing y Navegación**

### **App Router (Next.js 13+)**
```
app/
├── page.tsx              → /
├── community/page.tsx    → /community  
├── contacto/page.tsx     → /contacto
├── courses/page.tsx      → /courses
├── cursos-cortos/page.tsx → /cursos-cortos
└── resources/page.tsx    → /resources
```

### **Link Management**
```typescript
// Links internos
<Link href="/community">Comunidad</Link>

// Links externos
<a href="https://external.com" target="_blank" rel="noopener noreferrer">

// Links con anchors
<Link href="/community#forum">Foro</Link>
```

---

## 🎭 **Animations y UX**

### **CSS Animations**
```css
/* Badge pulsante */
@keyframes pulse-green {
  0% { box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
  50% { 
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
    transform: translateY(-2px);
  }
  100% { box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
}

/* Hover effects */
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

### **Smooth Scrolling**
```css
html {
  scroll-behavior: smooth;
}

/* Para enlaces con anchors (#forum, #events) */
```

---

## 🧪 **Funcionalidades Avanzadas**

### **Dynamic Imports**
```typescript
// Lazy loading para optimización
const CompaniesMarquee = dynamic(() => import('@/components/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

### **Interactive Elements**
```typescript
// FAQ Accordion (useEffect + DOM manipulation)
useEffect(() => {
  const handleFAQToggle = (e: Event) => {
    const faqItem = question.closest('.faq-item');
    faqItem?.classList.toggle('active');
  };
  // Event listeners management
}, []);
```

### **Form Validation**
```typescript
// HTML5 + JavaScript validation
<input
  type="email"
  required
  placeholder="tu@email.com"
  value={formData.email}
  onChange={handleInputChange}
/>
```

---

## 📊 **Performance Optimizations**

### **Next.js Optimizations**
- ✅ **Turbopack** para desarrollo rápido
- ✅ **Dynamic imports** para lazy loading
- ✅ **Image optimization** automática
- ✅ **CSS minification** en producción

### **Bundle Analysis**
```bash
# Para analizar el bundle
npm run build
npm run start

# Métricas típicas:
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
```

---

## 🛠️ **Development Workflow**

### **Scripts Disponibles**
```json
{
  "scripts": {
    "dev": "next dev --turbopack",      // Desarrollo con Turbopack
    "build": "next build",              // Build de producción  
    "start": "next start",              // Servidor de producción
    "lint": "next lint"                 // Linting con ESLint
  }
}
```

### **Git Workflow**
```bash
# Estructura de ramas
main    → Proyecto eGrow Academy (producción)
master  → Proyecto original (respaldo)

# Comandos típicos
git add .
git commit -m "feat: descripción del cambio"
git push origin main
```

---

## 🔧 **Configuration Files**

### **ESLint Config**
```javascript
// config/eslint.config.mjs
export default [
  {
    rules: {
      "prefer-const": "error",
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
];
```

### **PostCSS Config**
```javascript
// postcss.config.mjs
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
};
```

---

## 🚀 **Deployment Ready**

### **Vercel Configuration**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "nodeVersion": "18.x"
}
```

### **Environment Variables**
```bash
# .env.local (para producción)
NEXT_PUBLIC_APP_URL=https://egrow-academy.vercel.app
NEXT_PUBLIC_API_URL=https://api.egrow-academy.com
```

---

## 📚 **Documentación Relacionada**

- **PROJECT-DEVELOPMENT-LOG.md** → Registro completo de desarrollo
- **ENDPOINTS-GUIDE.md** → Guía de rutas y navegación  
- **openapi-docs.md** → Documentación de API estilo OpenAPI
- **REORGANIZATION.md** → Cambios en estructura de archivos

---

*Documentación técnica completa de eGrow Academy Platform*