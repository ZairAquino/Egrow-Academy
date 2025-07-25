import dns from 'dns'
import { promisify } from 'util'

// Promisificar las funciones de DNS
const resolveMx = promisify(dns.resolveMx)

/**
 * Verifica si un dominio tiene registros MX (puede recibir emails)
 */
export async function verifyDomainMx(domain: string): Promise<boolean> {
  try {
    const mxRecords = await resolveMx(domain)
    return mxRecords.length > 0
  } catch (error) {
    console.log(`❌ [SERVER-EMAIL-VALIDATION] Error verificando MX para ${domain}:`, error)
    return false
  }
}

/**
 * Valida un correo electrónico en el servidor con verificación DNS
 */
export async function validateEmailServer(email: string): Promise<{
  isValid: boolean
  error?: string
}> {
  // Extraer dominio
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) {
    return {
      isValid: false,
      error: 'No se pudo extraer el dominio del correo'
    }
  }

  // Verificar que el dominio tenga registros MX (puede recibir emails)
  const hasMxRecords = await verifyDomainMx(domain)
  if (!hasMxRecords) {
    return {
      isValid: false,
      error: 'El dominio del correo no puede recibir emails. Por favor, usa un correo electrónico válido'
    }
  }

  return { isValid: true }
} 