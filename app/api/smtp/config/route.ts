
import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const CONFIG_FILE = path.join(process.cwd(), "smtp-config.json")

interface SmtpConfig {
  host: string
  port: string
  secure: boolean
  user: string
  pass: string
  from: string
  to: string
}

export async function GET() {
  try {
    const configExists = await fs.access(CONFIG_FILE).then(() => true).catch(() => false)
    
    if (!configExists) {
      // Return default config
      return NextResponse.json({
        host: "",
        port: "587",
        secure: false,
        user: "",
        pass: "",
        from: "notificaciones@canaldelcongreso.gob.mx",
        to: "contacto@canaldelcongreso.gob.mx",
      })
    }

    const configData = await fs.readFile(CONFIG_FILE, "utf-8")
    const config = JSON.parse(configData)
    
    // Don't return the password for security
    return NextResponse.json({
      ...config,
      pass: config.pass ? "••••••••" : "",
    })
  } catch (error) {
    console.error("Error loading SMTP config:", error)
    return NextResponse.json(
      { success: false, message: "Error al cargar la configuración SMTP" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const config: SmtpConfig = await request.json()

    // Basic validation
    if (!config.host || !config.port || !config.user || !config.from || !config.to) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son requeridos (host, puerto, usuario, email remitente y email destino)" },
        { status: 400 }
      )
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(config.from)) {
      return NextResponse.json(
        { success: false, message: "El email remitente no tiene un formato válido" },
        { status: 400 }
      )
    }
    if (!emailRegex.test(config.to)) {
      return NextResponse.json(
        { success: false, message: "El email destino no tiene un formato válido" },
        { status: 400 }
      )
    }

    // Validate port
    const port = parseInt(config.port)
    if (isNaN(port) || port < 1 || port > 65535) {
      return NextResponse.json(
        { success: false, message: "El puerto debe ser un número entre 1 y 65535" },
        { status: 400 }
      )
    }

    // If password is masked, load the existing password
    if (config.pass === "••••••••") {
      try {
        const existingConfigData = await fs.readFile(CONFIG_FILE, "utf-8")
        const existingConfig = JSON.parse(existingConfigData)
        if (!existingConfig.pass) {
          return NextResponse.json(
            { success: false, message: "No hay una contraseña existente. Por favor, introduce una contraseña." },
            { status: 400 }
          )
        }
        config.pass = existingConfig.pass
      } catch (error) {
        return NextResponse.json(
          { success: false, message: "No se pudo recuperar la contraseña existente. Por favor, introduce una contraseña." },
          { status: 400 }
        )
      }
    } else if (!config.pass) {
      return NextResponse.json(
        { success: false, message: "La contraseña es requerida" },
        { status: 400 }
      )
    }

    // Save configuration
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2))

    return NextResponse.json({
      success: true,
      message: "Configuración SMTP guardada correctamente",
    })
  } catch (error) {
    console.error("Error saving SMTP config:", error)
    return NextResponse.json(
      { success: false, message: "Error interno del servidor al guardar la configuración SMTP" },
      { status: 500 }
    )
  }
}
