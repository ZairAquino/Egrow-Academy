# 🚀 Guía de Desarrollo - Egrow Academy

## ⚡ Inicio Rápido

### Comandos Esenciales
```bash
# Inicio rápido del servidor (recomendado)
npm run dev:safe

# Con verificaciones completas (más lento)
npm run dev:with-checks

# Depuración con MCP Inspector
npm run dev:debug

# Verificar salud del servidor
npm run health
```

## 🛠️ MCPs Instalados para Debugging

### 1. MCP Debug Server
- **Archivo**: `mcp-debug-server.js`
- **Comando**: `npm run debug:server`
- **Inspector**: `npm run debug:inspect`

### 2. Herramientas de Debugging
- **Health Check**: `/api/health` - Verifica estado del servidor y BD
- **MCP Inspector**: Interfaz web para debugging
- **Kill Port**: `npm run kill-port` - Libera puerto 3000

## 🎯 Extensiones de Cursor Configuradas

### Extensiones Esenciales
- **Tailwind CSS**: Autocompletado y IntelliSense
- **TypeScript**: Soporte completo para TS
- **Prettier + ESLint**: Formateo automático
- **Prisma**: Soporte para esquemas de BD
- **Error Lens**: Errores inline en tiempo real
- **Path Intellisense**: Autocompletado de rutas

### Configuración VSCode/Cursor
- **Formateo automático**: Al guardar
- **ESLint fixes**: Automáticos
- **Tailwind**: Autocompletado habilitado
- **TypeScript**: Sugerencias de imports

## 🔧 Scripts de Utilidad

### Desarrollo
```bash
npm run dev:safe          # Inicio seguro
npm run dev:clean         # Mata puerto y reinicia
npm run dev:debug         # Con inspector MCP
npm run typecheck         # Verificar tipos
npm run lint              # Verificar código
```

### Debugging
```bash
npm run health            # Estado del servidor
npm run kill-port         # Liberar puerto 3000
npm run quick-fix         # Arreglar errores comunes
npm run fix-deps          # Reinstalar dependencias
```

### Base de Datos
```bash
npx prisma generate       # Generar cliente
npx prisma db push        # Sincronizar esquema
npx prisma studio         # Interfaz web de BD
```

## 🐛 Solución de Problemas Comunes

### Error: Puerto en uso
```bash
npm run kill-port
# o manualmente:
npx kill-port 3000
```

### Error: Módulos no encontrados
```bash
npm run fix-deps
```

### Errores de TypeScript
```bash
npm run quick-fix
npm run typecheck
```

### Base de datos desconectada
```bash
npx prisma generate
npx prisma db push
npm run health
```

## 🚨 Endpoints de Debugging

- **GET** `/api/health` - Estado del sistema
- **All** `/api/*` - Todas las APIs disponibles

## 📋 Tareas de Cursor Configuradas

### Disponibles en Ctrl+Shift+P
1. **Start Dev Server** - Inicio con verificaciones
2. **Quick Dev (Fast)** - Inicio rápido
3. **Debug Server** - Con inspector MCP
4. **Health Check** - Verificar estado
5. **Kill Port 3000** - Liberar puerto
6. **Type Check** - Verificar tipos
7. **Lint & Fix** - Corrección de código

## 🎮 Debugging con Cursor

### Configuraciones de Launch
1. **Next.js: debug server-side** - Backend
2. **Next.js: debug client-side** - Frontend
3. **Next.js: debug full stack** - Completo
4. **Debug MCP Server** - Servidor MCP

### Uso del MCP Inspector
1. Ejecutar: `npm run debug:inspect`
2. Abrir navegador en la URL mostrada
3. Conectar con el servidor MCP
4. Usar herramientas de debugging visual

## ✅ Estado Actual

- ✅ MCPs para debugging instalados
- ✅ Extensiones de Cursor configuradas
- ✅ Scripts de desarrollo listos
- ✅ Servidor funcionando en localhost:3000
- ✅ Health check endpoint activo
- ✅ Configuración de debugging completa

---

### 🚀 ¡Listo para desarrollar!

El entorno está completamente configurado. Solo ejecuta `npm run dev:safe` y comienza a desarrollar.