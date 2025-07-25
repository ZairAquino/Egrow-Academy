const { PrismaClient } = require('@prisma/client')

async function upgradeUser(email) {
  const prisma = new PrismaClient()
  
  try {
    console.log(`🔍 Buscando usuario con email: ${email}`)
    
    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true
      }
    })
    
    if (!user) {
      console.log('❌ Usuario no encontrado')
      return
    }
    
    console.log(`✅ Usuario encontrado: ${user.firstName} ${user.lastName}`)
    console.log(`📋 Membership actual: ${user.membershipLevel}`)
    
    if (user.membershipLevel === 'PREMIUM') {
      console.log('ℹ️  El usuario ya es premium')
      return
    }
    
    // Actualizar a premium
    console.log('🔄 Actualizando a premium...')
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        membershipLevel: 'PREMIUM'
      }
    })
    
    console.log('✅ Usuario actualizado exitosamente!')
    console.log(`📋 Nuevo membership: ${updatedUser.membershipLevel}`)
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

async function listUsers() {
  const prisma = new PrismaClient()
  
  try {
    console.log('📋 Listando todos los usuarios:')
    
    const users = await prisma.user.findMany({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true
      }
    })
    
    console.log(`\n📊 Total de usuarios: ${users.length}\n`)
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Membership: ${user.membershipLevel}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Obtener argumentos de línea de comandos
const args = process.argv.slice(2)
const command = args[0]
const email = args[1]

if (command === 'list') {
  listUsers()
} else if (command === 'upgrade' && email) {
  upgradeUser(email)
} else {
  console.log('📖 Uso:')
  console.log('  node scripts/upgrade-user.js list')
  console.log('  node scripts/upgrade-user.js upgrade usuario@email.com')
}