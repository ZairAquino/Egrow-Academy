import type { Metadata } from 'next'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Facturación - eGrow Academy',
  description: 'Información sobre facturación de eGrow Academy.',
}

export default function FacturacionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Información de Facturación
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Planes y Precios</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Plan Gratuito</h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">$0 MXN</p>
                  <ul className="text-gray-700 space-y-2">
                    <li>✓ Acceso a cursos básicos</li>
                    <li>✓ Recursos limitados</li>
                    <li>✓ Comunidad básica</li>
                    <li>✓ Soporte por email</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Plan Premium</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">$299 MXN</p>
                  <p className="text-sm text-gray-600 mb-3">por mes</p>
                  <ul className="text-gray-700 space-y-2">
                    <li>✓ Todos los cursos</li>
                    <li>✓ Certificaciones</li>
                    <li>✓ Soporte prioritario</li>
                    <li>✓ Recursos exclusivos</li>
                    <li>✓ Comunidad completa</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Plan Anual</h3>
                  <p className="text-3xl font-bold text-purple-600 mb-2">$2,399 MXN</p>
                  <p className="text-sm text-gray-600 mb-3">por año (20% descuento)</p>
                  <ul className="text-gray-700 space-y-2">
                    <li>✓ Todos los beneficios Premium</li>
                    <li>✓ 2 meses gratis</li>
                    <li>✓ Acceso anticipado a nuevos cursos</li>
                    <li>✓ Mentorías grupales</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Métodos de Pago</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Tarjetas de Crédito/Débito</h3>
                  <div className="flex space-x-4 mb-4">
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                    <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                    <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">AMEX</div>
                  </div>
                  <p className="text-gray-700">
                    Aceptamos todas las tarjetas principales. Los pagos se procesan de forma segura 
                    a través de Stripe con encriptación SSL.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">PayPal</h3>
                  <div className="w-16 h-8 bg-blue-500 rounded mb-4"></div>
                  <p className="text-gray-700">
                    Pague de forma segura con su cuenta PayPal. Ideal para usuarios que prefieren 
                    no compartir información de tarjetas.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">💳 Información de Seguridad</h4>
                <p className="text-yellow-700 text-sm">
                  No almacenamos información completa de tarjetas de crédito en nuestros servidores. 
                  Todos los pagos se procesan a través de proveedores certificados PCI DSS.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Facturación y Comprobantes</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">3.1 Comprobantes Automáticos</h3>
              <p className="text-gray-700 mb-4">
                Recibirá automáticamente un comprobante de pago por email después de cada transacción exitosa. 
                El comprobante incluye:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Número de transacción único</li>
                <li>Fecha y hora del pago</li>
                <li>Monto pagado (incluyendo IVA)</li>
                <li>Método de pago utilizado</li>
                <li>Plan o servicio adquirido</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">3.2 Facturas Fiscales</h3>
              <p className="text-gray-700 mb-4">
                Para solicitar facturas fiscales:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Acceda a su panel de control</li>
                <li>Vaya a la sección "Facturación"</li>
                <li>Seleccione la transacción deseada</li>
                <li>Complete los datos fiscales requeridos</li>
                <li>La factura se generará en 24-48 horas</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">3.3 Datos Fiscales Requeridos</h3>
              <p className="text-gray-700 mb-4">
                Para facturas fiscales necesitamos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>RFC:</strong> Registro Federal de Contribuyentes</li>
                <li><strong>Razón Social:</strong> Nombre de la empresa o persona</li>
                <li><strong>Dirección Fiscal:</strong> Domicilio fiscal completo</li>
                <li><strong>Uso de CFDI:</strong> Uso que se le dará a la factura</li>
                <li><strong>Regimen Fiscal:</strong> Tipo de contribuyente</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Renovación y Cancelación</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">4.1 Renovación Automática</h3>
              <p className="text-gray-700 mb-4">
                Las suscripciones se renuevan automáticamente al final de cada período. Recibirá una 
                notificación por email 3 días antes de la renovación.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">4.2 Cancelación de Suscripción</h3>
              <p className="text-gray-700 mb-4">
                Para cancelar su suscripción:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Acceda a su panel de control</li>
                <li>Vaya a "Configuración de Cuenta"</li>
                <li>Seleccione "Cancelar Suscripción"</li>
                <li>Confirme la cancelación</li>
                <li>Mantendrá acceso hasta el final del período pagado</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">4.3 Reembolsos</h3>
              <p className="text-gray-700 mb-4">
                Ofrecemos reembolsos completos dentro de los primeros 30 días si no está satisfecho. 
                Para solicitar un reembolso, contacte a nuestro equipo de soporte.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Impuestos y Cargos</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Desglose de Precios</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Precio base:</span>
                    <span>$257.76 MXN</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (16%):</span>
                    <span>$41.24 MXN</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>$299.00 MXN</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  * Los precios incluyen IVA según la legislación mexicana vigente.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Problemas de Pago</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">6.1 Pago Rechazado</h3>
              <p className="text-gray-700 mb-4">
                Si su pago es rechazado:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Verifique que su tarjeta tenga fondos suficientes</li>
                <li>Confirme que los datos de la tarjeta sean correctos</li>
                <li>Contacte a su banco si el problema persiste</li>
                <li>Intente con un método de pago alternativo</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">6.2 Cargos Duplicados</h3>
              <p className="text-gray-700 mb-4">
                Si nota un cargo duplicado:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Contacte inmediatamente a nuestro soporte</li>
                <li>Proporcione el número de transacción</li>
                <li>Procesaremos el reembolso en 5-10 días hábiles</li>
                <li>Le enviaremos confirmación por email</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Contacto de Facturación</h2>
              <p className="text-gray-700 mb-4">
                Para cualquier consulta relacionada con facturación:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email de Facturación:</strong> facturacion@egrow-academy.com<br />
                  <strong>Soporte de Pagos:</strong> pagos@egrow-academy.com<br />
                  <strong>Teléfono:</strong> +52 (55) 1234-5678<br />
                  <strong>Horario:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM (GMT-6)<br />
                  <strong>Tiempo de Respuesta:</strong> 24-48 horas hábiles
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Preguntas Frecuentes</h2>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    ¿Puedo cambiar mi método de pago?
                  </h3>
                  <p className="text-gray-700">
                    Sí, puede actualizar su método de pago en cualquier momento desde su panel de control 
                    en la sección "Métodos de Pago".
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    ¿Qué pasa si mi tarjeta expira?
                  </h3>
                  <p className="text-gray-700">
                    Recibirá una notificación por email cuando su tarjeta esté próxima a expirar. 
                    Actualice su información de pago para evitar interrupciones en su suscripción.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    ¿Puedo pausar mi suscripción?
                  </h3>
                  <p className="text-gray-700">
                    Actualmente no ofrecemos pausas de suscripción. Puede cancelar y reactivar 
                    cuando lo desee, pero perderá el acceso durante el período de cancelación.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    ¿Ofrecen descuentos para estudiantes?
                  </h3>
                  <p className="text-gray-700">
                    Sí, ofrecemos un descuento del 50% para estudiantes con credencial válida. 
                    Contacte a nuestro equipo para verificar su elegibilidad.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 