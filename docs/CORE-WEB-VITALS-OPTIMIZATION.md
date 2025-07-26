# Optimización de Core Web Vitals para eGrow Academy

## 🎯 Objetivo
Mejorar los Core Web Vitals para obtener mejores rankings en Google y proporcionar una mejor experiencia de usuario.

## 📊 Métricas Objetivo

### LCP (Largest Contentful Paint) - < 2.5s
- **Excelente**: 0-2.5s
- **Necesita mejora**: 2.5-4s
- **Pobre**: > 4s

### FID (First Input Delay) - < 100ms
- **Excelente**: 0-100ms
- **Necesita mejora**: 100-300ms
- **Pobre**: > 300ms

### CLS (Cumulative Layout Shift) - < 0.1
- **Excelente**: 0-0.1
- **Necesita mejora**: 0.1-0.25
- **Pobre**: > 0.25

## 🔧 Optimizaciones Implementadas

### 1. Optimización de Imágenes

#### Next.js Image Component
```tsx
import Image from 'next/image';

// Uso optimizado
<Image
  src="/images/course-image.jpg"
  alt="Curso de IA"
  width={400}
  height={300}
  priority={true} // Para imágenes above the fold
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### Configuración en next.config.ts
```typescript
const nextConfig = {
  images: {
    domains: ['egrow-academy.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### 2. Lazy Loading de Componentes

#### Componentes Pesados
```tsx
import dynamic from 'next/dynamic';

// Lazy load de componentes pesados
const VideoPlayer = dynamic(() => import('@/components/courses/VideoPlayer'), {
  loading: () => <div>Cargando video...</div>,
  ssr: false
});

const CourseResourceUpload = dynamic(() => import('@/components/courses/CourseResourceUpload'), {
  loading: () => <div>Cargando...</div>
});
```

### 3. Optimización de Fuentes

#### Configuración en layout.tsx
```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});
```

### 4. Preload de Recursos Críticos

#### En layout.tsx
```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Preload de recursos críticos */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/images/hero-bg.webp"
          as="image"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

### 5. Optimización de CSS

#### Tailwind CSS Purge
```typescript
// tailwind.config.ts
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### CSS Crítico Inline
```tsx
// Componente para CSS crítico
const CriticalCSS = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .course-card {
          transition: transform 0.2s ease-in-out;
        }
        .course-card:hover {
          transform: translateY(-4px);
        }
      `,
    }}
  />
);
```

### 6. Optimización de JavaScript

#### Code Splitting Automático
```tsx
// Next.js App Router ya hace code splitting automático
// Pero podemos optimizar más:

// Lazy load de páginas
const CoursePage = dynamic(() => import('@/app/curso/[slug]/page'), {
  loading: () => <CourseSkeleton />
});

// Lazy load de componentes condicionales
const PremiumFeatures = dynamic(() => import('@/components/PremiumFeatures'), {
  loading: () => <div>Cargando características premium...</div>,
  ssr: false
});
```

### 7. Optimización de API Routes

#### Caching de Respuestas
```typescript
// src/app/api/courses/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const courses = await getCourses();
  
  return NextResponse.json(courses, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'CDN-Cache-Control': 'public, max-age=86400',
    },
  });
}
```

### 8. Service Worker para Caching

#### public/sw.js
```javascript
const CACHE_NAME = 'egrow-academy-v1';
const urlsToCache = [
  '/',
  '/courses',
  '/static/css/main.css',
  '/static/js/main.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

## 📊 Monitoreo de Core Web Vitals

### 1. Google PageSpeed Insights
```bash
# Verificar rendimiento
npm run lighthouse
```

### 2. Google Search Console
- Ir a Core Web Vitals
- Monitorear métricas por URL
- Recibir alertas cuando hay problemas

### 3. Chrome DevTools
```javascript
// En la consola del navegador
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime);
    }
    if (entry.entryType === 'first-input') {
      console.log('FID:', entry.processingStart - entry.startTime);
    }
    if (entry.entryType === 'layout-shift') {
      console.log('CLS:', entry.value);
    }
  }
}).observe({
  entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']
});
```

### 4. Web Vitals Library
```bash
npm install web-vitals
```

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Enviar a Google Analytics
  gtag('event', 'core_web_vital', {
    event_category: 'Web Vitals',
    event_label: metric.name,
    value: Math.round(metric.value),
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 🚀 Optimizaciones Específicas para eGrow Academy

### 1. Optimización de Página Principal
```tsx
// src/app/page.tsx
export default function HomePage() {
  return (
    <>
      {/* CSS crítico inline */}
      <CriticalCSS />
      
      {/* Hero section optimizado */}
      <section className="hero-section">
        <Image
          src="/images/hero-bg.webp"
          alt="eGrow Academy"
          fill
          priority
          className="object-cover"
        />
        <div className="hero-content">
          <h1>Cursos de Inteligencia Artificial</h1>
          <p>Líder en México y Latinoamérica</p>
        </div>
      </section>
      
      {/* Cursos con lazy loading */}
      <section className="courses-section">
        <FeaturedCourses />
      </section>
    </>
  );
}
```

### 2. Optimización de Páginas de Cursos
```tsx
// src/app/curso/[slug]/page.tsx
export default function CoursePage({ params }: { params: { slug: string } }) {
  return (
    <>
      {/* Metadata optimizada */}
      <DynamicSEO
        title={`${course.title} - eGrow Academy`}
        description={course.description}
        keywords={course.keywords}
        type="course"
        courseData={course}
      />
      
      {/* Contenido optimizado */}
      <div className="course-content">
        <CourseHeader course={course} />
        <CourseLessons lessons={course.lessons} />
        <CourseResources resources={course.resources} />
      </div>
    </>
  );
}
```

### 3. Optimización de Videos
```tsx
// src/components/courses/VideoPlayer.tsx
export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  return (
    <div className="video-container">
      <video
        controls
        preload="metadata"
        poster={`${src}?poster=true`}
        className="w-full"
      >
        <source src={`${src}?format=webm`} type="video/webm" />
        <source src={`${src}?format=mp4`} type="video/mp4" />
        Tu navegador no soporta videos.
      </video>
    </div>
  );
}
```

## 📈 Métricas de Rendimiento Esperadas

### Después de las Optimizaciones:
- **LCP**: < 1.5s
- **FID**: < 50ms
- **CLS**: < 0.05
- **FCP**: < 1s
- **TTFB**: < 200ms

### Herramientas de Medición:
1. **Google PageSpeed Insights**
2. **Chrome DevTools Performance**
3. **WebPageTest**
4. **GTmetrix**
5. **Lighthouse CI**

## 🔄 Proceso de Optimización Continua

### 1. Medición Semanal
```bash
# Ejecutar análisis de rendimiento
npm run lighthouse
npm run seo-analysis
```

### 2. Monitoreo Automático
- Configurar alertas en Google Search Console
- Monitorear Core Web Vitals en tiempo real
- Revisar métricas de usuarios reales

### 3. Optimización Iterativa
- Identificar cuellos de botella
- Implementar mejoras
- Medir impacto
- Iterar

## 📝 Checklist de Optimización

- [ ] Optimizar imágenes con Next.js Image
- [ ] Implementar lazy loading
- [ ] Optimizar fuentes web
- [ ] Preload recursos críticos
- [ ] Implementar service worker
- [ ] Optimizar CSS crítico
- [ ] Configurar caching de API
- [ ] Monitorear Core Web Vitals
- [ ] Optimizar JavaScript bundle
- [ ] Implementar compresión gzip/brotli

## 🎯 Resultados Esperados

Con estas optimizaciones, eGrow Academy debería:

1. **Mejorar rankings en Google** por Core Web Vitals
2. **Reducir tasa de rebote** por mejor experiencia
3. **Aumentar conversiones** por mejor UX
4. **Mejorar SEO técnico** general
5. **Proporcionar mejor experiencia móvil**

## 📊 Próximos Pasos

1. **Implementar optimizaciones** paso a paso
2. **Medir impacto** de cada optimización
3. **Configurar monitoreo** continuo
4. **Optimizar basado en datos** reales
5. **Mantener rendimiento** a largo plazo 