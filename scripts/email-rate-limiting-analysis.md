# Análisis de Rate Limiting para Envíos Masivos

## Problema Identificado
- **Resend límite:** 2 emails/segundo
- **Primer envío:** Rate limiting (429) con 31 registrados
- **Segundo envío:** 100% exitoso con pausa de 1 segundo

## Solución Actual
```javascript
// Pausa de 1 segundo entre envíos
await new Promise(resolve => setTimeout(resolve, 1000));
```

## Proyecciones para Más Registrados

### Escenarios:
- **100 registrados:** 100 segundos = 1.7 minutos ✅ Aceptable
- **500 registrados:** 500 segundos = 8.3 minutos ✅ Aceptable  
- **1000 registrados:** 1000 segundos = 16.7 minutos ⚠️ Lento pero funcional
- **2000+ registrados:** 30+ minutos ❌ Muy lento

## Mejoras Recomendadas

### 1. Rate Limiting Dinámico
```javascript
const calculateDelay = (totalEmails) => {
  if (totalEmails <= 100) return 500; // 0.5s
  if (totalEmails <= 500) return 750; // 0.75s
  return 1000; // 1s para grandes volúmenes
};
```

### 2. Batch Processing
```javascript
const batchSize = 50;
const batches = chunk(registrations, batchSize);

for (const batch of batches) {
  await Promise.all(batch.map(reg => sendEmail(reg)));
  await delay(5000); // 5s entre batches
}
```

### 3. Queue System (Futuro)
- Redis + Bull Queue
- Background jobs
- Retry automático
- Monitoreo en tiempo real

### 4. Upgrade de Plan Resend
- Plan Pro: 10,000 emails/mes
- Rate limit más alto
- Mejor deliverability

## Recomendación Inmediata
- **Hasta 500 registrados:** Usar pausa de 750ms
- **500+ registrados:** Implementar batch processing
- **Monitorear** tasas de entrega en Resend dashboard