import type { Metadata } from 'next'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Términos y Condiciones - eGrow Academy',
  description: 'Términos y condiciones de uso de eGrow Academy, plataforma de aprendizaje de inteligencia artificial.',
  keywords: 'términos, condiciones, eGrow Academy, IA, inteligencia artificial, cursos',
}

export default function TerminosCondicionesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Términos y Condiciones
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Aceptación de los Términos</h2>
              <p className="text-gray-700 mb-4">
                Al acceder y utilizar eGrow Academy ("la Plataforma"), usted acepta estar sujeto a estos Términos y Condiciones. 
                Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Descripción del Servicio</h2>
              <p className="text-gray-700 mb-4">
                eGrow Academy es una plataforma educativa que ofrece cursos, recursos y contenido relacionado con la 
                inteligencia artificial. Nuestros servicios incluyen:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Cursos en línea sobre inteligencia artificial</li>
                <li>Recursos educativos y materiales de aprendizaje</li>
                <li>Comunidad de estudiantes y profesionales</li>
                <li>Certificaciones y acreditaciones</li>
                <li>Eventos y webinars</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Registro y Cuenta de Usuario</h2>
              <p className="text-gray-700 mb-4">
                Para acceder a ciertos servicios, debe crear una cuenta proporcionando información precisa y completa. 
                Usted es responsable de:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Mantener la confidencialidad de su contraseña</li>
                <li>Todas las actividades que ocurran bajo su cuenta</li>
                <li>Notificar inmediatamente cualquier uso no autorizado</li>
                <li>Proporcionar información de contacto válida y actualizada</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Uso Aceptable</h2>
              <p className="text-gray-700 mb-4">
                Usted se compromete a utilizar la Plataforma únicamente para fines legales y educativos. Está prohibido:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Usar la Plataforma para actividades ilegales o fraudulentas</li>
                <li>Compartir contenido ofensivo, difamatorio o inapropiado</li>
                <li>Intentar acceder a cuentas de otros usuarios</li>
                <li>Interferir con el funcionamiento de la Plataforma</li>
                <li>Distribuir malware o código malicioso</li>
                <li>Usar bots o scripts automatizados sin autorización</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Propiedad Intelectual</h2>
              <p className="text-gray-700 mb-4">
                Todo el contenido de eGrow Academy, incluyendo pero no limitado a cursos, videos, textos, imágenes, 
                y software, está protegido por derechos de autor y otras leyes de propiedad intelectual. 
                Usted puede utilizar el contenido únicamente para fines educativos personales.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Privacidad y Datos Personales</h2>
              <p className="text-gray-700 mb-4">
                Su privacidad es importante para nosotros. El uso de su información personal está regido por nuestra 
                Política de Privacidad, que forma parte de estos términos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Suscripciones y Facturación</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">7.1 Tipos de Suscripción</h3>
              <p className="text-gray-700 mb-4">
                eGrow Academy ofrece diferentes niveles de suscripción:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Plan Gratuito:</strong> Acceso limitado a cursos básicos y recursos</li>
                <li><strong>Plan Premium:</strong> Acceso completo a todos los cursos, certificaciones y soporte prioritario</li>
                <li><strong>Plan Empresarial:</strong> Acceso para equipos con gestión centralizada y reportes avanzados</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">7.2 Precios y Facturación</h3>
              <p className="text-gray-700 mb-4">
                Los precios se muestran en pesos mexicanos (MXN) e incluyen IVA (16%). Las suscripciones se facturan:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Mensual:</strong> Facturación automática cada mes</li>
                <li><strong>Anual:</strong> Facturación anual con descuento del 20%</li>
                <li><strong>Empresarial:</strong> Facturación personalizada según necesidades</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">7.3 Métodos de Pago</h3>
              <p className="text-gray-700 mb-4">
                Aceptamos los siguientes métodos de pago:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Tarjetas de crédito y débito (Visa, MasterCard, American Express)</li>
                <li>PayPal</li>
                <li>Transferencias bancarias (solo planes empresariales)</li>
                <li>Pagos en efectivo en puntos autorizados</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">7.4 Renovación Automática</h3>
              <p className="text-gray-700 mb-4">
                Las suscripciones se renuevan automáticamente al final de cada período. Usted puede cancelar su 
                suscripción en cualquier momento desde su panel de control. La cancelación entrará en vigor al 
                final del período de facturación actual.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">7.5 Facturación y Comprobantes</h3>
              <p className="text-gray-700 mb-4">
                Recibirá un comprobante de pago por email después de cada transacción exitosa. Las facturas 
                fiscales están disponibles en su panel de control. Para solicitar facturas especiales o 
                comprobantes adicionales, contacte a nuestro equipo de facturación.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">7.6 Cambios de Precio</h3>
              <p className="text-gray-700 mb-4">
                Nos reservamos el derecho de modificar los precios con 30 días de anticipación. Los cambios 
                se notificarán por email y se aplicarán en la siguiente renovación. Si no está de acuerdo con 
                el nuevo precio, puede cancelar su suscripción antes de la renovación.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Política de Reembolsos</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">8.1 Garantía de Satisfacción</h3>
              <p className="text-gray-700 mb-4">
                Ofrecemos una garantía de satisfacción de 30 días para todas las suscripciones. Si no está 
                satisfecho con nuestro servicio, puede solicitar un reembolso completo dentro de los primeros 
                30 días de su suscripción.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">8.2 Proceso de Reembolso</h3>
              <p className="text-gray-700 mb-4">
                Para solicitar un reembolso:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Contacte a nuestro equipo de soporte</li>
                <li>Proporcione su número de factura y motivo del reembolso</li>
                <li>El reembolso se procesará en 5-10 días hábiles</li>
                <li>El monto se devolverá al método de pago original</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">8.3 Excepciones</h3>
              <p className="text-gray-700 mb-4">
                No se otorgan reembolsos en los siguientes casos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Después de 30 días de la compra inicial</li>
                <li>Para suscripciones canceladas y reactivadas</li>
                <li>En caso de violación de nuestros términos de uso</li>
                <li>Para cursos o servicios personalizados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Uso del Contenido y Licencias</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">9.1 Licencia de Uso Personal</h3>
              <p className="text-gray-700 mb-4">
                Al suscribirse a eGrow Academy, se le otorga una licencia personal, no exclusiva, no transferible 
                y revocable para acceder y utilizar el contenido educativo únicamente para fines de aprendizaje personal.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">9.2 Restricciones de Uso</h3>
              <p className="text-gray-700 mb-4">
                Está estrictamente prohibido:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Compartir, distribuir o revender el contenido</li>
                <li>Descargar videos o materiales para uso offline</li>
                <li>Usar el contenido para fines comerciales sin autorización</li>
                <li>Crear obras derivadas basadas en nuestro contenido</li>
                <li>Compartir credenciales de acceso con terceros</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">9.3 Certificaciones</h3>
              <p className="text-gray-700 mb-4">
                Las certificaciones emitidas por eGrow Academy son válidas únicamente para el estudiante que 
                completó el curso. No se pueden transferir, vender o falsificar. Respetamos los derechos de 
                autor de terceros y no garantizamos la validez de certificaciones externas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Comunidad y Conducta</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">10.1 Normas de la Comunidad</h3>
              <p className="text-gray-700 mb-4">
                Nuestra comunidad se basa en el respeto mutuo. Esperamos que todos los usuarios:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Mantengan un comportamiento respetuoso y profesional</li>
                <li>No publiquen contenido ofensivo, discriminatorio o inapropiado</li>
                <li>No hagan spam o publiquen contenido comercial no autorizado</li>
                <li>Respeten la privacidad de otros usuarios</li>
                <li>No compartan información personal de terceros</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">10.2 Moderación</h3>
              <p className="text-gray-700 mb-4">
                Nos reservamos el derecho de moderar contenido, suspender cuentas o tomar acciones disciplinarias 
                contra usuarios que violen nuestras normas. Las decisiones de moderación son finales.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Limitación de Responsabilidad</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">11.1 Alcance de la Responsabilidad</h3>
              <p className="text-gray-700 mb-4">
                eGrow Academy proporciona servicios educativos "tal como están". No garantizamos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Resultados específicos de aprendizaje o empleo</li>
                <li>Disponibilidad ininterrumpida del servicio</li>
                <li>Compatibilidad con todos los dispositivos o navegadores</li>
                <li>Precisión absoluta del contenido educativo</li>
                <li>Validez de certificaciones para empleos específicos</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">11.2 Límites de Daños</h3>
              <p className="text-gray-700 mb-4">
                En ningún caso eGrow Academy será responsable por daños indirectos, incidentales, especiales, 
                consecuentes o punitivos, incluyendo pero no limitado a pérdida de beneficios, datos o uso. 
                Nuestra responsabilidad total está limitada al monto pagado por los servicios en los últimos 12 meses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Indemnización</h2>
              <p className="text-gray-700 mb-4">
                Usted acepta indemnizar y eximir de responsabilidad a eGrow Academy, sus directores, empleados 
                y agentes de cualquier reclamo, daño, pérdida o gasto (incluyendo honorarios legales) que surja 
                de su uso de nuestros servicios o violación de estos términos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Modificaciones y Terminación</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">13.1 Modificaciones de Términos</h3>
              <p className="text-gray-700 mb-4">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios se 
                notificarán por email y se publicarán en nuestra plataforma. Su uso continuado después de 
                los cambios constituye aceptación de los nuevos términos.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">13.2 Terminación por el Usuario</h3>
              <p className="text-gray-700 mb-4">
                Puede cancelar su cuenta en cualquier momento desde su panel de control. La cancelación 
                entrará en vigor inmediatamente, pero no se otorgan reembolsos por períodos no utilizados 
                excepto según nuestra política de reembolsos.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">13.3 Terminación por eGrow Academy</h3>
              <p className="text-gray-700 mb-4">
                Podemos suspender o terminar su cuenta inmediatamente por:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Violación de estos términos</li>
                <li>Uso fraudulento o abusivo del servicio</li>
                <li>Incumplimiento de pagos</li>
                <li>Actividades ilegales o que dañen a otros usuarios</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">14. Disposiciones Legales</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">14.1 Ley Aplicable</h3>
              <p className="text-gray-700 mb-4">
                Estos términos se rigen por las leyes de México. Cualquier disputa será resuelta en los 
                tribunales competentes de la Ciudad de México, renunciando a cualquier otra jurisdicción.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">14.2 Resolución de Disputas</h3>
              <p className="text-gray-700 mb-4">
                Antes de iniciar cualquier procedimiento legal, las partes se comprometen a intentar resolver 
                las disputas mediante negociación directa. Si no se logra una resolución en 30 días, las 
                partes pueden proceder con acciones legales.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">14.3 Divisibilidad</h3>
              <p className="text-gray-700 mb-4">
                Si alguna disposición de estos términos se considera inválida o inaplicable, las disposiciones 
                restantes permanecerán en pleno vigor y efecto.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">14.4 Acuerdo Completo</h3>
              <p className="text-gray-700 mb-4">
                Estos términos constituyen el acuerdo completo entre usted y eGrow Academy con respecto al 
                uso de nuestros servicios, reemplazando cualquier acuerdo anterior.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">15. Contacto y Soporte</h2>
              <p className="text-gray-700 mb-4">
                Para preguntas sobre estos términos, soporte técnico o información de facturación:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Asuntos Legales:</strong> legal@egrow-academy.com<br />
                  <strong>Soporte Técnico:</strong> soporte@egrow-academy.com<br />
                  <strong>Facturación:</strong> facturacion@egrow-academy.com<br />
                  <strong>Teléfono:</strong> +52 (55) 1234-5678<br />
                  <strong>Dirección:</strong> Ciudad de México, México<br />
                  <strong>Horario:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM (GMT-6)
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 