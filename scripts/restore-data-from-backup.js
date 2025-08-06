const fs = require('fs');
const path = require('path');

console.log('🔄 Iniciando restauración desde backup...');

// Leer el backup
const backupPath = path.join(__dirname, '../backups/dev-backup-2025-08-05T19-59-15-866Z.json');
const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

console.log('✅ Backup cargado:', backupPath);
console.log('📅 Timestamp:', '2025-08-05T19:59:15.866Z');
console.log('📊 Datos disponibles:', Object.keys(backupData).length, 'modelos');

// Verificar webinars
const webinarCount = backupData.webinar ? backupData.webinar.length : 0;
const registrationCount = backupData.webinarRegistration ? backupData.webinarRegistration.length : 0;

console.log(`🎥 Webinars: ${webinarCount} registros`);
console.log(`📝 Registros de webinars: ${registrationCount} registros`);

console.log('\n✅ Backup verificado y listo para restauración');
console.log('💡 Este backup tiene webinars básicos sin modelos complejos de Webinar Jam'); 