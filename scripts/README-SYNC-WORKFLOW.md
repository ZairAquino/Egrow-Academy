# 🔄 Sistema de Sincronización Desarrollo ↔ Producción

## 🎯 **Objetivo**

Sistema seguro para trabajar en desarrollo y sincronizar cambios a producción, protegiendo los datos de usuarios reales.

## 🏗️ **Arquitectura**

```
🔧 DESARROLLO                    🔒 PRODUCCIÓN
ep-billowing-glitter-aekqfnw5    ep-holy-heart-aeupskea
        ↓                              ↑
   [TRABAJO DIARIO]              [USUARIOS REALES]
        ↓                              ↑
   [PRUEBAS SEGURAS]             [SOLO RECIBE CAMBIOS]
        ↓                              ↑
   [SINCRONIZACIÓN] ─────────────────→
```

## 📊 **Estado Actual**

### ✅ **Configuración Completa**
- **Desarrollo**: `ep-billowing-glitter-aekqfnw5-pooler` ← AQUÍ TRABAJAMOS
- **Producción**: `ep-holy-heart-aeupskea-pooler` ← USUARIOS REALES
- **Datos sincronizados**: 83 registros (usuarios, cursos, lecciones, recursos, eventos)

## 🛠️ **Scripts Disponibles**

### 1. **Comparar Entornos**
```bash
npx tsx scripts/sync-to-production.ts compare
```
Muestra diferencias entre desarrollo y producción sin hacer cambios.

### 2. **Simulación (Dry Run)**
```bash
npx tsx scripts/sync-to-production.ts dry-run
```
Simula la sincronización para ver qué cambios se harían.

### 3. **Sincronización Real**
```bash
npx tsx scripts/sync-to-production.ts sync
```
Aplica cambios de desarrollo → producción con backup automático.

### 4. **Backup Manual**
```bash
npx tsx scripts/simple-backup.ts both
```
Crea backup completo de ambos entornos.

### 5. **Restaurar desde Backup**
```bash
npx tsx scripts/restore-from-backup.ts list
npx tsx scripts/restore-from-backup.ts restore [archivo.json]
```

## 🔄 **Flujo de Trabajo Diario**

### **Durante el Desarrollo:**
```bash
# 1. Trabajar normalmente en localhost:3000
# (conecta automáticamente a BD de desarrollo)

# 2. Hacer cambios a cursos, lecciones, recursos, etc.

# 3. Verificar cambios localmente
```

### **Antes de Sincronizar:**
```bash
# 1. Comparar entornos
npx tsx scripts/sync-to-production.ts compare

# 2. Simular sincronización
npx tsx scripts/sync-to-production.ts dry-run

# 3. Si todo se ve bien, sincronizar
npx tsx scripts/sync-to-production.ts sync
```

### **Al Final del Día:**
```bash
# Backup completo
npx tsx scripts/simple-backup.ts both
```

## 🔒 **Protecciones de Seguridad**

### ✅ **QUÉ SE SINCRONIZA (Seguro)**
- ✅ **Cursos** nuevos/modificados
- ✅ **Lecciones** nuevas/modificadas  
- ✅ **Recursos** actualizados
- ✅ **Eventos** programados
- ✅ **Promociones** activas

### 🔐 **QUÉ NO SE TOCA (Protegido)**
- 🔒 **Usuarios reales** y sus registros
- 🔒 **Suscripciones activas** de usuarios
- 🔒 **Progreso de cursos** de usuarios
- 🔒 **Pagos realizados** por usuarios
- 🔒 **Inscripciones** de usuarios

### 🛡️ **Medidas de Seguridad**
1. **Backup automático** antes de cada sincronización
2. **Dry-run obligatorio** para verificar cambios
3. **Usuarios protegidos** por defecto
4. **Rollback disponible** desde backups

## 📝 **Casos de Uso Comunes**

### **Agregar Nuevo Curso**
```bash
# 1. Crear curso en desarrollo (localhost:3000)
# 2. Probar que funciona correctamente
# 3. Sincronizar a producción
npx tsx scripts/sync-to-production.ts dry-run
npx tsx scripts/sync-to-production.ts sync
```

### **Modificar Lecciones Existentes**
```bash
# 1. Editar lecciones en desarrollo
# 2. Verificar cambios
# 3. Sincronizar
npx tsx scripts/sync-to-production.ts sync
```

### **Agregar Recursos**
```bash
# 1. Subir recursos en desarrollo
# 2. Probar descarga/acceso
# 3. Sincronizar
npx tsx scripts/sync-to-production.ts sync
```

## ⚠️ **Situaciones Especiales**

### **Si un Usuario se Registra Durante el Trabajo**
✅ **No hay problema**: Los datos de usuarios están protegidos y no se tocan durante la sincronización.

### **Si Necesitas Sincronizar Usuarios (PELIGROSO)**
```bash
# Solo en casos muy específicos
npx tsx scripts/sync-to-production.ts sync --sync-users
```
⚠️ **CUIDADO**: Esto puede sobrescribir usuarios reales.

### **Si Algo Sale Mal**
```bash
# 1. Revisar backups disponibles
npx tsx scripts/restore-from-backup.ts list

# 2. Restaurar producción desde backup
npx tsx scripts/restore-from-backup.ts restore production-pre-sync-[timestamp].json
```

## 📊 **Monitoreo**

### **Verificar Estado de Sincronización**
```bash
npx tsx scripts/sync-to-production.ts compare
```

### **Ver Backups Disponibles**
```bash
npx tsx scripts/simple-backup.ts list
```

### **Logs de Sincronización**
Los scripts generan logs detallados de:
- Registros sincronizados por tabla
- Errores encontrados
- Tiempo de ejecución
- Archivos de backup creados

## 🚨 **Troubleshooting**

### **Error: "Can't reach database server"**
- Verificar conexión a internet
- Comprobar URLs en archivos `.env`

### **Error: "Column does not exist"**
- Ejecutar migraciones: `npx prisma migrate reset --force`

### **Datos no se sincronizan**
- Verificar que estés en la BD correcta: `npx tsx scripts/sync-to-production.ts compare`

### **Usuario real se registró y se perdió**
- Los usuarios están protegidos, pero si pasa: restaurar desde backup de producción

## 📅 **Mantenimiento**

### **Semanal**
- Limpiar backups antiguos (mantener últimos 10)
- Verificar sincronización: `compare`

### **Mensual**  
- Backup completo con verificación
- Revisión de logs de errores

## 🎯 **Flujo Recomendado para Ti**

```bash
# Desarrollo diario
1. Trabajar en localhost:3000 (desarrollo automático)
2. Hacer cambios, probar funcionalidad
3. Cuando esté listo: npx tsx scripts/sync-to-production.ts dry-run
4. Si se ve bien: npx tsx scripts/sync-to-production.ts sync
5. Al final del día: npx tsx scripts/simple-backup.ts both
```

---

📅 **Configurado**: 2 de agosto de 2025  
🔄 **Estado**: ✅ Funcional y probado  
🛡️ **Seguridad**: ✅ Usuarios protegidos  
📊 **Datos**: 83 registros sincronizados