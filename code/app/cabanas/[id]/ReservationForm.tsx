"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Cabana, Reserva } from "@/lib/types"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { getUserId } from "@/lib/userIdManager"

interface ReservationFormProps {
  cabana: Cabana
  reservasExistentes: Reserva[]
}

// Función para verificar si hay superposición de fechas
function checkDateOverlap(
  newStart: Date,
  newEnd: Date,
  existingStart: Date,
  existingEnd: Date
): boolean {
  return newStart < existingEnd && newEnd > existingStart
}

export default function ReservationForm({ cabana, reservasExistentes }: ReservationFormProps) {
  const [userId, setUserId] = useState<string>("")
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
  const [disponibilidadMessage, setDisponibilidadMessage] = useState<string | null>(null)
  const [fechasDisponibles, setFechasDisponibles] = useState<boolean>(true)

  useEffect(() => {
    const id = getUserId()
    setUserId(id)
  }, [])

  // Validar disponibilidad cuando cambien las fechas
  useEffect(() => {
    if (formData.fechaInicio && formData.fechaFin) {
      const inicio = new Date(formData.fechaInicio)
      const fin = new Date(formData.fechaFin)

      if (inicio >= fin) {
        setDisponibilidadMessage("La fecha de salida debe ser posterior a la entrada")
        setFechasDisponibles(false)
        return
      }

      // Verificar si las fechas se superponen con reservas existentes
      let hayConflicto = false
      for (const reserva of reservasExistentes) {
        const reservaInicio = new Date(reserva.fecha_entrada)
        const reservaFin = new Date(reserva.fecha_salida)

        if (checkDateOverlap(inicio, fin, reservaInicio, reservaFin)) {
          hayConflicto = true
          setDisponibilidadMessage(
            `Estas fechas no están disponibles. Conflicto con reserva del ${reservaInicio.toLocaleDateString('es-AR')} al ${reservaFin.toLocaleDateString('es-AR')}`
          )
          setFechasDisponibles(false)
          break
        }
      }

      if (!hayConflicto) {
        setDisponibilidadMessage("✓ Fechas disponibles")
        setFechasDisponibles(true)
      }
    } else {
      setDisponibilidadMessage(null)
      setFechasDisponibles(true)
    }
  }, [formData.fechaInicio, formData.fechaFin, reservasExistentes])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fechasDisponibles) {
      setStatusMessage({ 
        type: 'error', 
        text: 'Por favor selecciona fechas disponibles antes de confirmar.'
      })
      return
    }

    setIsLoading(true)
    setStatusMessage({ type: null, text: null })
    
    const reservaPayload = {
      cabana_id: cabana.id,
      fecha_entrada: formData.fechaInicio,
      fecha_salida: formData.fechaFin,
      cantidad_personas: parseInt(formData.personas, 10), 
      huesped: {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono, 
      },
      user_id: userId,
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
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          fechaInicio: "",
          fechaFin: "",
          personas: ""
        })
        
        // Opcional: redirigir a "Mis Reservas" después de 2 segundos
        setTimeout(() => {
          window.location.href = '/reservas'
        }, 2000)
      } else {
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
          
          {statusMessage.type && (
            <Alert variant={statusMessage.type === 'success' ? 'default' : 'destructive'}>
              {statusMessage.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{statusMessage.text}</AlertDescription>
            </Alert>
          )}

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
                  min={new Date().toISOString().split('T')[0]}
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
                  min={formData.fechaInicio || new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Mensaje de disponibilidad */}
            {disponibilidadMessage && (
              <Alert variant={fechasDisponibles ? 'default' : 'destructive'}>
                {fechasDisponibles ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{disponibilidadMessage}</AlertDescription>
              </Alert>
            )}

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
            disabled={isLoading || !fechasDisponibles}
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