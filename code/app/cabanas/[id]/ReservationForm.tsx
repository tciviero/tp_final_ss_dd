"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Cabana } from "@/lib/types"

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const reserva = {
      cabanaId: cabana.id,
      cabanaNombre: cabana.nombre,
      ...formData,
      fecha: new Date().toISOString()
    }

    try {
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva)
      })

      if (response.ok) {
        alert('¡Reserva realizada con éxito! Recibirás un email de confirmación.')
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          fechaInicio: "",
          fechaFin: "",
          personas: ""
        })
      } else {
        alert('Error al procesar la reserva. Por favor intenta nuevamente.')
      }
    } catch (error) {
      console.error('Error submitting reservation:', error)
      alert('Error al procesar la reserva. Por favor intenta nuevamente.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservar esta cabaña</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="juan@email.com"
            />
          </div>

          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              required
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              placeholder="+54 9 11 1234-5678"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fechaInicio">Fecha de entrada</Label>
              <Input
                id="fechaInicio"
                type="date"
                required
                value={formData.fechaInicio}
                onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="fechaFin">Fecha de salida</Label>
              <Input
                id="fechaFin"
                type="date"
                required
                value={formData.fechaFin}
                onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="personas">Cantidad de personas</Label>
            <Input
              id="personas"
              type="number"
              min="1"
              max={cabana.capacidad}
              required
              value={formData.personas}
              onChange={(e) => setFormData({...formData, personas: e.target.value})}
              placeholder={`Máximo ${cabana.capacidad}`}
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Confirmar Reserva
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}