function sendFiveHourReminder() {
  // Correo de prueba
  var email = "luisdavid.ls47@gmail.com"; 
  var nombre = "Luis David"; 

  var asunto = "¡Faltan solo 5 horas! Tu clase gratuita de eGrow Academy está por comenzar";
    
  var htmlBody = `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333333;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
  }
  .container {
    max-width: 600px;
    margin: 20px auto;
    background: #ffffff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .header {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 20px;
  }
  .header h1 {
    color: #0D47A1;
    font-size: 24px;
    margin: 0;
  }
  .whatsapp-section {
    text-align: center;
    margin-top: 30px;
    padding: 30px 20px;
    background-color: #E8F5E9;
    border-radius: 8px;
    border: 2px solid #25D366;
  }
  .whatsapp-section h2 {
    color: #0D47A1;
    font-size: 24px;
    margin-bottom: 10px;
  }
  .whatsapp-button {
    display: inline-block;
    background-color: #25D366;
    color: #ffffff !important;
    padding: 15px 30px;
    text-align: center;
    text-decoration: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 18px;
    margin: 15px 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }
  .whatsapp-button:hover {
    background-color: #128C7E;
  }
  .footer {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #eeeeee;
    margin-top: 20px;
    font-size: 12px;
    color: #777777;
  }
  .schedule-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;
  }
  .schedule-box {
    background-color: #ffffff;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    text-align: center;
    width: 150px;
    color: #ffffff;
  }
  .box-blue { background-color: #2196F3; }
  .box-purple { background-color: #9C27B0; }
  .box-orange { background-color: #FF9800; }
  .box-red { background-color: #E53935; }
  .box-green { background-color: #4CAF50; }
  .box-pink { background-color: #E91E63; }
  .box-teal { background-color: #009688; }
  .schedule-box h4 {
    margin: 0 0 5px 0;
    font-size: 14px;
  }
  .schedule-box p {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
  }
  .urgent-banner {
    background: linear-gradient(135deg, #E53935, #FF5722);
    color: white;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 20px;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
  .countdown {
    font-size: 28px;
    font-weight: bold;
    color: #E53935;
    text-align: center;
    margin: 20px 0;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="urgent-banner">
      <h2 style="margin: 0; font-size: 22px;">🚨 ¡ÚLTIMO AVISO! 🚨</h2>
      <p style="margin: 5px 0 0 0; font-size: 16px;">Tu clase comienza en menos de 5 horas</p>
    </div>

    <div class="header">
      <h1>¡Tu clase de eGrow Academy será HOY!</h1>
    </div>
    
    <p>Hola ${nombre},</p>

    <div class="countdown">
      ⏰ FALTAN SOLO 5 HORAS ⏰
    </div>

    <p>¡La espera está por terminar! En pocas horas comenzaremos nuestra clase interactiva gratuita. <strong>¡No te la puedes perder!</strong></p>
    
    <p style="font-size: 22px; font-weight: bold; color: #E91E63; margin-bottom: 5px; text-align: center;">
      🎥 Aprende a crear videos profesionales con IA
    </p>
    
    <p style="background: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #2196F3;">
      <span style="color: #0D47A1; font-weight: bold;">📅 Fecha:</span> HOY - Viernes 8 de agosto de 2025<br>
      <span style="color: #0D47A1; font-weight: bold;">💻 Plataforma:</span> Google Meet<br>
      <span style="color: #0D47A1; font-weight: bold;">🔗 Enlace:</span> <a href="https://meet.google.com/ido-wvhw-zaj" style="color: #E91E63; font-weight: bold;">https://meet.google.com/ido-wvhw-zaj</a>
    </p>

    <p><span style="color: #0D47A1; font-weight: bold; font-size: 18px;">🕒 Horarios por país:</span></p>

    <div class="schedule-container">
      <div class="schedule-box box-blue">
        <h4>México / CDMX</h4>
        <p>5:00 PM</p>
      </div>
      <div class="schedule-box box-purple">
        <h4>El Salvador</h4>
        <p>4:00 PM</p>
      </div>
      <div class="schedule-box box-orange">
        <h4>Ecuador</h4>
        <p>5:00 PM</p>
      </div>
      <div class="schedule-box box-red">
        <h4>Chile</h4>
        <p>6:00 PM</p>
      </div>
      <div class="schedule-box box-green">
        <h4>Cuba</h4>
        <p>6:00 PM</p>
      </div>
      <div class="schedule-box box-pink">
        <h4>Venezuela</h4>
        <p>6:00 PM</p>
      </div>
      <div class="schedule-box box-teal">
        <h4>España</h4>
        <p>12:00 AM (9 de agosto)</p>
      </div>
    </div>
    
    <br style="clear:both;">

    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #856404; margin-top: 0;">📋 Prepárate para la clase:</h3>
      <ul style="color: #856404; margin-bottom: 0;">
        <li>Ten lista una libreta o tu computadora para tomar notas</li>
        <li>Asegúrate de tener conexión estable a internet</li>
        <li>Únete 5-10 minutos antes para evitar problemas técnicos</li>
        <li>¡Prepara tus preguntas para la sesión de Q&A!</li>
      </ul>
    </div>

    <div class="whatsapp-section">
        <h2>🚀 ¡No te quedes fuera! Únete a nuestra comunidad de WhatsApp</h2>
        <p style="font-size: 16px; color: #333333;">Este grupo es una plataforma de aprendizaje exclusiva para <strong>profesionistas y freelancers</strong>. Conéctate con otros, comparte tus proyectos y obtén feedback para mejorar tus habilidades. ¡Te esperamos!</p>
        <a href="https://chat.whatsapp.com/F2syDYAv6WS1ADYdUi7hxT" class="whatsapp-button">Unirte al Grupo de WhatsApp</a>
    </div>

    <div style="text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
      <h3 style="margin-top: 0;">🎯 ¡Nos vemos en unas horas!</h3>
      <p style="margin-bottom: 0; font-size: 16px;">Recuerda marcar este correo como importante y añadir el evento a tu calendario para no olvidarlo.</p>
    </div>

    <div class="footer">
      <p>¡Te esperamos en la clase!<br>
      <strong>Equipo de eGrow Academy</strong><br>
      <a href="https://www.egrowacademy.com" style="color: #007bff; text-decoration: none;">www.egrowacademy.com</a></p>
    </div>
  </div>
</body>
</html>
    `;

  MailApp.sendEmail({
    to: email,
    subject: asunto,
    htmlBody: htmlBody 
  });

  Logger.log("Recordatorio de 5 horas enviado a: " + email);
}

// Función para enviar el correo de prueba
function enviarCorreoPrueba() {
  sendFiveHourReminder();
}