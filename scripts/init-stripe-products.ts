import { stripe, createStripeProduct, createStripePrice, SUBSCRIPTION_PLANS } from '../src/lib/stripe';

async function initStripeProducts() {
  console.log('🚀 Inicializando productos de Stripe para eGrow Academy...\n');

  try {
    // Verificar que Stripe esté configurado
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ Error: STRIPE_SECRET_KEY no está configurada en las variables de entorno');
      console.log('💡 Asegúrate de tener un archivo .env con las claves de Stripe');
      process.exit(1);
    }

    console.log('✅ Stripe configurado correctamente\n');

    // Crear productos para suscripciones
    console.log('📦 Creando productos de suscripción...');

    // Producto para suscripción mensual
    const monthlyProduct = await createStripeProduct({
      name: 'eGrow Academy - Plan Mensual',
      description: 'Acceso completo a todos los cursos especializados de eGrow Academy por un mes',
      metadata: {
        type: 'subscription',
        interval: 'month',
        planId: 'monthly'
      }
    });

    console.log(`✅ Producto mensual creado: ${monthlyProduct.id}`);

    // Producto para suscripción anual
    const yearlyProduct = await createStripeProduct({
      name: 'eGrow Academy - Plan Anual',
      description: 'Acceso completo a todos los cursos especializados de eGrow Academy por un año (2 meses gratis)',
      metadata: {
        type: 'subscription',
        interval: 'year',
        planId: 'yearly'
      }
    });

    console.log(`✅ Producto anual creado: ${yearlyProduct.id}\n`);

    // Crear precios para las suscripciones
    console.log('💰 Creando precios de suscripción...');

    // Precio mensual ($12.49/mes)
    const monthlyPrice = await createStripePrice({
      productId: monthlyProduct.id,
      unitAmount: 1249, // $12.49 en centavos
      currency: 'usd',
      type: 'recurring',
      interval: 'month',
      intervalCount: 1
    });

    console.log(`✅ Precio mensual creado: ${monthlyPrice.id} - $12.49/mes`);

    // Precio anual ($149.99/año)
    const yearlyPrice = await createStripePrice({
      productId: yearlyProduct.id,
      unitAmount: 14999, // $149.99 en centavos
      currency: 'usd',
      type: 'recurring',
      interval: 'year',
      intervalCount: 1
    });

    console.log(`✅ Precio anual creado: ${yearlyPrice.id} - $149.99/año\n`);

    // Crear productos para cursos individuales
    console.log('📚 Creando productos para cursos individuales...');

    // Curso de Desarrollo Web Full Stack
    const webDevProduct = await createStripeProduct({
      name: 'Desarrollo Web Full Stack',
      description: 'Curso completo de desarrollo web full stack con tecnologías modernas',
      metadata: {
        type: 'course',
        courseId: 'desarrollo-web-fullstack',
        category: 'programming'
      }
    });

    console.log(`✅ Producto curso web creado: ${webDevProduct.id}`);

    // Precio para el curso de desarrollo web ($99.99)
    const webDevPrice = await createStripePrice({
      productId: webDevProduct.id,
      unitAmount: 9999, // $99.99 en centavos
      currency: 'usd',
      type: 'one_time'
    });

    console.log(`✅ Precio curso web creado: ${webDevPrice.id} - $99.99\n`);

    // Curso de Machine Learning
    const mlProduct = await createStripeProduct({
      name: 'Fundamentos de Machine Learning',
      description: 'Curso introductorio a machine learning y inteligencia artificial',
      metadata: {
        type: 'course',
        courseId: 'fundamentos-ml',
        category: 'ai'
      }
    });

    console.log(`✅ Producto curso ML creado: ${mlProduct.id}`);

    // Precio para el curso de ML ($79.99)
    const mlPrice = await createStripePrice({
      productId: mlProduct.id,
      unitAmount: 7999, // $79.99 en centavos
      currency: 'usd',
      type: 'one_time'
    });

    console.log(`✅ Precio curso ML creado: ${mlPrice.id} - $79.99\n`);

    // Curso de Computer Vision
    const cvProduct = await createStripeProduct({
      name: 'Computer Vision con Python',
      description: 'Curso avanzado de visión por computadora y procesamiento de imágenes',
      metadata: {
        type: 'course',
        courseId: 'computer-vision',
        category: 'ai'
      }
    });

    console.log(`✅ Producto curso CV creado: ${cvProduct.id}`);

    // Precio para el curso de CV ($89.99)
    const cvPrice = await createStripePrice({
      productId: cvProduct.id,
      unitAmount: 8999, // $89.99 en centavos
      currency: 'usd',
      type: 'one_time'
    });

    console.log(`✅ Precio curso CV creado: ${cvPrice.id} - $89.99\n`);

    // Curso de Monetización con IA
    const monetizationProduct = await createStripeProduct({
      name: 'Monetiza con Inteligencia Artificial',
      description: 'Aprende a generar ingresos usando herramientas de IA',
      metadata: {
        type: 'course',
        courseId: 'monetiza-ia',
        category: 'business'
      }
    });

    console.log(`✅ Producto curso monetización creado: ${monetizationProduct.id}`);

    // Precio para el curso de monetización ($69.99)
    const monetizationPrice = await createStripePrice({
      productId: monetizationProduct.id,
      unitAmount: 6999, // $69.99 en centavos
      currency: 'usd',
      type: 'one_time'
    });

    console.log(`✅ Precio curso monetización creado: ${monetizationPrice.id} - $69.99\n`);

    // Mostrar resumen
    console.log('🎉 ¡Productos de Stripe inicializados exitosamente!\n');
    console.log('📋 Resumen de productos creados:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 SUSCRIPCIONES:');
    console.log(`   • Plan Mensual: ${monthlyProduct.id} - $12.49/mes`);
    console.log(`   • Plan Anual: ${yearlyProduct.id} - $149.99/año`);
    console.log('');
    console.log('📚 CURSOS INDIVIDUALES:');
    console.log(`   • Desarrollo Web Full Stack: ${webDevProduct.id} - $99.99`);
    console.log(`   • Fundamentos de ML: ${mlProduct.id} - $79.99`);
    console.log(`   • Computer Vision: ${cvProduct.id} - $89.99`);
    console.log(`   • Monetiza con IA: ${monetizationProduct.id} - $69.99`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Actualizar configuración en el código
    console.log('💡 Para usar estos productos, actualiza las constantes en src/lib/stripe.ts:');
    console.log('');
    console.log('export const STRIPE_PRODUCTS = {');
    console.log(`  MONTHLY_SUBSCRIPTION: '${monthlyProduct.id}',`);
    console.log(`  YEARLY_SUBSCRIPTION: '${yearlyProduct.id}',`);
    console.log(`  WEB_DEV_COURSE: '${webDevProduct.id}',`);
    console.log(`  ML_COURSE: '${mlProduct.id}',`);
    console.log(`  CV_COURSE: '${cvProduct.id}',`);
    console.log(`  MONETIZATION_COURSE: '${monetizationProduct.id}',`);
    console.log('};');
    console.log('');
    console.log('export const STRIPE_PRICES = {');
    console.log(`  MONTHLY: '${monthlyPrice.id}',`);
    console.log(`  YEARLY: '${yearlyPrice.id}',`);
    console.log(`  WEB_DEV: '${webDevPrice.id}',`);
    console.log(`  ML: '${mlPrice.id}',`);
    console.log(`  CV: '${cvPrice.id}',`);
    console.log(`  MONETIZATION: '${monetizationPrice.id}',`);
    console.log('};');

  } catch (error) {
    console.error('❌ Error inicializando productos de Stripe:', error);
    process.exit(1);
  }
}

// Ejecutar el script
initStripeProducts(); 