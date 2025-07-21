import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdditionalResources() {
  try {
    console.log('🔍 Creando recursos adicionales...');

    // 1. ChatGPT Contexto Empresarial (Primero)
    const chatgptResource = await prisma.resource.create({
      data: {
        title: 'ChatGPT: Contexto Empresarial',
        slug: 'chatgpt-contexto-empresarial',
        description: 'GPT especializado en crear contextos de negocio basados en respuestas dadas. Herramienta ideal para emprendedores y profesionales que necesitan estructurar y analizar información empresarial de manera efectiva.',
        shortDescription: 'GPT especializado para crear contextos de negocio',
        category: 'HERRAMIENTA',
        type: 'LINK',
        author: 'Zair Aquino',
        fileUrl: 'https://chatgpt.com/g/g-687e84aba36c8191a44042cc330db2f1-contexto-empresarial',
        requiresAuth: false,
        isFree: true,
        rating: 4.9,
        downloadsCount: 0,
        status: 'PUBLISHED',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center'
      }
    });

    console.log('✅ Recurso ChatGPT creado:', chatgptResource.id);

    // Crear temas para ChatGPT
    const chatgptTopics = [
      {
        title: 'Introducción al Contexto Empresarial',
        description: 'Conceptos básicos sobre cómo estructurar información empresarial',
        order: 1
      },
      {
        title: 'Análisis de Respuestas',
        description: 'Cómo interpretar y organizar respuestas para crear contexto',
        order: 2
      },
      {
        title: 'Aplicaciones Prácticas',
        description: 'Casos de uso reales en diferentes industrias',
        order: 3
      }
    ];

    for (const topic of chatgptTopics) {
      await prisma.resourceTopic.create({
        data: {
          ...topic,
          resourceId: chatgptResource.id
        }
      });
    }

    // 2. Manual GEM
    const gemResource = await prisma.resource.create({
      data: {
        title: 'Manual GEM - Google Gemini',
        slug: 'manual-gem-google-gemini',
        description: 'Manual completo sobre Google Gemini (GEM) - Guía práctica para el uso y desarrollo con modelos de IA de Google. Incluye ejemplos prácticos, mejores prácticas y casos de uso avanzados.',
        shortDescription: 'Guía completa para Google Gemini y modelos de IA de Google',
        category: 'MANUAL',
        type: 'PDF',
        author: 'Google AI',
        fileUrl: '/resources/Manual GEM.pdf',
        requiresAuth: true,
        isFree: false,
        rating: 4.8,
        downloadsCount: 0,
        status: 'PUBLISHED',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&crop=center'
      }
    });

    console.log('✅ Recurso Manual GEM creado:', gemResource.id);

    // Crear temas para Manual GEM
    const gemTopics = [
      {
        title: 'Introducción a Google Gemini',
        description: 'Fundamentos y características principales del modelo GEM',
        order: 1
      },
      {
        title: 'Configuración y Setup',
        description: 'Guía paso a paso para configurar y comenzar con Gemini',
        order: 2
      },
      {
        title: 'APIs y Desarrollo',
        description: 'Cómo integrar Gemini en aplicaciones y proyectos',
        order: 3
      },
      {
        title: 'Casos de Uso Avanzados',
        description: 'Ejemplos prácticos y aplicaciones reales',
        order: 4
      },
      {
        title: 'Mejores Prácticas',
        description: 'Recomendaciones para optimizar el uso de Gemini',
        order: 5
      }
    ];

    for (const topic of gemTopics) {
      await prisma.resourceTopic.create({
        data: {
          ...topic,
          resourceId: gemResource.id
        }
      });
    }

    // 3. Manual GPT
    const gptResource = await prisma.resource.create({
      data: {
        title: 'Manual GPT - OpenAI',
        slug: 'manual-gpt-openai',
        description: 'Manual completo sobre GPT (Generative Pre-trained Transformer) - Guía práctica para el uso y desarrollo con modelos de lenguaje de OpenAI. Incluye técnicas avanzadas y optimización de prompts.',
        shortDescription: 'Guía completa para GPT y modelos de lenguaje de OpenAI',
        category: 'MANUAL',
        type: 'PDF',
        author: 'OpenAI',
        fileUrl: '/resources/Manual GPT.pdf',
        requiresAuth: true,
        isFree: false,
        rating: 4.9,
        downloadsCount: 0,
        status: 'PUBLISHED',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center'
      }
    });

    console.log('✅ Recurso Manual GPT creado:', gptResource.id);

    // Crear temas para Manual GPT
    const gptTopics = [
      {
        title: 'Fundamentos de GPT',
        description: 'Conceptos básicos y arquitectura de los modelos GPT',
        order: 1
      },
      {
        title: 'Técnicas de Prompting',
        description: 'Estrategias efectivas para crear prompts optimizados',
        order: 2
      },
      {
        title: 'Integración con APIs',
        description: 'Cómo usar las APIs de OpenAI en proyectos',
        order: 3
      },
      {
        title: 'Fine-tuning y Personalización',
        description: 'Técnicas para adaptar modelos a necesidades específicas',
        order: 4
      },
      {
        title: 'Aplicaciones Empresariales',
        description: 'Casos de uso en entornos corporativos y startups',
        order: 5
      }
    ];

    for (const topic of gptTopics) {
      await prisma.resourceTopic.create({
        data: {
          ...topic,
          resourceId: gptResource.id
        }
      });
    }

    console.log('🎉 Todos los recursos adicionales creados exitosamente!');
    console.log('📊 Recursos creados:');
    console.log('   - ChatGPT Contexto Empresarial (ID:', chatgptResource.id, ')');
    console.log('   - Manual GEM (ID:', gemResource.id, ')');
    console.log('   - Manual GPT (ID:', gptResource.id, ')');

  } catch (error) {
    console.error('❌ Error creando recursos adicionales:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdditionalResources(); 