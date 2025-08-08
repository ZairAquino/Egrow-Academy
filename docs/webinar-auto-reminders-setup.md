# Configuración de Recordatorios Automáticos de Webinars

## 📋 Sistema Configurado

### ✅ Recordatorios Disponibles:
1. **5 horas antes** - Configurado y funcionando ✅
2. **30 minutos antes** - Configurado y listo ✅ (NUEVO)
3. **15 minutos antes** - Disponible en templates ✅

## 🔧 Configuración de Envío Automático

### Opción 1: Cron Jobs (Linux/Mac)
```bash
# Ejecutar cada minuto para verificar webinars próximos
* * * * * cd /path/to/Egrow-Academy && npx tsx scripts/auto-send-30min-reminder.ts >> /var/log/webinar-reminders.log 2>&1
```

### Opción 2: Windows Task Scheduler
1. Abrir "Programador de tareas"
2. Crear tarea básica
3. Ejecutar cada minuto: `npx tsx scripts/auto-send-30min-reminder.ts`
4. Directorio de trabajo: `C:\Users\think\Egrow-Academy`

### Opción 3: GitHub Actions (Recomendado para producción)
```yaml
name: Webinar Reminders
on:
  schedule:
    - cron: '* * * * *'  # Cada minuto
jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx tsx scripts/auto-send-30min-reminder.ts
        env:
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          RESEND_FROM_EMAIL: ${{ secrets.RESEND_FROM_EMAIL }}
```

### Opción 4: Vercel Cron Jobs
```typescript
// api/cron/webinar-reminders.ts
import { autoSendThirtyMinuteReminders } from '../../scripts/auto-send-30min-reminder';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405);
  
  try {
    const result = await autoSendThirtyMinuteReminders();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## ⚙️ Scripts Disponibles

### Recordatorio de 30 minutos
```bash
# Test del email (envía a luisdavid.ls47@gmail.com)
npx tsx scripts/test-30min-reminder.ts

# Ejecución automática (verifica y envía si hay webinars en 30 min)
npx tsx scripts/auto-send-30min-reminder.ts
```

### Recordatorio de 5 horas
```bash
# Test del email
npx tsx scripts/test-5hour-reminder.ts

# Envío manual a todos los registrados
npx tsx scripts/check-delivery-status.ts
```

## 📊 Rate Limiting Inteligente

El sistema ajusta automáticamente los delays:
- **≤50 registrados:** 0.5 segundos entre envíos
- **51-200 registrados:** 0.75 segundos entre envíos  
- **200+ registrados:** 1 segundo entre envíos

## 🔍 Monitoreo y Logs

### Logs del Sistema
Los scripts generan logs detallados:
```
🕐 AUTO-RECORDATORIO 30 MINUTOS - INICIANDO VERIFICACIÓN...
🌐 Base de datos: PRODUCCIÓN
📅 Timestamp: 2025-08-08T18:30:00.000Z
🕐 Buscando webinars que comiencen entre:
   Desde: 8/8/2025, 6:59:00 p.m.
   Hasta: 8/8/2025, 7:01:00 p.m.
🎯 ¡ENCONTRADOS 1 WEBINARS!
```

### Dashboard de Resend
- Verificar entregas en https://resend.com/emails
- Monitorear tasas de bounce y spam
- Revisar analytics de apertura

## 🚨 Configuración de Emergencia

### Si necesitas enviar manualmente:
```bash
# Para webinar específico (modificar script con ID)
npx tsx scripts/manual-30min-reminder.ts --webinar-id="WEBINAR_ID"
```

### Deshabilitar envíos automáticos:
Comentar o eliminar el cron job temporalmente.

## 📈 Escalabilidad

### Para más de 500 registrados:
1. Considerar batch processing
2. Implementar queue system (Redis + Bull)
3. Usar múltiples workers
4. Upgrade plan de Resend

### Variables de Entorno Requeridas:
```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@egrowacademy.com
DATABASE_URL=postgresql://...
```

## ✅ Verificación Post-Configuración

1. **Ejecutar test:** `npx tsx scripts/test-30min-reminder.ts`
2. **Verificar email recibido** en luisdavid.ls47@gmail.com
3. **Simular ejecución automática** (sin webinars reales)
4. **Programar cron job** o task scheduler
5. **Monitorear primeros envíos reales**

## 🎯 Cronología de Recordatorios

```
Webinar programado para: 5:00 PM
├── 12:00 PM (5h antes) → Recordatorio de expectativa
├── 4:30 PM (30m antes) → Recordatorio URGENTE ← NUEVO
├── 4:45 PM (15m antes) → Recordatorio final
└── 5:00 PM → ¡Webinar en vivo!
```

El sistema está configurado y listo para usar. Solo falta programar la ejecución automática según la opción preferida.