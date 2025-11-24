import { NextResponse } from "next/server";

// Define una interfaz base para la reserva (simulada)
interface Reserva {
  id: string;
  cabana_id: string;
  huesped: { nombre: string; email: string };
  fecha_entrada: string;
  fecha_salida: string;
  cantidad_personas: number;
  estado: string;
}

/**
 * Función para enviar el correo electrónico de confirmación de reserva.
 * En un entorno real, esto haría una llamada a SendGrid, Nodemailer, etc.
 * @param reserva El objeto de la reserva recién creada.
 * @returns true si el email fue enviado (o simulado con éxito), false si falló.
 */
export async function sendConfirmationEmail(reserva: Reserva): Promise<boolean> {
  // Configuración de Email (usar variables de entorno reales en producción)
  const EMAIL_API_URL = process.env.EMAIL_API_URL || "/api/sendgrid-email-placeholder";
  const API_KEY = process.env.EMAIL_API_KEY || "dummy_api_key_123";

  // Función de ayuda para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const htmlContent = `
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background-color: #f97316; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; line-height: 1.6; color: #333; }
        .details { background-color: #fff7ed; padding: 15px; border-radius: 4px; border-left: 5px solid #f97316; margin-top: 20px; }
        h1 { margin-top: 0; color: #1e3a8a; }
        .footer { text-align: center; padding: 20px; font-size: 0.8em; color: #777; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>¡Reserva Confirmada Exitosamente!</h2>
        </div>
        <div class="content">
          <p>Estimado/a <strong>${reserva.huesped.nombre}</strong>,</p>
          <p>Nos complace informarle que su reserva ha sido confirmada. ¡Esperamos darle la bienvenida!</p>

          <div class="details">
            <p><strong>Cabaña:</strong> ${reserva.cabana_id}</p>
            <p><strong>Código de Reserva:</strong> ${reserva.id.substring(0, 10)}</p>
            <p><strong>Check-in:</strong> ${formatDate(reserva.fecha_entrada)}</p>
            <p><strong>Check-out:</strong> ${formatDate(reserva.fecha_salida)}</p>
            <p><strong>Huéspedes:</strong> ${reserva.cantidad_personas}</p>
            <p><strong>Estado:</strong> ${reserva.estado.toUpperCase()}</p>
          </div>

          <p>Para cualquier consulta, no dude en responder a este correo.</p>
          <p>Atentamente,<br>El equipo de Cabañas Ushuaia.</p>
        </div>
        <div class="footer">
          Este es un correo automático, por favor no lo reenvíe.
        </div>
      </div>
    </body>
    </html>
  `;

  const emailPayload = {
    to: reserva.huesped.email,
    from: "noreply@cabañasushuaia.com", // Reemplazar con tu email verificado
    subject: `Confirmación de Reserva #${reserva.id.substring(0, 8)} - ${reserva.cabana_id}`,
    html: htmlContent,
  };

  try {
    // Simulación de la llamada a un servicio de email (Ej. SendGrid)
    // En un proyecto real, se haría un fetch(EMAIL_API_URL, {...})
    
    // Aquí simulamos que el envío siempre es exitoso.
    console.log(`[EmailService] Simulando envío de email a: ${reserva.huesped.email}`);
    console.log(`[EmailService] Asunto: ${emailPayload.subject}`);
    
    // Pequeño retardo para simular la latencia de la API externa
    await new Promise(resolve => setTimeout(resolve, 500)); 

    // Si la API responde con éxito (status 200 o 202):
    return true; 
    
    // Si usas fetch real, la lógica sería:
    /*
    const response = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(emailPayload)
    });

    if (response.ok) {
      return true;
    } else {
      console.error("Fallo la API de Email:", await response.text());
      return false;
    }
    */

  } catch (error) {
    console.error("[EmailService] Error al enviar el email:", error);
    // Si hay un error, se registra, pero la reserva ya está creada.
    return false;
  }
}

// Para propósitos de simulación, la exportamos aunque solo se use internamente.
export default sendConfirmationEmail;