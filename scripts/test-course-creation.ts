import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api/admin/courses';

// Datos de prueba para crear un curso completo
const courseData = {
  // Información Básica (Step 1)
  title: "Curso de Testing Automatizado - Creado con Sistema Admin",
  slug: "testing-automatizado-admin-system",
  description: "Un curso completo sobre testing automatizado creado usando nuestro nuevo sistema de administración de cursos. Este curso demuestra todas las funcionalidades implementadas.",
  shortDescription: "Aprende testing automatizado desde cero con ejemplos prácticos y herramientas modernas.",
  imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  mainVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  price: 127,
  category: "HABILIDADES_IRREMPLAZABLES",
  difficulty: "INTERMEDIATE",
  durationHours: 12,
  language: "Español",
  
  // Instructor (Step 2)
  instructor: {
    name: "David Rodriguez",
    title: "Senior Software Engineer & Testing Specialist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    bio: "Con más de 8 años de experiencia en desarrollo de software y testing automatizado, David ha trabajado en empresas tech líderes implementando estrategias de testing que han mejorado la calidad del software y reducido bugs en producción."
  },
  
  // Objetivos y Contenido (Step 3)
  whatYouWillLearn: [
    "Dominar los fundamentos del testing automatizado",
    "Implementar testing unitario con Jest y Testing Library",
    "Crear tests de integración robustos y confiables",
    "Configurar pipelines de CI/CD con testing automatizado",
    "Aplicar testing E2E con Playwright y Cypress",
    "Desarrollar estrategias de testing para proyectos reales",
    "Optimizar la performance y confiabilidad de tus tests",
    "Generar reportes de cobertura y calidad de código"
  ],
  tools: [
    "Jest",
    "Testing Library",
    "Playwright", 
    "Cypress",
    "GitHub Actions",
    "SonarQube"
  ],
  prerequisites: [
    "Conocimientos básicos de JavaScript/TypeScript",
    "Experiencia previa con desarrollo web",
    "Computadora con Node.js instalado",
    "Cuenta en GitHub para ejercicios prácticos"
  ],
  
  // Módulos y Lecciones (Step 4)
  modules: [
    {
      title: "MÓDULO 1: Fundamentos de Testing",
      description: "Establecer las bases sólidas del testing automatizado y entender su importancia en el desarrollo moderno.",
      lessons: [
        {
          title: "Introducción al Testing Automatizado",
          description: "Por qué el testing automatizado es crucial en el desarrollo moderno.",
          content: "# Introducción al Testing\n\nEl testing automatizado es una práctica fundamental...",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: 25,
          type: "Video",
          order: 1
        },
        {
          title: "Tipos de Testing: Unitario, Integración, E2E",
          description: "Comprende los diferentes niveles de testing y cuándo usar cada uno.",
          content: "# Tipos de Testing\n\n## Testing Unitario\n\nSe enfoca en probar...",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: 30,
          type: "Video",
          order: 2
        },
        {
          title: "Configuración del Entorno de Testing",
          description: "Configura tu entorno de desarrollo para testing automatizado.",
          content: "# Configuración del Entorno\n\n```bash\nnpm install --save-dev jest\n```",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: 20,
          type: "Lab",
          order: 3
        }
      ]
    },
    {
      title: "MÓDULO 2: Testing Unitario con Jest",
      description: "Domina Jest y Testing Library para crear tests unitarios robustos y mantenibles.",
      lessons: [
        {
          title: "Sintaxis y APIs básicas de Jest",
          description: "Aprende la sintaxis fundamental de Jest y sus métodos principales.",
          content: "# Jest Básico\n\n```javascript\ndescribe('Calculator', () => {\n  test('should add numbers', () => {\n    expect(add(2, 3)).toBe(5);\n  });\n});\n```",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: 35,
          type: "Video",
          order: 1
        },
        {
          title: "Mocking y Spies en Jest",
          description: "Técnicas avanzadas de mocking para aislar unidades de código.",
          content: "# Mocking en Jest\n\nEl mocking es fundamental para...",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: 40,
          type: "Video",
          order: 2
        }
      ]
    },
    {
      title: "MÓDULO 3: Testing E2E con Playwright",
      description: "Implementa testing end-to-end moderno con Playwright para aplicaciones web.",
      lessons: [
        {
          title: "Configuración e instalación de Playwright",
          description: "Setup completo de Playwright en tu proyecto.",
          content: "# Playwright Setup\n\n```bash\nnpm init playwright@latest\n```",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: 25,
          type: "Lab",
          order: 1
        },
        {
          title: "Escribiendo tu primer test E2E",
          description: "Crea tu primer test end-to-end funcional.",
          content: "# Primer Test E2E\n\n```javascript\ntest('homepage has title', async ({ page }) => {\n  await page.goto('/');\n  await expect(page).toHaveTitle(/Home/);\n});\n```",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: 45,
          type: "Video",
          order: 2
        }
      ]
    }
  ],
  
  // Testimonios (Step 5)
  testimonials: [
    {
      name: "María González",
      text: "Este curso me ayudó a implementar testing automatizado en mi empresa. Los resultados fueron inmediatos: 90% menos bugs en producción."
    },
    {
      name: "Carlos Mendoza",
      text: "Excelente metodología y ejemplos prácticos. Ahora nuestro equipo tiene confianza para hacer deploys diarios gracias al testing robusto."
    },
    {
      name: "Ana Patricia López",
      text: "David explica de manera muy clara conceptos complejos. Ya implementé CI/CD con testing automatizado en 3 proyectos."
    },
    {
      name: "Roberto Silva",
      text: "La mejor inversión en educación que he hecho. Mi productividad como developer aumentó 300% con estas técnicas."
    }
  ],
  
  // Configuración (Step 6)
  status: "DRAFT" as const
};

async function testEndpoint(endpoint: string, method: string, data?: any) {
  try {
    console.log(`\n🔄 Testing ${method} ${endpoint}...`);
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(data && { body: JSON.stringify(data) })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${endpoint} - Status: ${response.status}`);
      return result;
    } else {
      console.log(`❌ ${endpoint} - Status: ${response.status}`);
      console.log('Error:', result);
      return null;
    }
  } catch (error) {
    console.log(`💥 ${endpoint} - Error:`, error.message);
    return null;
  }
}

async function runTestSuite() {
  console.log('🚀 Iniciando Test Suite del Sistema de Creación de Cursos\n');
  console.log('=' .repeat(60));
  
  // Test 1: Validación de slug
  console.log('\n📋 FASE 1: Testing de Validaciones');
  const slugValidation = await testEndpoint('/validate', 'POST', {
    field: 'slug',
    value: courseData.slug
  });
  
  if (slugValidation?.valid) {
    console.log(`✅ Slug "${courseData.slug}" está disponible`);
  }
  
  // Test 2: Validación de título
  const titleValidation = await testEndpoint('/validate', 'POST', {
    field: 'title',
    value: courseData.title
  });
  
  if (titleValidation?.valid) {
    console.log(`✅ Título "${courseData.title}" es válido`);
    if (titleValidation.generatedSlug) {
      console.log(`📝 Slug generado automáticamente: ${titleValidation.generatedSlug}`);
    }
  }
  
  // Test 3: Validación de URL de video
  const videoValidation = await testEndpoint('/validate', 'POST', {
    field: 'videoUrl',
    value: courseData.mainVideoUrl
  });
  
  if (videoValidation?.valid) {
    console.log(`✅ URL de video es válida`);
  }
  
  // Test 4: Preview del curso
  console.log('\n📋 FASE 2: Testing de Preview');
  const preview = await testEndpoint('/preview', 'POST', courseData);
  
  if (preview?.success) {
    console.log(`✅ Preview generado correctamente`);
    console.log(`📊 Nivel de completitud: ${preview.metadata?.completionLevel}%`);
    console.log(`⏱️ Duración total: ${preview.metadata?.totalDuration} horas`);
    
    if (preview.metadata?.warnings?.length > 0) {
      console.log(`⚠️ Advertencias: ${preview.metadata.warnings.length}`);
      preview.metadata.warnings.forEach((warning: string, index: number) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
    }
  }
  
  // Test 5: Creación del curso
  console.log('\n📋 FASE 3: Testing de Creación');
  const creation = await testEndpoint('/create', 'POST', courseData);
  
  if (creation?.success) {
    console.log(`✅ Curso creado exitosamente!`);
    console.log(`🆔 ID del curso: ${creation.courseId}`);
    console.log(`🔗 URL del curso: ${creation.courseUrl}`);
    console.log(`📚 ${creation.modulesCreated} módulos creados`);
    console.log(`📖 ${creation.lessonsCreated} lecciones creadas`);
  }
  
  // Resumen final
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RESUMEN DEL TESTING');
  console.log('=' .repeat(60));
  
  const tests = [
    { name: 'Validación de Slug', result: slugValidation?.valid },
    { name: 'Validación de Título', result: titleValidation?.valid },
    { name: 'Validación de Video', result: videoValidation?.valid },
    { name: 'Generación de Preview', result: preview?.success },
    { name: 'Creación de Curso', result: creation?.success }
  ];
  
  tests.forEach(test => {
    const status = test.result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test.name}`);
  });
  
  const passedTests = tests.filter(t => t.result).length;
  const totalTests = tests.length;
  
  console.log(`\n🎯 Resultado: ${passedTests}/${totalTests} tests pasaron`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ¡Todos los tests pasaron! Sistema funcionando correctamente.');
  } else {
    console.log('⚠️ Algunos tests fallaron. Revisar logs arriba.');
  }
  
  return { passedTests, totalTests, creation };
}

// Ejecutar tests
runTestSuite().then((result) => {
  console.log(`\n✨ Testing completado: ${result.passedTests}/${result.totalTests}`);
  process.exit(result.passedTests === result.totalTests ? 0 : 1);
}).catch((error) => {
  console.error('💥 Error en testing:', error);
  process.exit(1);
});