import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

async function testAuthWithEnv() {
  try {
    console.log('🔍 [TEST-AUTH-ENV] Probando autenticación con variables de entorno...\n');

    // Verificar JWT_SECRET
    const jwtSecret = process.env.JWT_SECRET;
    console.log(`🔑 [TEST-AUTH-ENV] JWT_SECRET: ${jwtSecret ? 'Configurado' : 'No configurado'}`);
    
    if (!jwtSecret) {
      console.log('❌ [TEST-AUTH-ENV] JWT_SECRET no está configurado');
      console.log('💡 [TEST-AUTH-ENV] Verifica que el archivo .env.local existe y contiene JWT_SECRET');
      return;
    }

    // Buscar el usuario Isaac Lopez
    const user = await prisma.user.findFirst({
      where: {
        email: 'IsaacL@gmail.com'
      }
    });

    if (!user) {
      console.log('❌ [TEST-AUTH-ENV] Usuario no encontrado');
      return;
    }

    console.log(`✅ [TEST-AUTH-ENV] Usuario encontrado: ${user.firstName} ${user.lastName}`);

    // Generar token JWT
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });
    console.log(`✅ [TEST-AUTH-ENV] Token generado: ${token.substring(0, 50)}...`);

    // Verificar que el token se puede decodificar
    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      console.log(`✅ [TEST-AUTH-ENV] Token verificado - User ID: ${decoded.userId}`);
    } catch (error) {
      console.log(`❌ [TEST-AUTH-ENV] Error verificando token: ${error}`);
    }

    // Crear sesión
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      }
    });

    console.log(`✅ [TEST-AUTH-ENV] Sesión creada con ID: ${session.id}`);

    // Verificar enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: user.id
      },
      include: {
        course: {
          select: {
            title: true,
            slug: true
          }
        }
      }
    });

    console.log(`\n📚 [TEST-AUTH-ENV] Cursos inscritos: ${enrollments.length}`);
    for (const enrollment of enrollments) {
      console.log(`   - ${enrollment.course.title} (${enrollment.course.slug})`);
    }

    console.log('\n🎯 [TEST-AUTH-ENV] Instrucciones:');
    console.log('1. Ve a http://localhost:3000/login');
    console.log('2. Inicia sesión con:');
    console.log(`   - Email: ${user.email}`);
    console.log('   - Contraseña: (la contraseña que configuraste)');
    console.log('3. Una vez logueado, ve a http://localhost:3000/my-courses');
    console.log('4. Deberías ver tus cursos inscritos');

  } catch (error) {
    console.error('❌ [TEST-AUTH-ENV] Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuthWithEnv(); 