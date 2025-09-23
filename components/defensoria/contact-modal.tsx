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
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios.",
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
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
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
    switch (type) {
      case 'Queja':
        return 'text-red-600 border-red-200 bg-red-50'
      case 'Sugerencia':
        return 'text-blue-600 border-blue-200 bg-blue-50'
      case 'Felicitaciones':
        return 'text-green-600 border-green-200 bg-green-50'
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'Queja':
        return '⚠️'
      case 'Sugerencia':
        return '💡'
      case 'Felicitaciones':
        return '🎉'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${getTypeColor()}`}>
                <span className="text-2xl">{getTypeIcon()}</span>
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {type} - Defensoría de Audiencia
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Complete el formulario para enviar su {type.toLowerCase()} a la Defensoría de Audiencia
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Información de Contacto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nombre completo *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ingrese su nombre completo"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo electrónico *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Teléfono (opcional)
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Número de teléfono"
                className="mt-1"
              />
            </div>
          </div>

          {/* Message Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Detalles de la {type}
            </h3>
            
            <div>
              <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                Asunto (opcional)
              </Label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder={`Asunto de su ${type.toLowerCase()}`}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                Mensaje *
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder={`Describa detalladamente su ${type.toLowerCase()}...`}
                className="mt-1 min-h-[120px]"
                required
              />
            </div>
          </div>

          {/* Information Notice */}
          <div className={`p-4 rounded-lg border-l-4 ${getTypeColor()}`}>
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 mt-0.5" />
              <div>
                <h4 className="font-medium">Información importante:</h4>
                <p className="text-sm mt-1">
                  Su {type.toLowerCase()} será enviada directamente a la Defensoría de Audiencia del Canal del Congreso. 
                  Recibirá una confirmación por correo electrónico y nuestro equipo se pondrá en contacto con usted a la brevedad.
                </p>
                <p className="text-sm mt-2 font-medium">
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
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Enviando...</span>
                </div>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar {type}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}