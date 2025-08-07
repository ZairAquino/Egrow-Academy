import fs from 'fs';
import path from 'path';

async function countLessons() {
  try {
    console.log('🔍 [COUNT] Contando lecciones del curso de guiones...');
    
    const filePath = path.join(process.cwd(), 'src/app/curso/guiones-videos-promocionales-ia/contenido/page.tsx');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar todos los módulos
    const moduleMatches = content.match(/id: \d+,/g);
    const totalModules = moduleMatches ? moduleMatches.length : 0;
    
    console.log(`📊 Total de módulos encontrados: ${totalModules}`);
    
    // Buscar todas las lecciones (cada lección tiene un id único)
    const lessonMatches = content.match(/id: 'cme[^']+',/g);
    const totalLessons = lessonMatches ? lessonMatches.length : 0;
    
    console.log(`📚 Total de lecciones encontradas: ${totalLessons}`);
    
    // Contar lecciones por módulo
    const moduleSections = content.split(/id: \d+,/);
    console.log('\n📋 Desglose por módulo:');
    
    for (let i = 1; i < moduleSections.length; i++) {
      const moduleContent = moduleSections[i];
      const lessonCount = (moduleContent.match(/id: 'cme[^']+',/g) || []).length;
      console.log(`   Módulo ${i}: ${lessonCount} lecciones`);
    }
    
    console.log(`\n✅ Resumen: ${totalLessons} lecciones en ${totalModules} módulos`);
    
    return { totalLessons, totalModules };
    
  } catch (error) {
    console.error('❌ Error contando lecciones:', error);
    return { totalLessons: 0, totalModules: 0 };
  }
}

countLessons(); 