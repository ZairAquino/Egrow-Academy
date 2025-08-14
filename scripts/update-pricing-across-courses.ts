import * as fs from 'fs';
import * as path from 'path';

/**
 * Script para encontrar y reportar archivos que contienen precios hardcodeados
 * y necesitan ser actualizados para usar el sistema de múltiples monedas
 */

// Patrones comunes de precios hardcodeados que debemos buscar
const PRICE_PATTERNS = [
  /\$12\.49/g,
  /\$129\.90/g,
  /\$4\.00/g,
  /\$4/g,
  /price-currency">\$/g,
  /price-amount">\d+</g,
  /COURSE_PRICE_USD_MINOR/g,
  /USD\/mes/g,
  /USD\/año/g,
];

// Directorios donde buscar archivos de cursos
const SEARCH_DIRECTORIES = [
  'src/app/curso',
  'src/components/courses',
  'src/pages/curso' // por si hay páginas legacy
];

interface FileMatch {
  file: string;
  matches: Array<{
    line: number;
    content: string;
    pattern: string;
  }>;
}

function findPriceMatches(directory: string): FileMatch[] {
  const results: FileMatch[] = [];
  
  if (!fs.existsSync(directory)) {
    console.log(`⚠️  Directorio no encontrado: ${directory}`);
    return results;
  }

  function scanFile(filePath: string): FileMatch | null {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.jsx') && !filePath.endsWith('.js')) {
      return null;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      const matches: FileMatch['matches'] = [];

      lines.forEach((line, index) => {
        PRICE_PATTERNS.forEach((pattern) => {
          const match = line.match(pattern);
          if (match) {
            matches.push({
              line: index + 1,
              content: line.trim(),
              pattern: pattern.toString()
            });
          }
        });
      });

      if (matches.length > 0) {
        return {
          file: filePath,
          matches
        };
      }
    } catch (error) {
      console.log(`⚠️  Error leyendo archivo ${filePath}:`, error);
    }

    return null;
  }

  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile()) {
        const match = scanFile(fullPath);
        if (match) {
          results.push(match);
        }
      }
    });
  }

  scanDirectory(directory);
  return results;
}

function generateUpdateInstructions(matches: FileMatch[]) {
  console.log('\n📋 INSTRUCCIONES DE ACTUALIZACIÓN\n');
  console.log('Para cada archivo listado abajo, sigue estos pasos:\n');

  console.log('1. Importa las funciones necesarias:');
  console.log('   import { useCurrencyPricing } from \'@/hooks/useCurrencyPricing\';');
  console.log('   // O para componentes no-React:');
  console.log('   import { getCurrencySymbol, getDisplayPrice, getCourseMinorAmount } from \'@/lib/pricing\';');
  
  console.log('\n2. En componentes React, usa el hook:');
  console.log('   const { getFormattedPrice, getMinorAmount, currency } = useCurrencyPricing();');
  
  console.log('\n3. Reemplaza precios hardcodeados:');
  console.log('   - $12.49 → getFormattedPrice("monthly")');
  console.log('   - $129.90 → getFormattedPrice("yearly")');
  console.log('   - $4.00 → getFormattedPrice("course")');
  console.log('   - COURSE_PRICE_USD_MINOR → getMinorAmount("course")');

  console.log('\n4. O usa el componente PriceCard:');
  console.log('   import PriceCard from \'@/components/pricing/PriceCard\';');
  console.log('   <PriceCard type="course" showRadio={true} />');

  console.log('\n' + '='.repeat(80) + '\n');
}

function main() {
  console.log('🔍 Escaneando archivos en busca de precios hardcodeados...\n');

  let totalMatches: FileMatch[] = [];

  SEARCH_DIRECTORIES.forEach((dir) => {
    console.log(`📁 Escaneando: ${dir}`);
    const matches = findPriceMatches(dir);
    totalMatches = [...totalMatches, ...matches];
    console.log(`   Encontrados ${matches.length} archivos con precios hardcodeados\n`);
  });

  if (totalMatches.length === 0) {
    console.log('✅ ¡Excelente! No se encontraron precios hardcodeados.');
    console.log('   Todos los archivos ya están usando el sistema de múltiples monedas.');
    return;
  }

  console.log(`\n⚠️  RESUMEN: ${totalMatches.length} archivos necesitan actualización\n`);

  // Mostrar detalles de cada archivo
  totalMatches.forEach((fileMatch, index) => {
    console.log(`${index + 1}. ${fileMatch.file}`);
    fileMatch.matches.forEach((match) => {
      console.log(`   Línea ${match.line}: ${match.content}`);
    });
    console.log('');
  });

  generateUpdateInstructions(totalMatches);

  // Guardar reporte
  const reportPath = path.join(process.cwd(), 'backups', 'pricing-update-report.json');
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalFiles: totalMatches.length,
    files: totalMatches
  }, null, 2));

  console.log(`📄 Reporte detallado guardado en: ${reportPath}`);
  console.log('\n🚀 Usa este reporte para actualizar sistemáticamente cada archivo.');
}

if (require.main === module) {
  main();
}