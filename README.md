# eGrow Academy

Plataforma educativa de inteligencia artificial y aprendizaje automático.

## 📁 Organización de Archivos

- **/mcp/**
  - Archivos y scripts relacionados con MCP personalizados y configuración
- **/config/**
  - Archivos de configuración JSON generales del proyecto
- **/docs/**
  - Documentación generada y recursos estáticos
- **/scripts/**
  - Scripts utilitarios y de automatización

## 📦 Estructura sugerida

```
eGrow-academy/
├── mcp/
│   ├── mcp-cleaner.js
│   ├── mcp-docs.js
│   └── openapi.json
├── config/
│   ├── jsdoc.json
│   ├── eslint.config.js
│   ├── .prettierrc
│   ├── .prettierignore
│   ├── .eslintrc.json
│   └── .eslintignore
├── docs/
│   └── ...
├── scripts/
│   └── ...
├── package.json
├── package-lock.json
├── README.md
└── ...
```

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
python3 -m http.server 8000

# Abrir en navegador
xdg-open http://localhost:8000
```

## 📚 Documentación

- **API Documentation**: [OpenAPI Spec](./mcp/openapi.json)
- **JavaScript Docs**: [JSDoc](./docs/)
- **Swagger UI**: https://editor.swagger.io/

## 🛠️ Scripts Disponibles

```bash
# Generar documentación completa
npm run docs:generate

# Servir documentación
npm run docs:serve

# Generar OpenAPI
npm run docs:openapi

# Limpieza y optimización
npm run clean
```

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
