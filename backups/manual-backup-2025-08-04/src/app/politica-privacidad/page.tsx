import type { Metadata } from 'next'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidad - eGrow Academy',
  description: 'Política de privacidad de eGrow Academy.',
}

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Política de Privacidad
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introducción</h2>
              <p className="text-gray-700 mb-4">
                En eGrow Academy ("nosotros", "nuestro", "la Plataforma"), respetamos su privacidad y nos comprometemos 
                a proteger su información personal. Esta Política de Privacidad explica cómo recopilamos, utilizamos, 
                almacenamos y protegemos su información cuando utiliza nuestros servicios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Información que Recopilamos</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">2.1 Información Personal</h3>
              <p className="text-gray-700 mb-4">
                Recopilamos la siguiente información personal cuando se registra y utiliza nuestros servicios:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Nombre completo y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Nombre de usuario (opcional)</li>
                <li>Información de contacto</li>
                <li>Información de perfil y preferencias</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">2.2 Información de Uso</h3>
              <p className="text-gray-700 mb-4">
                Automáticamente recopilamos información sobre cómo utiliza nuestra plataforma:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Páginas visitadas y tiempo de navegación</li>
                <li>Cursos en los que se inscribe y progreso</li>
                <li>Interacciones con el contenido y otros usuarios</li>
                <li>Información técnica del dispositivo y navegador</li>
                <li>Dirección IP y ubicación geográfica aproximada</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Cómo Utilizamos su Información</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos su información personal para los siguientes propósitos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Proporcionar y mejorar nuestros servicios educativos</li>
                <li>Personalizar su experiencia de aprendizaje</li>
                <li>Procesar pagos y gestionar suscripciones</li>
                <li>Enviar comunicaciones importantes sobre su cuenta</li>
                <li>Responder a sus consultas y solicitudes de soporte</li>
                <li>Analizar el uso de la plataforma para mejoras</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Compartir Información</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">4.1 Compartir con Su Consentimiento</h3>
              <p className="text-gray-700 mb-4">
                Solo compartimos su información personal cuando nos autorice explícitamente, por ejemplo, 
                para conectar con otros estudiantes o participar en programas de certificación.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">4.2 Proveedores de Servicios</h3>
              <p className="text-gray-700 mb-4">
                Trabajamos con terceros que nos ayudan a operar la plataforma:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Procesadores de pago:</strong> Stripe, PayPal para procesar transacciones</li>
                <li><strong>Servicios de email:</strong> Resend para comunicaciones</li>
                <li><strong>Análisis web:</strong> Google Analytics para mejorar nuestros servicios</li>
                <li><strong>Hosting y CDN:</strong> Vercel, Cloudflare para el funcionamiento técnico</li>
                <li><strong>Soporte al cliente:</strong> Zendesk para atención al cliente</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">4.3 Cumplimiento Legal</h3>
              <p className="text-gray-700 mb-4">
                Podemos compartir información cuando:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>La ley lo requiera o en respuesta a procesos legales</li>
                <li>Para proteger nuestros derechos, propiedad o seguridad</li>
                <li>Para prevenir fraudes o actividades ilegales</li>
                <li>En caso de emergencia que amenace la seguridad pública</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">4.4 Transferencias Empresariales</h3>
              <p className="text-gray-700 mb-4">
                En caso de fusión, adquisición o venta de activos, su información personal puede ser 
                transferida como parte de la transacción. Le notificaremos cualquier cambio de propiedad 
                o uso de su información personal.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Información de Pagos y Suscripciones</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">5.1 Información de Pago</h3>
              <p className="text-gray-700 mb-4">
                Para procesar suscripciones y pagos, recopilamos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Información de tarjetas de crédito/débito (procesada por Stripe/PayPal)</li>
                <li>Dirección de facturación y envío</li>
                <li>Historial de transacciones y suscripciones</li>
                <li>Información de facturación fiscal (RFC, razón social)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">5.2 Procesamiento de Pagos</h3>
              <p className="text-gray-700 mb-4">
                Utilizamos procesadores de pago de terceros (Stripe, PayPal) que cumplen con estándares 
                PCI DSS. No almacenamos información completa de tarjetas de crédito en nuestros servidores.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">5.3 Facturación y Contabilidad</h3>
              <p className="text-gray-700 mb-4">
                Su información de facturación se utiliza para:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Generar facturas fiscales y comprobantes de pago</li>
                <li>Cumplir con obligaciones fiscales y contables</li>
                <li>Procesar reembolsos y disputas de pago</li>
                <li>Mantener registros financieros legales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Cookies y Tecnologías Similares</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">6.1 Tipos de Cookies</h3>
              <p className="text-gray-700 mb-4">
                Utilizamos diferentes tipos de cookies:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                <li><strong>Funcionales:</strong> Para recordar preferencias y configuraciones</li>
                <li><strong>Analíticas:</strong> Para analizar el uso y mejorar nuestros servicios</li>
                <li><strong>Publicitarias:</strong> Para mostrar contenido relevante (con su consentimiento)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">6.2 Control de Cookies</h3>
              <p className="text-gray-700 mb-4">
                Puede controlar el uso de cookies a través de:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Configuración de su navegador web</li>
                <li>Nuestro panel de preferencias de privacidad</li>
                <li>Herramientas de terceros como AdChoices</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">6.3 Tecnologías de Seguimiento</h3>
              <p className="text-gray-700 mb-4">
                También utilizamos tecnologías como web beacons, pixels y local storage para mejorar 
                su experiencia y analizar el uso de nuestros servicios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Seguridad de Datos</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">7.1 Medidas de Seguridad Técnicas</h3>
              <p className="text-gray-700 mb-4">
                Implementamos las siguientes medidas de seguridad:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Encriptación:</strong> AES-256 para datos en reposo, TLS 1.3 para datos en tránsito</li>
                <li><strong>Autenticación:</strong> Autenticación de dos factores y tokens JWT seguros</li>
                <li><strong>Monitoreo:</strong> Sistemas de detección de intrusiones y alertas en tiempo real</li>
                <li><strong>Backups:</strong> Copias de seguridad encriptadas y redundantes</li>
                <li><strong>Firewalls:</strong> Protección de red y aplicación</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">7.2 Medidas Organizativas</h3>
              <p className="text-gray-700 mb-4">
                También implementamos medidas organizativas:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Capacitación regular del personal en seguridad</li>
                <li>Políticas de acceso mínimo y principio de necesidad</li>
                <li>Auditorías de seguridad periódicas</li>
                <li>Procedimientos de respuesta a incidentes</li>
                <li>Evaluaciones de riesgo regulares</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">7.3 Notificación de Breaches</h3>
              <p className="text-gray-700 mb-4">
                En caso de una violación de seguridad que afecte su información personal, le notificaremos 
                dentro de las 72 horas de haber detectado el incidente, según lo requieren las leyes aplicables.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Retención de Datos</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">8.1 Períodos de Retención</h3>
              <p className="text-gray-700 mb-4">
                Conservamos su información personal durante los siguientes períodos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Datos de cuenta:</strong> Mientras su cuenta esté activa + 3 años después de la cancelación</li>
                <li><strong>Datos de pago:</strong> 7 años para cumplir con obligaciones fiscales</li>
                <li><strong>Datos de uso:</strong> 2 años para análisis y mejoras</li>
                <li><strong>Comunicaciones:</strong> 3 años para soporte al cliente</li>
                <li><strong>Logs de seguridad:</strong> 1 año para auditorías</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">8.2 Eliminación de Datos</h3>
              <p className="text-gray-700 mb-4">
                Cuando ya no necesitemos su información, la eliminaremos de forma segura usando métodos 
                aprobados por estándares de la industria. Los datos eliminados no pueden ser recuperados.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">8.3 Excepciones de Retención</h3>
              <p className="text-gray-700 mb-4">
                Podemos conservar información por períodos más largos cuando:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>La ley lo requiera (obligaciones fiscales, legales)</li>
                <li>Para resolver disputas o hacer cumplir acuerdos</li>
                <li>Para proteger nuestros derechos legales</li>
                <li>Para prevenir fraudes o actividades ilegales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Sus Derechos ARCO</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">9.1 Derechos ARCO</h3>
              <p className="text-gray-700 mb-4">
                Según la Ley Federal de Protección de Datos Personales en Posesión de Particulares, usted tiene:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Acceso:</strong> Conocer qué datos tenemos y cómo los usamos</li>
                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                <li><strong>Cancelación:</strong> Eliminar sus datos de nuestros registros</li>
                <li><strong>Oposición:</strong> Oponerse al uso de sus datos para fines específicos</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">9.2 Ejercicio de Derechos</h3>
              <p className="text-gray-700 mb-4">
                Para ejercer sus derechos ARCO:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Envíe una solicitud por escrito a dpo@egrow-academy.com</li>
                <li>Incluya su identificación oficial</li>
                <li>Especifique qué derecho desea ejercer</li>
                <li>Responderemos en un máximo de 20 días hábiles</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">9.3 Derechos Adicionales</h3>
              <p className="text-gray-700 mb-4">
                También tiene derecho a:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
                <li><strong>Limitación:</strong> Restringir el procesamiento de sus datos</li>
                <li><strong>Revocación:</strong> Retirar su consentimiento en cualquier momento</li>
                <li><strong>Reclamo:</strong> Presentar una queja ante el INAI</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Protección de Menores</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">10.1 Edad Mínima</h3>
              <p className="text-gray-700 mb-4">
                Nuestros servicios no están dirigidos a menores de 13 años. No recopilamos intencionalmente 
                información personal de menores de 13 años sin el consentimiento verificable de sus padres o tutores.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">10.2 Verificación de Edad</h3>
              <p className="text-gray-700 mb-4">
                Para usuarios entre 13 y 18 años, requerimos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Consentimiento de padres o tutores legales</li>
                <li>Verificación de identidad del tutor</li>
                <li>Supervisión parental de la actividad en la plataforma</li>
                <li>Restricciones en ciertas funcionalidades</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">10.3 Reportes de Menores</h3>
              <p className="text-gray-700 mb-4">
                Si es padre o tutor y cree que su hijo nos ha proporcionado información personal sin su 
                consentimiento, contáctenos inmediatamente a dpo@egrow-academy.com para eliminar la información.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Transferencias Internacionales</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">11.1 Alcance de las Transferencias</h3>
              <p className="text-gray-700 mb-4">
                Su información puede ser transferida y procesada en países diferentes al suyo, incluyendo 
                Estados Unidos, países de la Unión Europea y otros países donde operan nuestros proveedores de servicios.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">11.2 Garantías de Protección</h3>
              <p className="text-gray-700 mb-4">
                Nos aseguramos de que estas transferencias cumplan con las leyes de protección de datos 
                aplicables mediante:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Cláusulas contractuales estándar aprobadas por la UE</li>
                <li>Certificaciones de adecuación de países</li>
                <li>Certificaciones corporativas vinculantes</li>
                <li>Códigos de conducta aprobados</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">11.3 Proveedores de Servicios</h3>
              <p className="text-gray-700 mb-4">
                Trabajamos con proveedores que cumplen con estándares internacionales de protección de datos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Stripe (Estados Unidos) - Procesamiento de pagos</li>
                <li>Vercel (Estados Unidos) - Hosting y CDN</li>
                <li>Resend (Estados Unidos) - Servicios de email</li>
                <li>Google Analytics (Estados Unidos) - Análisis web</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Cambios en esta Política</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">12.1 Notificación de Cambios</h3>
              <p className="text-gray-700 mb-4">
                Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos cualquier 
                cambio significativo por:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Email a la dirección registrada en su cuenta</li>
                <li>Aviso prominente en nuestra plataforma</li>
                <li>Notificación push (si tiene habilitadas las notificaciones)</li>
                <li>Actualización de la fecha de "Última actualización"</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">12.2 Aceptación de Cambios</h3>
              <p className="text-gray-700 mb-4">
                Su uso continuado después de los cambios constituye aceptación de la nueva política. 
                Si no está de acuerdo con los cambios, puede cancelar su cuenta antes de que entren en vigor.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">12.3 Historial de Cambios</h3>
              <p className="text-gray-700 mb-4">
                Mantenemos un historial de cambios en esta política disponible en nuestra plataforma 
                para su consulta.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Contacto y Oficial de Privacidad</h2>
              <p className="text-gray-700 mb-4">
                Para cualquier consulta sobre esta Política de Privacidad o el manejo de sus datos:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Oficial de Privacidad (DPO):</strong> dpo@egrow-academy.com<br />
                  <strong>Asuntos de Privacidad:</strong> privacidad@egrow-academy.com<br />
                  <strong>Soporte Técnico:</strong> soporte@egrow-academy.com<br />
                  <strong>Teléfono:</strong> +52 (55) 1234-5678<br />
                  <strong>Dirección:</strong> Ciudad de México, México<br />
                  <strong>Horario:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM (GMT-6)
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">14. Autoridades Supervisoras</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">14.1 México - INAI</h3>
              <p className="text-gray-700 mb-4">
                Si considera que el procesamiento de su información personal no cumple con la Ley Federal 
                de Protección de Datos Personales, puede presentar una queja ante el Instituto Nacional 
                de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI).
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">14.2 Unión Europea - GDPR</h3>
              <p className="text-gray-700 mb-4">
                Para usuarios de la UE, puede presentar una queja ante la autoridad supervisora de 
                protección de datos de su país de residencia.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">14.3 Estados Unidos</h3>
              <p className="text-gray-700 mb-4">
                Para usuarios de Estados Unidos, puede contactar a la Federal Trade Commission (FTC) 
                o a la autoridad estatal correspondiente.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 