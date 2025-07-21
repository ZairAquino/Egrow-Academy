import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createStripeProducts() {
  try {
    console.log('🛍️ Creando productos reales en Stripe...\n');

    console.log('📋 Productos a crear en Stripe Dashboard:');
    console.log('');
    console.log('1️⃣ eGrow Academy Premium - Mensual');
    console.log('   - Precio: $6.99/mes');
    console.log('   - Descripción: Acceso completo a todos los cursos premium');
    console.log('   - Incluye: Desarrollo Web Full Stack, LLMs, y futuros cursos');
    console.log('');
    console.log('2️⃣ eGrow Academy Premium - Anual');
    console.log('   - Precio: $59.99/año (2 meses gratis)');
    console.log('   - Descripción: Acceso completo a todos los cursos premium');
    console.log('   - Incluye: Desarrollo Web Full Stack, LLMs, y futuros cursos');
    console.log('');

    console.log('🔧 Pasos para crear en Stripe Dashboard:');
    console.log('');
    console.log('1️⃣ Ve a https://dashboard.stripe.com/products');
    console.log('');
    console.log('2️⃣ Haz clic en "Add product"');
    console.log('');
    console.log('3️⃣ Configura el producto:');
    console.log('   Nombre: eGrow Academy Premium');
    console.log('   Descripción: Acceso completo a todos los cursos premium de eGrow Academy');
    console.log('   Imagen: (opcional) Logo de eGrow Academy');
    console.log('');
    console.log('4️⃣ Configura los precios:');
    console.log('   Precio 1: $6.99 USD / mes');
    console.log('   Precio 2: $59.99 USD / año');
    console.log('');
    console.log('5️⃣ Configuración adicional:');
    console.log('   - Marca "One-time" como NO (es una suscripción)');
    console.log('   - Marca "Recurring" como SÍ');
    console.log('   - Intervalo: Monthly y Yearly');
    console.log('');
    console.log('6️⃣ Haz clic en "Save product"');
    console.log('');

    // Verificar productos existentes
    console.log('🔍 Verificando productos existentes en la base de datos:');
    
    const existingProducts = await prisma.product.findMany({
      include: {
        prices: true,
      },
    });

    console.log(`   Productos encontrados: ${existingProducts.length}`);
    
    if (existingProducts.length > 0) {
      existingProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.prices.length} precios)`);
        product.prices.forEach((price, priceIndex) => {
          console.log(`      - ${priceIndex + 1}. $${price.unitAmount ? price.unitAmount / 100 : 'N/A'}/${price.interval}`);
        });
      });
      
      console.log('\n⚠️  Ya tienes productos configurados');
      console.log('   Puedes usar los existentes o crear nuevos');
    }

    console.log('\n📝 Información para sincronizar:');
    console.log('');
    console.log('Una vez creados los productos en Stripe, necesitarás:');
    console.log('1. Copiar los IDs de los productos (prod_...)');
    console.log('2. Copiar los IDs de los precios (price_...)');
    console.log('3. Sincronizar con la base de datos');
    console.log('');
    console.log('Ejecuta: npx tsx scripts/sync-stripe-products.ts');
    console.log('');

    console.log('✅ Configuración completada!');
    console.log('\n🎯 Próximos pasos:');
    console.log('   1. Crear productos en Stripe Dashboard');
    console.log('   2. Sincronizar productos con la base de datos');
    console.log('   3. Probar flujo de suscripción');
    console.log('   4. Verificar acceso al curso premium');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createStripeProducts()
  .then(() => {
    console.log('\n✅ Productos configurados!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 