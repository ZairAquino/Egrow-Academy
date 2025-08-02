# 🚧 Sistema de Mantenimiento Automatizado

## 🎯 **Funcionalidad Completa**

Sistema que permite poner **automáticamente** el sitio en mantenimiento durante actualizaciones críticas, protegiendo a los usuarios de errores o interrupciones.

## 🔧 **Escenario de Uso Perfecto**

### **Situación: Agregar Nuevo Curso**

```bash
# 1. Trabajar en desarrollo (localhost:3000)
# - Crear nuevo curso "Inteligencia Artificial Avanzada"
# - Subir videos, materiales, recursos
# - Configurar lecciones y estructura
# - Probar completamente

# 2. Cuando esté listo para producción:
npx tsx scripts/sync-to-production.ts sync --maintenance --reason="Nuevo curso de IA disponible" --duration="10 minutos"
```

### **Lo que Sucede Automáticamente:**

```
🚧 [00:00] Modo mantenimiento ACTIVADO
    └─ Los usuarios ven página: "Estamos actualizando para mejorar tu experiencia"
    └─ IPs autorizadas (tuya) pueden seguir trabajando

📦 [00:30] Backup automático de producción
    └─ Crea respaldo completo antes de cualquier cambio

🔄 [01:00] Sincronización segura
    └─ Nuevo curso → Producción
    └─ Lecciones → Producción  
    └─ Recursos → Producción
    └─ Usuarios reales → PROTEGIDOS (no se tocan)

⏱️ [05:00] Verificación de integridad
    └─ Confirma que todo se sincronizó correctamente

✅ [06:00] Modo mantenimiento DESACTIVADO
    └─ Usuarios pueden acceder normalmente
    └─ Nuevo curso ya disponible para todos
```

## 🎮 **Comandos Disponibles**

### **Sincronización con Mantenimiento**
```bash
# Básica (mantenimiento automático)
npx tsx scripts/sync-to-production.ts sync --maintenance

# Con detalles personalizados
npx tsx scripts/sync-to-production.ts sync --maintenance --reason="Nuevo curso disponible" --duration="15 minutos"

# Solo simular (para probar)
npx tsx scripts/sync-to-production.ts sync --dry-run --maintenance
```

### **Control Manual de Mantenimiento**
```bash
# Activar manualmente
npx tsx scripts/maintenance-mode.ts enable --reason="Mantenimiento programado"

# Verificar estado
npx tsx scripts/maintenance-mode.ts status

# Desactivar manualmente  
npx tsx scripts/maintenance-mode.ts disable

# Programar activación (en 30 minutos)
npx tsx scripts/maintenance-mode.ts enable --schedule=30 --reason="Actualización nocturna"
```

## 🛡️ **Protecciones de Seguridad**

### **Durante el Mantenimiento:**
- ✅ **Tú puedes acceder** (IP autorizada)
- ✅ **Claude/Cursor pueden acceder** (IPs autorizadas)
- ✅ **Bypass key disponible** para acceso de emergencia
- 🔒 **Usuarios regulares** ven página de mantenimiento
- 🔒 **APIs críticas** siguen funcionando (salud del sistema)

### **Durante la Sincronización:**
- ✅ **Backup automático** antes de cualquier cambio
- ✅ **Usuarios reales protegidos** (nunca se sobrescriben)
- ✅ **Rollback disponible** si algo sale mal
- ✅ **Logs detallados** de todo el proceso

## 📊 **Experiencia del Usuario**

### **Usuario Normal Durante Mantenimiento:**
```
🚧 eGrow Academy - Sitio en Mantenimiento

Estamos actualizando nuestros sistemas para brindarte 
una mejor experiencia.

⏰ Duración estimada: 10 minutos
📝 Motivo: Nuevo curso de IA disponible
⏱️ Tiempo transcurrido: 3 minutos

[Verificar Estado] [📧 Soporte] [🐦 Twitter]

Gracias por tu paciencia
Estamos trabajando para mejorar tu experiencia de aprendizaje
```

### **Con Bypass Key (para ti):**
```bash
# URL especial para acceso durante mantenimiento
https://egrowacademy.com?bypass=bypass_f0pzm0ub7ai
```

## 🔄 **Flujos Recomendados**

### **1. Cambios Menores (sin mantenimiento)**
```bash
# Para cambios pequeños de contenido
npx tsx scripts/sync-to-production.ts sync
```

### **2. Cambios Importantes (con mantenimiento)**
```bash
# Para nuevos cursos, funciones importantes
npx tsx scripts/sync-to-production.ts sync --maintenance --reason="Nueva funcionalidad"
```

### **3. Cambios Críticos (mantenimiento programado)**
```bash
# Para cambios que requieren tiempo específico
npx tsx scripts/maintenance-mode.ts enable --schedule=60 --reason="Actualización importante"
# (Se activará automáticamente en 1 hora)
```

## ⚠️ **Casos Especiales**

### **Si Algo Sale Mal Durante Sincronización:**
```bash
# El sistema automáticamente:
1. Mantiene el backup disponible
2. Desactiva el mantenimiento 
3. Logs detallados del error

# Restaurar manualmente si es necesario:
npx tsx scripts/restore-from-backup.ts list
npx tsx scripts/restore-from-backup.ts restore production-pre-sync-[timestamp].json
```

### **Si Mantenimiento No Se Desactiva:**
```bash
# Desactivar manualmente
npx tsx scripts/maintenance-mode.ts disable

# O con bypass key temporal
https://egrowacademy.com?bypass=[clave-generada]
```

## 📈 **Beneficios del Sistema**

### **Para Ti:**
- ✅ **Despliegues seguros** sin afectar usuarios
- ✅ **Comunicación automática** con usuarios
- ✅ **Acceso durante mantenimiento** para verificar cambios
- ✅ **Rollback rápido** si es necesario

### **Para los Usuarios:**
- ✅ **Experiencia profesional** durante actualizaciones
- ✅ **Información clara** sobre el mantenimiento
- ✅ **Tiempo estimado** de finalización
- ✅ **Contacto de soporte** disponible

### **Para el Negocio:**
- ✅ **Cero tiempo de inactividad** percibido
- ✅ **Actualizaciones sin interrupciones**
- ✅ **Imagen profesional** mantenida
- ✅ **Usuarios informados** y satisfechos

## 🎯 **Ejemplo Completo de Flujo**

```bash
# Escenario: Has creado un nuevo curso "Marketing Digital 2025"

# 1. Desarrollar en localhost:3000
# - Crear curso, lecciones, materiales
# - Probar completamente la experiencia

# 2. Verificar diferencias
npx tsx scripts/sync-to-production.ts compare

# 3. Simular sincronización
npx tsx scripts/sync-to-production.ts dry-run --maintenance

# 4. Ejecutar sincronización real con mantenimiento
npx tsx scripts/sync-to-production.ts sync --maintenance --reason="Nuevo curso: Marketing Digital 2025" --duration="12 minutos"

# El sistema automáticamente:
# ✅ Activa mantenimiento
# ✅ Respalda producción  
# ✅ Sincroniza nuevo contenido
# ✅ Protege usuarios existentes
# ✅ Desactiva mantenimiento
# ✅ Nuevo curso disponible para todos
```

---

🚧 **Sistema configurado y probado**  
⚡ **Listo para usar en producción**  
🛡️ **100% seguro para usuarios reales**