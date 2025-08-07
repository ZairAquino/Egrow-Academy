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
    
    // Buscar títulos de lecciones específicamente
    const lessonTitleMatches = content.match(/title: '[0-9]+\.[0-9]+ [^']+',/g);
    const totalLessons = lessonTitleMatches ? lessonTitleMatches.length : 0;
    
    console.log(`📚 Total de lecciones encontradas: ${totalLessons}`);
    
    // Contar lecciones por módulo usando títulos
    const moduleSections = content.split(/id: \d+,/);
    console.log('\n📋 Desglose por módulo:');
    
    for (let i = 1; i < moduleSections.length; i++) {
      const moduleContent = moduleSections[i];
      const lessonCount = (moduleContent.match(/title: '[0-9]+\.[0-9]+ [^']+',/g) || []).length;
      console.log(`   Módulo ${i}: ${lessonCount} lecciones`);
    }
    
    console.log(`\n✅ Resumen: ${totalLessons} lecciones en ${totalModules} módulos`);
    
    // Mostrar todas las lecciones encontradas
    console.log('\n📝 Lista de todas las lecciones:');
    if (lessonTitleMatches) {
      lessonTitleMatches.forEach((match, index) => {
        const title = match.replace(/title: '([^']+)',/, '$1');
        console.log(`   ${index + 1}. ${title}`);
      });
    }
    
    return { totalLessons, totalModules };
    
  } catch (error) {
    console.error('❌ Error contando lecciones:', error);
    return { totalLessons: 0, totalModules: 0 };
  }
}

countLessons(); 