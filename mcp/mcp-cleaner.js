const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * MCP Cleaner - Servidor MCP personalizado para limpieza y optimización de proyectos
 * Combina funcionalidades de limpieza de archivos, node_modules, y optimización de espacio
 */

class MCPCleaner {
  constructor() {
    this.projectRoot = process.cwd();
    this.cleanupStats = {
      filesRemoved: 0,
      spaceFreed: 0,
      directoriesCleaned: 0
    };
  }

  /**
   * Analiza el uso de espacio en el proyecto
   */
  analyzeSpace() {
    console.log('🔍 Analizando uso de espacio...');
    
    const analysis = {
      totalSize: 0,
      largestDirectories: [],
      nodeModulesSize: 0,
      logFiles: [],
      tempFiles: [],
      buildArtifacts: []
    };

    // Analizar directorios principales
    const directories = ['node_modules', 'dist', 'build', '.git', 'logs', 'tmp'];
    
    directories.forEach(dir => {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        const size = this.getDirectorySize(dirPath);
        analysis.largestDirectories.push({ name: dir, size });
        analysis.totalSize += size;
        
        if (dir === 'node_modules') {
          analysis.nodeModulesSize = size;
        }
      }
    });

    // Buscar archivos de log
    analysis.logFiles = this.findFilesByPattern('.log');
    
    // Buscar archivos temporales
    analysis.tempFiles = this.findFilesByPattern('.tmp');
    
    // Buscar artefactos de build
    analysis.buildArtifacts = this.findBuildArtifacts();

    console.log('📊 Análisis completado:');
    console.log(`   - Tamaño total: ${this.formatBytes(analysis.totalSize)}`);
    console.log(`   - node_modules: ${this.formatBytes(analysis.nodeModulesSize)}`);
    console.log(`   - Archivos de log: ${analysis.logFiles.length}`);
    console.log(`   - Archivos temporales: ${analysis.tempFiles.length}`);
    console.log(`   - Artefactos de build: ${analysis.buildArtifacts.length}`);

    return analysis;
  }

  /**
   * Limpia archivos temporales y de log
   */
  cleanTempFiles() {
    console.log('🧹 Limpiando archivos temporales...');
    
    const patterns = [
      '*.log',
      '*.tmp',
      '*.temp',
      '.DS_Store',
      'Thumbs.db',
      '*.swp',
      '*.swo'
    ];

    let filesRemoved = 0;
    let spaceFreed = 0;

    patterns.forEach(pattern => {
      const files = this.findFilesByPattern(pattern);
      files.forEach(file => {
        try {
          const stats = fs.statSync(file);
          fs.unlinkSync(file);
          filesRemoved++;
          spaceFreed += stats.size;
        } catch (error) {
          // Ignorar errores de archivos que no se pueden eliminar
        }
      });
    });

    this.cleanupStats.filesRemoved += filesRemoved;
    this.cleanupStats.spaceFreed += spaceFreed;

    console.log(`✅ Eliminados ${filesRemoved} archivos temporales`);
    console.log(`💾 Espacio liberado: ${this.formatBytes(spaceFreed)}`);
  }

  /**
   * Limpia artefactos de build
   */
  cleanBuildArtifacts() {
    console.log('🏗️ Limpiando artefactos de build...');
    
    const buildDirs = ['dist', 'build', 'out', '.next', 'coverage'];
    let dirsCleaned = 0;
    let spaceFreed = 0;

    buildDirs.forEach(dir => {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        try {
          const size = this.getDirectorySize(dirPath);
          fs.rmSync(dirPath, { recursive: true, force: true });
          dirsCleaned++;
          spaceFreed += size;
        } catch (error) {
          console.log(`⚠️ No se pudo eliminar ${dir}: ${error.message}`);
        }
      }
    });

    this.cleanupStats.directoriesCleaned += dirsCleaned;
    this.cleanupStats.spaceFreed += spaceFreed;

    console.log(`✅ Eliminados ${dirsCleaned} directorios de build`);
    console.log(`💾 Espacio liberado: ${this.formatBytes(spaceFreed)}`);
  }

  /**
   * Optimiza node_modules
   */
  optimizeNodeModules() {
    console.log('📦 Optimizando node_modules...');
    
    const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log('ℹ️ No se encontró node_modules');
      return;
    }

    try {
      // Verificar dependencias no usadas
      console.log('🔍 Verificando dependencias no usadas...');
      execSync('npm prune', { stdio: 'inherit' });
      
      // Limpiar cache de npm
      console.log('🧹 Limpiando cache de npm...');
      execSync('npm cache clean --force', { stdio: 'inherit' });
      
      console.log('✅ node_modules optimizado');
    } catch (error) {
      console.log(`⚠️ Error optimizando node_modules: ${error.message}`);
    }
  }

  /**
   * Encuentra archivos por patrón
   */
  findFilesByPattern(pattern) {
    const files = [];
    const self = this;
    
    function searchRecursively(dir) {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          searchRecursively(fullPath);
        } else if (self.matchesPattern(item, pattern)) {
          files.push(fullPath);
        }
      });
    }
    
    searchRecursively(this.projectRoot);
    return files;
  }

  /**
   * Verifica si un archivo coincide con un patrón
   */
  matchesPattern(filename, pattern) {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return regex.test(filename);
  }

  /**
   * Encuentra artefactos de build
   */
  findBuildArtifacts() {
    const artifacts = [];
    const patterns = [
      '*.min.js',
      '*.min.css',
      '*.map',
      '*.bundle.js',
      '*.chunk.js'
    ];
    
    patterns.forEach(pattern => {
      artifacts.push(...this.findFilesByPattern(pattern));
    });
    
    return artifacts;
  }

  /**
   * Obtiene el tamaño de un directorio
   */
  getDirectorySize(dirPath) {
    let size = 0;
    
    function calculateSize(dir) {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          calculateSize(fullPath);
        } else {
          size += stat.size;
        }
      });
    }
    
    calculateSize(dirPath);
    return size;
  }

  /**
   * Formatea bytes a formato legible
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Ejecuta limpieza completa
   */
  async runFullCleanup() {
    console.log('🚀 Iniciando limpieza completa del proyecto...\n');
    
    // Analizar espacio antes de limpiar
    const beforeAnalysis = this.analyzeSpace();
    console.log('');
    
    // Limpiar archivos temporales
    this.cleanTempFiles();
    console.log('');
    
    // Limpiar artefactos de build
    this.cleanBuildArtifacts();
    console.log('');
    
    // Optimizar node_modules
    this.optimizeNodeModules();
    console.log('');
    
    // Analizar espacio después de limpiar
    const afterAnalysis = this.analyzeSpace();
    console.log('');
    
    // Mostrar resumen
    this.showCleanupSummary(beforeAnalysis, afterAnalysis);
  }

  /**
   * Muestra resumen de la limpieza
   */
  showCleanupSummary(before, after) {
    const spaceSaved = before.totalSize - after.totalSize;
    
    console.log('📊 RESUMEN DE LIMPIEZA');
    console.log('======================');
    console.log(`📁 Archivos eliminados: ${this.cleanupStats.filesRemoved}`);
    console.log(`🗂️ Directorios limpiados: ${this.cleanupStats.directoriesCleaned}`);
    console.log(`💾 Espacio liberado: ${this.formatBytes(spaceSaved)}`);
    console.log(`📈 Reducción: ${((spaceSaved / before.totalSize) * 100).toFixed(1)}%`);
    console.log('');
    console.log('🎉 ¡Limpieza completada exitosamente!');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const cleaner = new MCPCleaner();
  cleaner.runFullCleanup();
}

module.exports = MCPCleaner; 