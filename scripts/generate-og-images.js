#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 Generando imágenes Open Graph para eGrow Academy');

// Configuración de imágenes Open Graph
const ogImages = [
  {
    name: 'og-home.jpg',
    title: 'eGrow Academy',
    subtitle: 'Cursos de Inteligencia Artificial',
    description: 'Líder en México y Latinoamérica',
    colors: {
      primary: '#2563eb',
      secondary: '#667eea',
      text: '#ffffff'
    }
  },
  {
    name: 'og-courses.jpg',
    title: 'Cursos de IA',
    subtitle: 'eGrow Academy',
    description: 'Machine Learning • Deep Learning • Python',
    colors: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      text: '#ffffff'
    }
  },
  {
    name: 'og-contact.jpg',
    title: 'Contacto',
    subtitle: 'eGrow Academy',
    description: 'Soporte y Consultas',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      text: '#ffffff'
    }
  },
  {
    name: 'og-about.jpg',
    title: 'Sobre Nosotros',
    subtitle: 'eGrow Academy',
    description: 'Líder en Educación de IA',
    colors: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      text: '#ffffff'
    }
  },
  {
    name: 'og-pricing.jpg',
    title: 'Precios y Planes',
    subtitle: 'eGrow Academy',
    description: 'Cursos de Inteligencia Artificial',
    colors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      text: '#ffffff'
    }
  },
  {
    name: 'course-default.jpg',
    title: 'Curso de IA',
    subtitle: 'eGrow Academy',
    description: 'Formación Profesional',
    colors: {
      primary: '#2563eb',
      secondary: '#1d4ed8',
      text: '#ffffff'
    }
  },
  {
    name: 'blog-default.jpg',
    title: 'Blog IA',
    subtitle: 'eGrow Academy',
    description: 'Artículos y Noticias',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      text: '#ffffff'
    }
  },
  {
    name: 'event-default.jpg',
    title: 'Eventos IA',
    subtitle: 'eGrow Academy',
    description: 'Webinars y Workshops',
    colors: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      text: '#ffffff'
    }
  }
];

// Crear directorio si no existe
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Generar archivos de configuración para cada imagen
ogImages.forEach((image, index) => {
  const configPath = path.join(imagesDir, `${image.name}.config.json`);
  const config = {
    ...image,
    id: index + 1,
    dimensions: {
      width: 1200,
      height: 630
    },
    generated: new Date().toISOString()
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`✅ Configuración creada: ${image.name}`);
});

// Crear archivo de configuración principal
const mainConfig = {
  site: 'eGrow Academy',
  baseUrl: 'https://egrow-academy.com',
  images: ogImages.map(img => img.name),
  dimensions: {
    width: 1200,
    height: 630
  },
  generated: new Date().toISOString()
};

fs.writeFileSync(
  path.join(imagesDir, 'og-images-config.json'),
  JSON.stringify(mainConfig, null, 2)
);

console.log('\n🎉 Configuración de imágenes Open Graph completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Crear las imágenes usando herramientas como Canva o Figma');
console.log('2. Optimizar las imágenes para web (formato JPG, 1200x630px)');
console.log('3. Colocar las imágenes en /public/images/');
console.log('4. Verificar con Facebook Sharing Debugger');
console.log('\n🔗 Herramientas de validación:');
console.log('- Facebook: https://developers.facebook.com/tools/debug/');
console.log('- Twitter: https://cards-dev.twitter.com/validator');
console.log('- LinkedIn: https://www.linkedin.com/post-inspector/'); 