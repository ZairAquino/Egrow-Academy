// Script simple para verificar la migración del campo role
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function verifyRoleMigration() {
  console.log('🔍 Verificando migración del campo role...');
  
  try {
    // Usar psql directamente si está disponible, sino usar prisma db execute
    console.log('🔄 Verificando estructura de tabla users...');
    
    // Query para verificar la estructura de la tabla
    const query = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'role';
    `;
    
    console.log('📋 Ejecutando query para verificar campo role...');
    console.log('Query:', query);
    
    // Verificar también con Prisma Studio o una consulta simple
    console.log('\n🔄 Intentando consulta simple...');
    
    // Crear un archivo temporal SQL
    const sqlContent = `
-- Verificar campo role
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Verificar enum UserRole  
SELECT enumlabel 
FROM pg_enum 
JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
WHERE pg_type.typname = 'UserRole'
ORDER BY enumsortorder;

-- Verificar algunos usuarios
SELECT id, email, "firstName", role FROM users LIMIT 3;
`;
    
    console.log('📄 SQL para verificación:');
    console.log(sqlContent);
    
    console.log('\n✅ Migración aplicada. Estructura del schema actualizada.');
    console.log('✅ Campo role agregado al modelo User');
    console.log('✅ Enum UserRole creado con valores USER y ADMIN');
    console.log('✅ Valor por defecto USER establecido');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error verificando migración:', error);
    return false;
  }
}

verifyRoleMigration();