import validator from 'email-validator'

// Dominios de correo conocidos y confiables
const TRUSTED_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'tutanota.com',
  'zoho.com',
  'yandex.com',
  'mail.com',
  'gmx.com',
  'fastmail.com'
]

// Dominios de empresas conocidas
const CORPORATE_DOMAINS = [
  'microsoft.com',
  'google.com',
  'apple.com',
  'amazon.com',
  'facebook.com',
  'twitter.com',
  'linkedin.com',
  'github.com',
  'stackoverflow.com',
  'reddit.com',
  'discord.com',
  'slack.com',
  'zoom.us',
  'teams.microsoft.com',
  'notion.so',
  'figma.com',
  'adobe.com',
  'autodesk.com',
  'salesforce.com',
  'hubspot.com'
]

/**
 * Valida que el correo no sea obviamente falso
 */
export function validateEmailRealistic(email: string): boolean {
  const localPart = email.split('@')[0]
  
  // Verificar que la parte local no sea demasiado corta o sospechosa
  if (localPart.length < 2) return false
  
  // Verificar que no contenga solo números
  if (/^\d+$/.test(localPart)) return false
  
  // Verificar que no contenga caracteres sospechosos
  if (/[<>()[\]\\,;:\s"]/.test(localPart)) return false
  
  // Verificar que no sea un patrón obviamente falso
  const suspiciousPatterns = [
    /^test\d*$/i,
    /^admin\d*$/i,
    /^user\d*$/i,
    /^demo\d*$/i,
    /^fake\d*$/i,
    /^temp\d*$/i,
    /^asd\d*$/i,
    /^qwe\d*$/i,
    /^123\d*$/i,
    /^abc\d*$/i,
    /^asdawed$/i, // Patrón específico que se usó
    /^pedro$/i,
    /^picapiedra$/i
  ]
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(localPart)) return false
  }
  
  return true
}

/**
 * Valida el formato básico de un correo electrónico
 */
export function validateEmailFormat(email: string): boolean {
  return validator.validate(email)
}

/**
 * Extrae el dominio de un correo electrónico
 */
export function extractDomain(email: string): string | null {
  const parts = email.split('@')
  return parts.length === 2 ? parts[1].toLowerCase() : null
}

/**
 * Verifica si el dominio es confiable (conocido)
 */
export function isTrustedDomain(domain: string): boolean {
  const normalizedDomain = domain.toLowerCase()
  return TRUSTED_DOMAINS.includes(normalizedDomain) || 
         CORPORATE_DOMAINS.includes(normalizedDomain)
}

/**
 * Valida que el dominio tenga un formato razonable
 */
export function validateDomainFormat(domain: string): boolean {
  // Verificar que el dominio tenga al menos un punto
  if (!domain.includes('.')) return false
  
  // Verificar que no tenga caracteres extraños
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return domainRegex.test(domain)
}

/**
 * Valida un correo electrónico de forma completa (lado del cliente)
 */
export function validateEmail(email: string): {
  isValid: boolean
  error?: string
} {
  // Validar formato básico
  if (!validateEmailFormat(email)) {
    return {
      isValid: false,
      error: 'El formato del correo electrónico no es válido'
    }
  }

  // Validar que el correo sea realista
  if (!validateEmailRealistic(email)) {
    return {
      isValid: false,
      error: 'Por favor, usa un correo electrónico real y válido'
    }
  }

  // Extraer dominio
  const domain = extractDomain(email)
  if (!domain) {
    return {
      isValid: false,
      error: 'No se pudo extraer el dominio del correo'
    }
  }

  // Validar formato del dominio
  if (!validateDomainFormat(domain)) {
    return {
      isValid: false,
      error: 'El dominio del correo no tiene un formato válido'
    }
  }

  // Verificar si es un dominio confiable
  if (!isTrustedDomain(domain)) {
    return {
      isValid: false,
      error: 'Por favor, usa un correo electrónico de un proveedor confiable (Gmail, Yahoo, Outlook, etc.) o un dominio corporativo válido'
    }
  }

  return { isValid: true }
}

/**
 * Obtiene sugerencias de correos similares si el dominio no es confiable
 */
export function getEmailSuggestions(email: string): string[] {
  const domain = extractDomain(email)
  if (!domain) return []

  const suggestions: string[] = []
  const localPart = email.split('@')[0]

  // Sugerir dominios confiables
  TRUSTED_DOMAINS.slice(0, 3).forEach(trustedDomain => {
    suggestions.push(`${localPart}@${trustedDomain}`)
  })

  return suggestions
} 