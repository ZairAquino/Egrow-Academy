# Reorganización del Proyecto eGrow Academy

## 📂 Nueva Estructura

### Directorio Principal (Limpio)
- `package.json`, `package-lock.json` - Dependencias
- `next.config.ts`, `tsconfig.json` - Configuración de Next.js
- `tailwind.config.ts`, `postcss.config.mjs` - Configuración de estilos
- `README.md` - Documentación principal
- `src/` - Código fuente principal
- `public/` - Assets públicos

### Carpetas de Organización

#### `config/`
- `eslint.config.mjs` - Configuración de ESLint

#### `docs/`
- `server.log` - Logs del servidor de desarrollo
- `REORGANIZATION.md` - Este archivo

#### `server-old/`
- `server/` - Código de servidor tRPC no utilizado
- `pages/` - Páginas de API tRPC no utilizadas
- `src-pages-old/` - Páginas antiguas de src

## 🧹 Archivos Eliminados
- `src/app/company/` - Carpeta vacía (página eliminada)

## 📍 Archivos Movidos
- `lib/` → `src/lib/` - Bibliotecas dentro del código fuente
- `server.log` → `docs/server.log`
- `eslint.config.mjs` → `config/eslint.config.mjs`

## ✅ Resultado
Directorio principal más limpio y organizado, manteniendo solo archivos esenciales.