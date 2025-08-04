const { PrismaClient } = require('@prisma/client');

const prismaProd = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

async function checkProductionEnums() {
  try {
    console.log('🔍 Verificando enums en producción...');
    
    // Verificar recursos existentes y sus categorías
    const resources = await prismaProd.resource.findMany();
    console.log(`\n📁 Recursos en producción: ${resources.length}`);
    
    if (resources.length > 0) {
      console.log('\n📋 Categorías de recursos en producción:');
      const categories = [...new Set(resources.map(r => r.category))];
      categories.forEach(category => {
        const count = resources.filter(r => r.category === category).length;
        console.log(`- ${category}: ${count} recursos`);
      });
    }
    
    // Intentar crear un recurso con cada categoría para ver cuáles están disponibles
    console.log('\n🧪 Probando categorías disponibles...');
    
    const testCategories = [
      'WEBINAR', 'MANUAL', 'TUTORIAL', 'PAPER', 'HERRAMIENTA', 
      'DATASET', 'PODCAST', 'LIBRO', 'EBOOK', 'VIDEO', 
      'TEMPLATE', 'TOOL', 'GUIDE', 'CASE_STUDY', 'WHITEPAPER', 
      'CHECKLIST', 'WORKSHOP', 'ULTIMO_WEBINAR', 'EN_VIVO'
    ];
    
    for (const category of testCategories) {
      try {
        // Intentar crear un recurso temporal para probar la categoría
        const testResource = await prismaProd.resource.create({
          data: {
            title: `Test - ${category}`,
            description: 'Test resource',
            category: category,
            type: 'PDF',
            status: 'DRAFT',
            fileUrl: 'test.pdf',
            fileSize: 1000
          }
        });
        
        console.log(`✅ Categoría ${category} - DISPONIBLE`);
        
        // Eliminar el recurso de prueba
        await prismaProd.resource.delete({
          where: { id: testResource.id }
        });
        
      } catch (error) {
        console.log(`❌ Categoría ${category} - NO DISPONIBLE: ${error.message}`);
      }
    }
    
    console.log('\n📊 Resumen:');
    console.log('Las categorías que aparecen como "DISPONIBLE" están en producción');
    console.log('Las categorías que aparecen como "NO DISPONIBLE" no están en producción');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prismaProd.$disconnect();
  }
}

checkProductionEnums().catch(console.error); 