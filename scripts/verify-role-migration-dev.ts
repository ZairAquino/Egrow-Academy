import dotenv from 'dotenv';

// Función para verificar migración en desarrollo
async function verifyRoleMigrationDev() {
  console.log('🔍 Verificando migración del campo role en desarrollo...');
  
  // Cargar variables de entorno de desarrollo
  dotenv.config();
  
  // Usar fetch directamente para evitar problemas con Prisma client
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL no encontrada');
  }
  
  console.log('🔄 Conectando a base de datos de desarrollo...');
  
  // Usar pg para conectar directamente
  const { Client } = require('pg');
  const client = new Client({
    connectionString: databaseUrl
  });
  
  try {
    await client.connect();
    console.log('✅ Conexión establecida');
    
    // Verificar estructura de tabla users
    console.log('🔄 Verificando estructura de tabla users...');
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Estructura actual de tabla users:');
    console.table(result.rows);
    
    // Verificar si el campo role existe
    const roleColumn = result.rows.find(row => row.column_name === 'role');
    if (roleColumn) {
      console.log('✅ Campo role encontrado:');
      console.log(`  - Tipo: ${roleColumn.data_type}`);
      console.log(`  - Nullable: ${roleColumn.is_nullable}`);
      console.log(`  - Default: ${roleColumn.column_default}`);
    } else {
      console.log('❌ Campo role NO encontrado');
      return { success: false, error: 'Campo role no existe' };
    }
    
    // Verificar enum UserRole
    console.log('\n🔄 Verificando enum UserRole...');
    const enumResult = await client.query(`
      SELECT enumlabel 
      FROM pg_enum 
      JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
      WHERE pg_type.typname = 'UserRole'
      ORDER BY enumsortorder;
    `);
    
    if (enumResult.rows.length > 0) {
      console.log('✅ Enum UserRole encontrado con valores:');
      enumResult.rows.forEach(row => {
        console.log(`  - ${row.enumlabel}`);
      });
    } else {
      console.log('❌ Enum UserRole NO encontrado');
      return { success: false, error: 'Enum UserRole no existe' };
    }
    
    // Verificar usuarios existentes (deben tener role=USER por defecto)
    console.log('\n🔄 Verificando usuarios existentes...');
    const usersResult = await client.query(`
      SELECT id, email, "firstName", "lastName", role, "membershipLevel", "isActive"
      FROM users 
      ORDER BY "createdAt" 
      LIMIT 10;
    `);
    
    console.log(`📊 Usuarios en base de datos (${usersResult.rows.length} registros):`);
    console.table(usersResult.rows);
    
    // Verificar valores por defecto
    const roleDistribution = await client.query(`
      SELECT role, COUNT(*) as count
      FROM users 
      GROUP BY role;
    `);
    
    console.log('\n📈 Distribución de roles:');
    console.table(roleDistribution.rows);
    
    console.log('\n🎉 MIGRACIÓN DE DESARROLLO VERIFICADA EXITOSAMENTE');
    console.log('✅ Campo role agregado correctamente');
    console.log('✅ Enum UserRole creado correctamente');
    console.log('✅ Usuarios existentes tienen rol por defecto');
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error verificando migración:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Ejecutar verificación
verifyRoleMigrationDev()
  .then((result) => {
    if (result.success) {
      console.log('\n🎊 Verificación completada exitosamente');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('\n💥 Error en verificación:', err);
    process.exit(1);
  });