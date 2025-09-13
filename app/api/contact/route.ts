import { type NextRequest, NextResponse } from "next/server"
import { sendContactEmail, type ContactFormData } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as ContactFormData

    // Basic validation
    if (!data.nombre || !data.email || !data.asunto) {
      return NextResponse.json({ success: false, message: "Nombre, email y asunto son requeridos" }, { status: 400 })
    }

    // Send the email
    const result = await sendContactEmail(data)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Mensaje enviado correctamente",
      })
    } else {
      return NextResponse.json(
        { success: false, message: "Error al enviar el mensaje", error: result.error },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in contact API route:", error)
    return NextResponse.json({ success: false, message: "Error al procesar la solicitud" }, { status: 500 })
  }
}
