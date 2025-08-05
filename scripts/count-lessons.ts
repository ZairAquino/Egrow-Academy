import fs from 'fs';
import path from 'path';

function countLessonsInFile(filePath: string): number {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let lessonCount = 0;
    
    for (const line of lines) {
      // Buscar patrones de IDs de lecciones
      if (line.includes("id: '") && (
        line.includes("cmdy") || 
        line.includes("cmds") || 
        line.includes("vpc-") || 
        line.includes("vcc-") ||
        line.includes("m0-") ||
        line.includes("m1-") ||
        line.includes("m2-") ||
        line.includes("m3-") ||
        line.includes("m4-")
      )) {
        lessonCount++;
      }
    }
    
    return lessonCount;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return 0;
  }
}

function analyzeAllCourses() {
  const coursesDir = path.join(process.cwd(), 'src/app/curso');
  const courses = [
    'mockup-cero',
    'videos-profesionales-ia', 
    'asistentes-virtuales-ia',
    'vibe-coding-claude-cursor',
    'monetiza-ia'
  ];

  console.log('📊 Análisis de lecciones por curso:\n');

  for (const course of courses) {
    const contentPath = path.join(coursesDir, course, 'contenido/page.tsx');
    const pagePath = path.join(coursesDir, course, 'page.tsx');
    
    let actualLessons = 0;
    let configuredLessons = 0;
    
    // Contar lecciones reales
    if (fs.existsSync(contentPath)) {
      actualLessons = countLessonsInFile(contentPath);
    }
    
    // Obtener lecciones configuradas
    if (fs.existsSync(pagePath)) {
      const pageContent = fs.readFileSync(pagePath, 'utf8');
      const lessonsMatch = pageContent.match(/lessonsCount:\s*(\d+)/);
      if (lessonsMatch) {
        configuredLessons = parseInt(lessonsMatch[1]);
      }
    }
    
    console.log(`📚 ${course}:`);
    console.log(`   Lecciones reales: ${actualLessons}`);
    console.log(`   Lecciones configuradas: ${configuredLessons}`);
    console.log(`   Estado: ${actualLessons === configuredLessons ? '✅ Sincronizado' : '❌ Desincronizado'}`);
    console.log('');
  }
}

analyzeAllCourses(); 