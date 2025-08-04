const { PrismaClient } = require('@prisma/client');

const prismaProd = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

async function debugProductionEnums() {
  try {
    console.log('🔍 Debuggeando enums en producción...');
    
    // Verificar recursos existentes
    const resources = await prismaProd.resource.findMany();
    console.log(`Recursos en producción: ${resources.length}`);
    
    // Intentar crear un recurso con ULTIMO_WEBINAR
    console.log('\n🧪 Probando ULTIMO_WEBINAR...');
    try {
      const testResource = await prismaProd.resource.create({
        data: {
          title: 'Test ULTIMO_WEBINAR',
          description: 'Test',
          category: 'ULTIMO_WEBINAR',
          type: 'PDF',
          status: 'DRAFT',
          fileUrl: 'test.pdf',
          fileSize: 1000
        }
      });
      console.log('✅ ULTIMO_WEBINAR funciona');
      await prismaProd.resource.delete({ where: { id: testResource.id } });
    } catch (error) {
      console.log('❌ ULTIMO_WEBINAR falla:', error.message);
    }
    
    // Intentar crear un recurso con EN_VIVO
    console.log('\n🧪 Probando EN_VIVO...');
    try {
      const testResource = await prismaProd.resource.create({
        data: {
          title: 'Test EN_VIVO',
          description: 'Test',
          category: 'EN_VIVO',
          type: 'PDF',
          status: 'DRAFT',
          fileUrl: 'test.pdf',
          fileSize: 1000
        }
      });
      console.log('✅ EN_VIVO funciona');
      await prismaProd.resource.delete({ where: { id: testResource.id } });
    } catch (error) {
      console.log('❌ EN_VIVO falla:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prismaProd.$disconnect();
  }
}

debugProductionEnums().catch(console.error); 