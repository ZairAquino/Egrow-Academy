const fs = require('fs');
const path = require('path');

// Leer el backup de las 19:59 de hoy que tiene webinars básicos
const backupPath = path.join(__dirname, '../backups/dev-backup-2025-08-05T19-59-15-866Z.json');
const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

console.log('Backup cargado:', backupPath);
console.log('Timestamp del backup: 2025-08-05T19:59:15.866Z');
console.log('Modelos disponibles:', Object.keys(backupData));

// Verificar que no tenga modelos complejos de Webinar Jam
const hasComplexWebinarModels = backupData.webinar_chat || backupData.webinar_emails || backupData.webinar_questions;

if (hasComplexWebinarModels) {
  console.log('❌ Este backup contiene modelos complejos de Webinar Jam');
} else {
  console.log('✅ Este backup está limpio de modelos complejos de Webinar Jam');
}

console.log('\nDatos disponibles:');
Object.keys(backupData).forEach(model => {
  const count = Array.isArray(backupData[model]) ? backupData[model].length : 0;
  console.log(`- ${model}: ${count} registros`);
});

// Verificar que tenga el apartado de webinars básico
const hasBasicWebinars = backupData.webinar || backupData.webinars;
if (hasBasicWebinars) {
  console.log('✅ Este backup tiene el apartado de webinars básico');
} else {
  console.log('❌ Este backup NO tiene el apartado de webinars');
} 