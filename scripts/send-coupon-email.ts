import 'dotenv/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendCouponEmail() {
  console.log('📧 Enviando email con códigos de cupón...\n');

  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ Error: RESEND_API_KEY no está configurada');
      process.exit(1);
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.error('❌ Error: RESEND_FROM_EMAIL no está configurada');
      process.exit(1);
    }

    const userEmail = 'aquinozair3@gmail.com';
    const couponCodes = {
      percent: 'TEST_1CENT_MONTHLY',
      fixed: 'TEST_1CENT_FIXED'
    };

    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Códigos de Cupón para Testing - eGrow Academy</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .coupon-box {
            background: white;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .coupon-code {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            background: #f0f4ff;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .steps {
            background: #e8f5e8;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
        }
        .step {
            margin: 10px 0;
            padding: 5px 0;
        }
        .step-number {
            background: #667eea;
            color: white;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: inline-block;
            text-align: center;
            line-height: 25px;
            margin-right: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎫 Códigos de Cupón para Testing</h1>
        <p>eGrow Academy - Prueba de Sistema de Pagos</p>
    </div>
    
    <div class="content">
        <h2>¡Hola! 👋</h2>
        <p>Has sido seleccionado para probar nuestro sistema de pagos en producción. Te hemos creado cupones especiales que te permitirán suscribirte por solo <strong>$0.01 USD</strong>.</p>
        
        <div class="coupon-box">
            <h3>🎯 Códigos de Cupón Disponibles</h3>
            <p><strong>Cupón de Descuento Porcentual:</strong></p>
            <div class="coupon-code">${couponCodes.percent}</div>
            <p><em>Descuento del 99.86% (reduce $6.99 a $0.01)</em></p>
            
            <p><strong>Cupón de Descuento Fijo:</strong></p>
            <div class="coupon-code">${couponCodes.fixed}</div>
            <p><em>Descuento de $6.98 USD (deja $0.01)</em></p>
        </div>
        
        <div class="steps">
            <h3>📋 Pasos para Usar el Cupón:</h3>
            <div class="step">
                <span class="step-number">1</span>
                Ve a <a href="https://egrowacademy.com/subscription" style="color: #667eea;">https://egrowacademy.com/subscription</a>
            </div>
            <div class="step">
                <span class="step-number">2</span>
                Inicia sesión con tu cuenta
            </div>
            <div class="step">
                <span class="step-number">3</span>
                Selecciona el <strong>Plan Mensual</strong> ($6.99)
            </div>
            <div class="step">
                <span class="step-number">4</span>
                En el campo "Código de descuento", ingresa uno de los códigos de arriba
            </div>
            <div class="step">
                <span class="step-number">5</span>
                Haz clic en "Aplicar"
            </div>
            <div class="step">
                <span class="step-number">6</span>
                Confirma la suscripción - solo pagarás $0.01 USD
            </div>
        </div>
        
        <div class="warning">
            <h4>⚠️ Información Importante:</h4>
            <ul>
                <li>Estos cupones solo se pueden usar <strong>UNA VEZ</strong></li>
                <li>El cargo será real pero mínimo ($0.01 USD)</li>
                <li>Tendrás acceso completo a todos los cursos premium</li>
                <li>Puedes cancelar la suscripción después de la prueba</li>
                <li>Estos cupones están configurados específicamente para testing</li>
            </ul>
        </div>
        
        <h3>🎉 Beneficios de la Suscripción:</h3>
        <ul>
            <li>✅ Acceso a todos los cursos especializados</li>
            <li>✅ Contenido actualizado mensualmente</li>
            <li>✅ Certificados de finalización</li>
            <li>✅ Soporte técnico prioritario</li>
            <li>✅ Acceso a la comunidad exclusiva</li>
            <li>✅ Proyectos prácticos incluidos</li>
        </ul>
        
        <p><strong>¿Tienes preguntas?</strong> No dudes en contactarnos respondiendo a este email.</p>
    </div>
    
    <div class="footer">
        <p>© 2024 eGrow Academy. Todos los derechos reservados.</p>
        <p>Este es un email de testing para verificar nuestro sistema de pagos.</p>
    </div>
</body>
</html>
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [userEmail],
      subject: '🎫 Códigos de Cupón para Testing - eGrow Academy',
      html: emailContent,
    });

    if (error) {
      console.error('❌ Error enviando email:', error);
      process.exit(1);
    }

    console.log('✅ Email enviado exitosamente:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Para: ${userEmail}`);
    console.log(`📨 ID del email: ${data?.id}`);
    console.log(`🎫 Códigos enviados:`);
    console.log(`   • ${couponCodes.percent} (descuento porcentual)`);
    console.log(`   • ${couponCodes.fixed} (descuento fijo)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📋 Resumen de la información enviada:');
    console.log('• URL de suscripción: https://egrowacademy.com/subscription');
    console.log('• Plan recomendado: Mensual ($6.99)');
    console.log('• Precio final con cupón: $0.01 USD');
    console.log('• Instrucciones detalladas incluidas en el email');
    console.log('• Advertencias sobre uso único y cargos reales\n');

    console.log('✅ Email con códigos de cupón enviado exitosamente');

  } catch (error) {
    console.error('❌ Error general:', error);
    process.exit(1);
  }
}

sendCouponEmail(); 