import crypto from 'crypto';

export interface VerificationToken {
  token: string;
  expiresAt: Date;
}

export class VerificationService {
  /**
   * Genera un token de verificación único
   */
  static generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Genera un token de verificación con tiempo de expiración
   */
  static generateVerificationToken(): VerificationToken {
    const token = this.generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expira en 24 horas

    return {
      token,
      expiresAt
    };
  }

  /**
   * Verifica si un token ha expirado
   */
  static isTokenExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }

  /**
   * Valida un token de verificación
   */
  static validateToken(token: string, storedToken: string, expiresAt: Date): boolean {
    if (!token || !storedToken) {
      return false;
    }

    if (this.isTokenExpired(expiresAt)) {
      return false;
    }

    return token === storedToken;
  }

  /**
   * Genera un token seguro para URLs
   */
  static generateSecureToken(): string {
    return crypto.randomBytes(64).toString('base64url');
  }
} 