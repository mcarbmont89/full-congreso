import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      email,
      phone,
      type, // 'Queja', 'Sugerencia', or 'Felicitaciones'
      subject,
      message
    } = body
    
    // Validate required fields
    if (!name || !email || !type || !message) {
      return NextResponse.json(
        { error: 'Nombre, correo electrónico, tipo y mensaje son requeridos' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de correo electrónico inválido' },
        { status: 400 }
      )
    }
    
    // Validate type
    const validTypes = ['Queja', 'Sugerencia', 'Felicitaciones']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de solicitud inválido' },
        { status: 400 }
      )
    }
    
    console.log('Processing defensoria contact form:', { name, email, type, subject })
    
    // Create email content
    const emailSubject = subject || `${type} - Defensoría de Audiencia - ${name}`
    const emailContent = `
      <h2>Nueva ${type} - Defensoría de Audiencia</h2>
      
      <h3>Información del Contacto:</h3>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Correo electrónico:</strong> ${email}</p>
      ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
      
      <h3>Tipo de Solicitud:</h3>
      <p><strong>${type}</strong></p>
      
      ${subject ? `<h3>Asunto:</h3><p>${subject}</p>` : ''}
      
      <h3>Mensaje:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
      
      <hr>
      <p><em>Este mensaje fue enviado desde el formulario de Defensoría de Audiencia del Canal del Congreso</em></p>
      <p><em>Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</em></p>
    `
    
    // Send email to defensoria using SMTP configuration
    const emailResult = await sendEmail({
      to: 'defensoria.audiencia@canaldelcongreso.gob.mx',
      subject: emailSubject,
      html: emailContent,
      replyTo: email
    })
    
    if (emailResult.success) {
      console.log('Defensoria contact email sent successfully')
      
      // Send confirmation email to user
      const confirmationSubject = `Confirmación - ${type} recibida - Defensoría de Audiencia`
      const confirmationContent = `
        <h2>Confirmación de ${type} Recibida</h2>
        
        <p>Estimado/a ${name},</p>
        
        <p>Hemos recibido su ${type.toLowerCase()} dirigida a la Defensoría de Audiencia del Canal del Congreso.</p>
        
        <h3>Resumen de su solicitud:</h3>
        <p><strong>Tipo:</strong> ${type}</p>
        ${subject ? `<p><strong>Asunto:</strong> ${subject}</p>` : ''}
        <p><strong>Fecha de recepción:</strong> ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</p>
        
        <p>Nuestro equipo revisará su solicitud y se pondrá en contacto con usted a la brevedad posible.</p>
        
        <p>Gracias por contactar a la Defensoría de Audiencia del Canal del Congreso.</p>
        
        <hr>
        <p><strong>Canal del Congreso</strong><br>
        Defensoría de Audiencia<br>
        defensoria.audiencia@canaldelcongreso.gob.mx</p>
      `
      
      // Send confirmation (non-blocking)
      sendEmail({
        to: email,
        subject: confirmationSubject,
        html: confirmationContent
      }).catch(error => {
        console.error('Error sending confirmation email:', error)
        // Don't fail the main request if confirmation email fails
      })
      
      return NextResponse.json({
        success: true,
        message: `Su ${type.toLowerCase()} ha sido enviada exitosamente. Recibirá una confirmación por correo electrónico.`
      })
    } else {
      console.error('Failed to send defensoria contact email:', emailResult.error)
      return NextResponse.json(
        { error: 'Error al enviar el mensaje. Por favor, intente nuevamente más tarde.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error processing defensoria contact form:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor. Por favor, intente nuevamente más tarde.' },
      { status: 500 }
    )
  }
}