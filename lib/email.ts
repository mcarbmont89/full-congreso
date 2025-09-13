import nodemailer from "nodemailer"
import fs from "fs/promises"
import path from "path"

export type ContactFormData = {
  nombre: string
  email: string
  telefono?: string
  asunto: string
  empresa?: string
  puesto?: string
  ciudad?: string
  estado?: string
  mensaje?: string
}

interface SmtpConfig {
  host: string
  port: string
  secure: boolean
  user: string
  pass: string
  from: string
  to: string
}

const CONFIG_FILE = path.join(process.cwd(), "smtp-config.json")

async function getSmtpConfig(): Promise<SmtpConfig | null> {
  try {
    const configData = await fs.readFile(CONFIG_FILE, "utf-8")
    return JSON.parse(configData)
  } catch (error) {
    console.log("No SMTP configuration found, using simulation mode")
    return null
  }
}

function createEmailTemplate(data: ContactFormData): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2e004f; color: white; padding: 20px; text-align: center;">
          <h1>Canal del Congreso - Formulario de Contacto</h1>
        </div>

        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #2e004f;">Nuevo mensaje de contacto</h2>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 150px;">Nombre:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.nombre}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.email}</td>
            </tr>
            ${data.telefono ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Teléfono:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.telefono}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Asunto:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.asunto}</td>
            </tr>
            ${data.empresa ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Empresa:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.empresa}</td>
            </tr>
            ` : ''}
            ${data.puesto ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Puesto:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.puesto}</td>
            </tr>
            ` : ''}
            ${data.ciudad ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Ciudad:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.ciudad}</td>
            </tr>
            ` : ''}
            ${data.estado ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Estado:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.estado}</td>
            </tr>
            ` : ''}
          </table>

          ${data.mensaje ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #2e004f;">Mensaje:</h3>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #2e004f; margin: 10px 0;">
              ${data.mensaje.replace(/\n/g, '<br>')}
            </div>
          </div>
          ` : ''}
        </div>

        <div style="background-color: #2e004f; color: white; padding: 15px; text-align: center;">
          <p style="margin: 0;">Canal del Congreso - Sistema de Contacto</p>
          <p style="margin: 5px 0 0 0; font-size: 12px;">Este mensaje fue enviado desde el formulario de contacto del sitio web.</p>
        </div>
      </body>
    </html>
  `
}

export async function sendContactEmail(data: ContactFormData) {
  try {
    const smtpConfig = await getSmtpConfig()

    if (!smtpConfig) {
      // Fallback to simulation mode
      console.log("SMTP not configured. Email would be sent with the following data:", {
        to: "contacto@canaldelcongreso.gob.mx",
        from: "notificaciones@canaldelcongreso.gob.mx",
        subject: `Formulario de Contacto: ${data.asunto}`,
        data: data,
      })
      return { 
        success: false, 
        error: "SMTP no está configurado. Por favor, configura SMTP en el panel de administración." 
      }
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: parseInt(smtpConfig.port),
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
      // Add timeout settings
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000, // 5 seconds
      socketTimeout: 10000, // 10 seconds
    })

    // Verify SMTP connection
    try {
      await transporter.verify()
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError)
      let errorMessage = "Error de verificación SMTP: "
      if (verifyError instanceof Error) {
        if (verifyError.message.includes('EAUTH')) {
          errorMessage += "Credenciales incorrectas (usuario/contraseña)"
        } else if (verifyError.message.includes('ECONNECTION')) {
          errorMessage += "No se puede conectar al servidor SMTP"
        } else if (verifyError.message.includes('ETIMEDOUT')) {
          errorMessage += "Tiempo de conexión agotado"
        } else {
          errorMessage += verifyError.message
        }
      } else {
        errorMessage += "Error desconocido"
      }
      return { success: false, error: errorMessage }
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"Canal del Congreso" <${smtpConfig.from}>`,
      to: smtpConfig.to,
      replyTo: data.email,
      subject: `Formulario de Contacto: ${data.asunto}`,
      html: createEmailTemplate(data),
      text: `
        Nuevo mensaje de contacto de ${data.nombre}

        Email: ${data.email}
        ${data.telefono ? `Teléfono: ${data.telefono}` : ''}
        Asunto: ${data.asunto}
        ${data.empresa ? `Empresa: ${data.empresa}` : ''}
        ${data.puesto ? `Puesto: ${data.puesto}` : ''}
        ${data.ciudad ? `Ciudad: ${data.ciudad}` : ''}
        ${data.estado ? `Estado: ${data.estado}` : ''}

        ${data.mensaje ? `Mensaje:\n${data.mensaje}` : ''}
      `,
    })

    console.log("Email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }

  } catch (error) {
    console.error("Error sending email:", error)
    let errorMessage = "Error al enviar email: "
    if (error instanceof Error) {
      if (error.message.includes('EAUTH')) {
        errorMessage += "Credenciales incorrectas"
      } else if (error.message.includes('ECONNECTION')) {
        errorMessage += "Error de conexión con el servidor"
      } else if (error.message.includes('ETIMEDOUT')) {
        errorMessage += "Tiempo de conexión agotado"
      } else {
        errorMessage += error.message
      }
    } else {
      errorMessage += "Error desconocido"
    }
    return { success: false, error: errorMessage }
  }
}