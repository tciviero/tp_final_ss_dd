"use client"

import { useState } from "react"
// Asumo que tienes los componentes de Shadcn/ui (Button, Card, Input, Label, etc.)
import { Button } from "@/components/ui/button" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Cabana } from "@/lib/types" // Mantengo la asunción de tu tipo Cabana
import { Loader2 } from "lucide-react" // Usaremos este icono para el estado de carga

interface ReservationFormProps {
  cabana: Cabana
}

export default function ReservationForm({ cabana }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fechaInicio: "",
    fechaFin: "",
    personas: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | null, text: string | null }>({ type: null, text: null })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatusMessage({ type: null, text: null }) // Limpiar mensajes anteriores
    

    const reservaPayload = {
      cabana_id: cabana.id,
      fecha_entrada: formData.fechaInicio,
      fecha_salida: formData.fechaFin,
      // Convertimos 'personas' a número ya que el servidor probablemente lo espera así
      cantidad_personas: parseInt(formData.personas, 10), 
      huesped: {
        nombre: formData.nombre,
        email: formData.email,
        // Incluimos teléfono, aunque no se valida explícitamente en el route.ts
        telefono: formData.telefono, 
      },
      // El servidor agrega fecha_creacion, así que no la enviamos desde el cliente.
    }

    try { 
      const response = await fetch('/api/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaPayload)
      })

      const responseData = await response.json()

      if (response.ok) {
        setStatusMessage({ 
          type: 'success', 
          text: '¡Reserva realizada con éxito! Recibirás un email de confirmación.'
        })
        // Limpiar el formulario después del éxito
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          fechaInicio: "",
          fechaFin: "",
          personas: ""
        })
      } else {
        // El servidor devolvió un error (400, 409, 500, etc.)
        // Usamos el mensaje de error del servidor si está disponible
        const errorMessage = responseData.message || 'Error al procesar la reserva. Por favor intenta nuevamente.'
        setStatusMessage({ 
          type: 'error', 
          text: errorMessage
        })
        console.error('Error del servidor:', response.status, responseData)
      }
    } catch (error) {
      console.error('Error submitting reservation:', error)
      setStatusMessage({ 
        type: 'error', 
        text: 'Error de conexión. No se pudo contactar al servidor. Revisa tu conexión.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Reservar esta cabaña</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Bloque de mensajes de estado */}
          {statusMessage.type && (
            <div className={`p-3 rounded-lg border ${
              statusMessage.type === 'success' 
                ? 'bg-green-100 border-green-400 text-green-700' 
                : 'bg-red-100 border-red-400 text-red-700'
            }`}>
              {statusMessage.text}
            </div>
          )}

          {/* Formulario */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="juan@email.com"
                      disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      required
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+54 9 11 1234-5678"
                      disabled={isLoading}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fechaInicio">Fecha de entrada</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  required
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="fechaFin">Fecha de salida</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  required
                  value={formData.fechaFin}
                  onChange={handleChange}
                  min={formData.fechaInicio || new Date().toISOString().split('T')[0]} // Debe ser posterior a la entrada
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="personas">Cantidad de personas</Label>
              <Input
                id="personas"
                type="number"
                min="1"
                max={cabana.capacidad.toString()}
                required
                value={formData.personas}
                onChange={handleChange}
                placeholder={`Máximo ${cabana.capacidad}`}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full transition duration-150 ease-in-out bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              'Confirmar Reserva'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}