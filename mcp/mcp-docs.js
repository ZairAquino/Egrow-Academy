const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * MCP (Model Context Protocol) para documentación automática
 * Analiza el proyecto y genera documentación OpenAPI y JSDoc
 */

class MCPDocumentation {
  constructor() {
    this.projectRoot = process.cwd();
    this.docsPath = path.join(this.projectRoot, 'docs');
    this.openApiPath = path.join(this.projectRoot, 'openapi.json');
  }

  /**
   * Analiza la estructura del proyecto
   */
  analyzeProject() {
    console.log('🔍 Analizando estructura del proyecto...');
    
    const structure = {
      htmlFiles: this.findFiles('.html'),
      cssFiles: this.findFiles('.css'),
      jsFiles: this.findFiles('.js'),
      images: this.findFiles('.png', 'images/'),
      totalFiles: 0
    };

    structure.totalFiles = structure.htmlFiles.length + 
                          structure.cssFiles.length + 
                          structure.jsFiles.length + 
                          structure.images.length;

    console.log('📊 Estructura del proyecto:');
    console.log(`   - Archivos HTML: ${structure.htmlFiles.length}`);
    console.log(`   - Archivos CSS: ${structure.cssFiles.length}`);
    console.log(`   - Archivos JS: ${structure.jsFiles.length}`);
    console.log(`   - Imágenes: ${structure.images.length}`);
    console.log(`   - Total: ${structure.totalFiles} archivos`);

    return structure;
  }

  /**
   * Encuentra archivos por extensión
   */
  findFiles(extension, directory = '') {
    const searchPath = path.join(this.projectRoot, directory);
    const files = [];
    
    if (fs.existsSync(searchPath)) {
      const items = fs.readdirSync(searchPath, { withFileTypes: true });
      
      for (const item of items) {
        if (item.isDirectory()) {
          const subFiles = this.findFiles(extension, path.join(directory, item.name));
          files.push(...subFiles);
        } else if (item.name.endsWith(extension)) {
          files.push(path.join(directory, item.name));
        }
      }
    }
    
    return files;
  }

  /**
   * Genera especificación OpenAPI
   */
  generateOpenAPI() {
    console.log('📝 Generando especificación OpenAPI...');
    
    const openApiSpec = {
      openapi: '3.0.0',
      info: {
        title: 'eGrow Academy API',
        description: 'API para la plataforma educativa de inteligencia artificial y aprendizaje automático',
        version: '1.0.0',
        contact: {
          name: 'eGrow Academy Team',
          url: 'https://github.com/ZairAquino/Egrow-Academy'
        }
      },
      servers: [
        {
          url: 'http://localhost:8000',
          description: 'Servidor de desarrollo'
        }
      ],
      paths: this.generatePaths(),
      components: {
        schemas: this.generateSchemas()
      }
    };

    fs.writeFileSync(this.openApiPath, JSON.stringify(openApiSpec, null, 2));
    console.log('✅ Especificación OpenAPI generada en:', this.openApiPath);
    
    return openApiSpec;
  }

  /**
   * Genera rutas de la API basadas en archivos HTML
   */
  generatePaths() {
    const htmlFiles = this.findFiles('.html');
    const paths = {};

    htmlFiles.forEach(file => {
      const route = file === 'index.html' ? '/' : `/${file}`;
      const name = file.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      paths[route] = {
        get: {
          summary: `Página de ${name}`,
          description: `Retorna la página ${name} de eGrow Academy`,
          responses: {
            '200': {
              description: `Página HTML de ${name}`,
              content: {
                'text/html': {
                  schema: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      };
    });

    return paths;
  }

  /**
   * Genera esquemas de datos
   */
  generateSchemas() {
    return {
      Course: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único del curso'
          },
          title: {
            type: 'string',
            description: 'Título del curso'
          },
          description: {
            type: 'string',
            description: 'Descripción del curso'
          },
          duration: {
            type: 'string',
            description: 'Duración del curso'
          },
          level: {
            type: 'string',
            enum: ['Principiante', 'Intermedio', 'Avanzado'],
            description: 'Nivel del curso'
          },
          category: {
            type: 'string',
            enum: ['Curso Corto', 'Especialización'],
            description: 'Categoría del curso'
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único del usuario'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email del usuario'
          },
          name: {
            type: 'string',
            description: 'Nombre del usuario'
          }
        }
      }
    };
  }

  /**
   * Genera documentación JSDoc
   */
  generateJSDoc() {
    console.log('📚 Generando documentación JSDoc...');
    
    try {
      execSync('npx jsdoc -c jsdoc.json', { stdio: 'inherit' });
      console.log('✅ Documentación JSDoc generada en:', this.docsPath);
    } catch (error) {
      console.error('❌ Error generando JSDoc:', error.message);
    }
  }

  /**
   * Actualiza README con información del proyecto
   */
  updateREADME() {
    console.log('📖 Actualizando README...');
    
    const structure = this.analyzeProject();
    const readmePath = path.join(this.projectRoot, 'README.md');
    
    let readmeContent = `# eGrow Academy

Plataforma educativa de inteligencia artificial y aprendizaje automático.

## 📊 Estadísticas del Proyecto

- **Archivos HTML**: ${structure.htmlFiles.length}
- **Archivos CSS**: ${structure.cssFiles.length}
- **Archivos JavaScript**: ${structure.jsFiles.length}
- **Imágenes**: ${structure.images.length}
- **Total de archivos**: ${structure.totalFiles}

## 🚀 Inicio Rápido

\`\`\`bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
python3 -m http.server 8000

# Abrir en navegador
xdg-open http://localhost:8000
\`\`\`

## 📚 Documentación

- **API Documentation**: [OpenAPI Spec](./openapi.json)
- **JavaScript Docs**: [JSDoc](./docs/)
- **Swagger UI**: https://editor.swagger.io/

## 🛠️ Scripts Disponibles

\`\`\`bash
# Generar documentación completa
npm run docs:generate

# Servir documentación
npm run docs:serve

# Generar OpenAPI
npm run docs:openapi
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
eGrow-academy/
├── index.html          # Página principal
├── courses.html        # Página de cursos
├── community.html      # Página de comunidad
├── the-batch.html      # Newsletter de IA
├── css/
│   └── styles.css      # Estilos principales
├── js/
│   └── main.js         # JavaScript principal
├── images/
│   └── Logo2.png       # Logo del proyecto
└── docs/               # Documentación generada
\`\`\`

## 🔧 Tecnologías

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenAPI 3.0
- JSDoc

## 📝 Licencia

ISC

---

Generado automáticamente por MCP Documentation
`;

    fs.writeFileSync(readmePath, readmeContent);
    console.log('✅ README actualizado');
  }

  /**
   * Ejecuta todo el proceso de documentación
   */
  async generateAll() {
    console.log('🚀 Iniciando generación de documentación MCP...\n');
    
    // Crear directorio de docs si no existe
    if (!fs.existsSync(this.docsPath)) {
      fs.mkdirSync(this.docsPath, { recursive: true });
    }
    
    // Analizar proyecto
    this.analyzeProject();
    console.log('');
    
    // Generar OpenAPI
    this.generateOpenAPI();
    console.log('');
    
    // Generar JSDoc
    this.generateJSDoc();
    console.log('');
    
    // Actualizar README
    this.updateREADME();
    console.log('');
    
    console.log('🎉 ¡Documentación generada exitosamente!');
    console.log('📖 Puedes ver la documentación en:');
    console.log('   - OpenAPI: https://editor.swagger.io/');
    console.log('   - JSDoc: ./docs/');
    console.log('   - README: ./README.md');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const mcp = new MCPDocumentation();
  mcp.generateAll();
}

module.exports = MCPDocumentation; 