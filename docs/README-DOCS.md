# 📚 Estructura de Documentación - eGrow Academy

## 📁 Organización de Documentación

### **Directorio Principal: `/docs/`**

```
docs/
├── README-DOCS.md              # Este archivo (guía de documentación)
├── REORGANIZATION.md           # Log de reorganización del proyecto
├── openapi-docs.md            # Documentación OpenAPI principal
├── server.log                 # Logs del servidor de desarrollo
├── api/                       # Documentación de APIs
│   ├── endpoints.md           # Lista de endpoints
│   ├── routes.md              # Documentación de rutas
│   └── components-api.md      # APIs de componentes
├── generated/                 # Documentación auto-generada
│   ├── readme-auto.md         # README generado automáticamente
│   ├── component-docs/        # Docs de componentes individuales
│   └── api-specs/             # Especificaciones OpenAPI
├── mcp-outputs/              # Salidas de MCPs de documentación
│   ├── code-doc-mcp/         # Outputs de code-doc-mcp
│   ├── doc-evaluation/       # Evaluaciones de documentación
│   └── memory-docs/          # Documentación persistida por MCP memory
└── readme/                   # Diferentes versiones de README
    ├── README-technical.md   # README técnico detallado
    ├── README-user.md        # README para usuarios finales
    └── README-dev.md         # README para desarrolladores
```

## 🛠️ **Configuración de MCPs:**

### **code-doc-mcp:**
```bash
# Configuración personalizada para eGrow Academy:
code-doc-mcp \
  -d /home/david/eGrow-academy/egrow-academy-nextjs/docs/mcp-outputs/data \
  -o /home/david/eGrow-academy/egrow-academy-nextjs/docs/generated \
  -p 3000 \
  -w 8080
```

### **Directorios de MCP por defecto:**
- **Data:** `~/.mcpDocData/data/` (o personalizado)
- **Docs:** `~/.mcpDocData/docs/` (o personalizado)

## 📋 **Tipos de Documentación:**

### **1. Documentación Manual:**
- `openapi-docs.md` - Documentación principal del proyecto
- `REORGANIZATION.md` - Cambios en estructura
- `README-DOCS.md` - Esta guía

### **2. Documentación Auto-generada:**
- **Componentes:** Documentación automática de React components
- **APIs:** Especificaciones OpenAPI generadas
- **README:** Versiones automáticas del README

### **3. Logs y Reportes:**
- `server.log` - Logs de desarrollo
- **Evaluaciones:** Reportes de calidad de documentación
- **Métricas:** Estadísticas del proyecto

## 🚀 **Comandos Útiles:**

```bash
# Generar documentación con code-doc-mcp
cd /home/david/eGrow-academy/egrow-academy-nextjs
code-doc-mcp -d ./docs/mcp-outputs/data -o ./docs/generated

# Ver documentación web
# Abrir http://localhost:8080 después del comando anterior

# Evaluar calidad de documentación
doc-evaluation-server
```

## 📍 **Rutas Importantes:**

- **Proyecto:** `/home/david/eGrow-academy/egrow-academy-nextjs/`
- **Docs Principal:** `./docs/`
- **Generados:** `./docs/generated/`
- **MCP Outputs:** `./docs/mcp-outputs/`
- **Configuración:** Ver `package.json` y `next.config.ts`

---

*Estructura creada para mantener documentación organizada y accesible*