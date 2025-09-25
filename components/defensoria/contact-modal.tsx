"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Mail, X } from "lucide-react"

interface ContactModalProps {
  type: 'Queja' | 'Sugerencia' | 'Felicitaciones'
  children: React.ReactNode
}

export default function ContactModal({ type, children }: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    surname: '',
    email: '',
    phone: '',
    subject: '',
    subject2: '',
    message: '',
    attachment: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.surname || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios (Primer nombre, Apellido, Correo electrónico y Mensaje).",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/defensoria-audiencia/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          name: `${formData.firstName} ${formData.lastName ? formData.lastName + ' ' : ''}${formData.surname}`.trim(),
          type: type
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "¡Enviado exitosamente!",
          description: result.message,
        })
        
        // Reset form and close modal
        setFormData({
          firstName: '',
          lastName: '',
          surname: '',
          email: '',
          phone: '',
          subject: '',
          subject2: '',
          message: '',
          attachment: ''
        })
        setIsOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.error || `Error al enviar la ${type.toLowerCase()}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      toast({
        title: "Error",
        description: "Error de conexión. Por favor, intente nuevamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeColor = () => {
    // Use consistent purple theme for all types to maintain professional appearance
    return 'text-purple-700 border-purple-200 bg-purple-50'
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-center mb-6">
            <DialogTitle className="text-2xl font-bold text-purple-800 mb-2">
              {type} - Defensoría de Audiencia
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Complete el formulario para enviar su {type.toLowerCase()} a la Defensoría de Audiencia
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-800 border-b border-purple-200 pb-2">
              Nombre y Apellido <span className="text-sm font-normal text-gray-500">(Obligatorio)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-purple-700">
                  Primer nombre
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder=""
                  className="mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-purple-700">
                  Segundo nombre
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder=""
                  className="mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="surname" className="text-sm font-medium text-purple-700">
                  Apellido
                </Label>
                <Input
                  id="surname"
                  type="text"
                  value={formData.surname || ''}
                  onChange={(e) => handleInputChange('surname', e.target.value)}
                  placeholder=""
                  className="mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-purple-700">
                  Correo electrónico <span className="text-sm font-normal text-gray-500">(Obligatorio)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@example.com"
                  className="mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-purple-700">
                  Celular
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder=""
                  className="mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Message Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requestType" className="text-sm font-medium text-purple-700">
                  Tipo de solicitud
                </Label>
                <div className="mt-1 p-3 bg-purple-50 rounded-md border border-purple-200">
                  <span className="font-medium text-purple-800">{type}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="subject" className="text-sm font-medium text-purple-700">
                  Solicitud de información
                </Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder=""
                  className="mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="subject2" className="text-sm font-medium text-purple-700">
                Tema o asunto <span className="text-sm font-normal text-gray-500">(Campo corto)</span>
              </Label>
              <Input
                id="subject2"
                type="text"
                value={formData.subject2 || ''}
                onChange={(e) => handleInputChange('subject2', e.target.value)}
                placeholder=""
                className="mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium text-purple-700">
                Mensaje / Descripción <span className="text-sm font-normal text-gray-500">(Campo largo)</span>
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder=""
                className="mt-1 min-h-[120px] border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="attachment" className="text-sm font-medium text-purple-700">
                Archivo adjunto <span className="text-sm font-normal text-gray-500">(opcional, para evidencia)</span>
              </Label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  id="attachment"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    // Handle file upload logic here
                    const file = e.target.files?.[0]
                    if (file) {
                      handleInputChange('attachment', file.name)
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('attachment')?.click()}
                  className="px-4 py-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  EXAMINAR
                </Button>
                <span className="text-sm text-gray-500">
                  {formData.attachment || '(No se ha seleccionado ningún archivo)'}
                </span>
              </div>
            </div>
          </div>

          {/* Information Notice */}
          <div className="p-4 rounded-lg border-l-4 border-purple-400 bg-purple-50">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 mt-0.5 text-purple-600" />
              <div>
                <h4 className="font-medium text-purple-800">Información importante:</h4>
                <p className="text-sm mt-1 text-purple-700">
                  Su {type.toLowerCase()} será enviada directamente a la Defensoría de Audiencia del Canal del Congreso. 
                  Recibirá una confirmación por correo electrónico y nuestro equipo se pondrá en contacto con usted a la brevedad.
                </p>
                <p className="text-sm mt-2 font-medium text-purple-800">
                  Correo de contacto: defensoria.audiencia@canaldelcongreso.gob.mx
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-8 py-2 text-lg"
              style={{ backgroundColor: '#4f148c' }}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>ENVIANDO...</span>
                </div>
              ) : (
                'ENVIAR'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}