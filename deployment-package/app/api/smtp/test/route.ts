
import { NextRequest, NextResponse } from "next/server"
import { sendContactEmail, ContactFormData } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()

    // Add test prefix to subject
    const testData = {
      ...data,
      asunto: `[TEST] ${data.asunto}`,
      mensaje: `[ESTE ES UN EMAIL DE PRUEBA]\n\n${data.mensaje}\n\nEste email fue enviado desde la configuración SMTP del panel de administración para verificar que la configuración está funcionando correctamente.`
    }

    const result = await sendContactEmail(testData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email de prueba enviado correctamente",
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.error || "Error al enviar el email de prueba"
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in SMTP test:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor al probar SMTP"
      },
      { status: 500 }
    )
  }
}
