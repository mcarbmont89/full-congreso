
import { SmtpConfigClient } from "./smtp-config-client"
import { Mail, Settings } from "lucide-react"

export default function SmtpConfigPage() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Mail className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuración SMTP</h1>
            <p className="text-gray-600">Gestiona la configuración del servidor de correo para el formulario de contacto</p>
          </div>
        </div>

        <SmtpConfigClient />
      </div>
    </main>
  )
}
