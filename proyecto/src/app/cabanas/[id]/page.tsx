"use client"

import { useState, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
//import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, ChevronLeft, Wifi, Flame, Utensils, Check } from 'lucide-react'
import { Navbar } from "@/components/navbar"
import cabanas from "@/data/cabanas.json"

export default function CabanaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const cabana = cabanas.find((c) => c.id === resolvedParams.id)
  const [currentImage, setCurrentImage] = useState(0)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fechaInicio: "",
    fechaFin: "",
    personas: ""
  })

  if (!cabana) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cabaña no encontrada</h1>
          <Link href="/catalogo">
            <Button>Volver al Catálogo</Button>
          </Link>
        </div>
      </div>
    )
  }

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
      console.error('[v0] Error submitting reservation:', error)
      alert('Error al procesar la reserva. Por favor intenta nuevamente.')
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/catalogo" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
              <img
                src={cabana.fotografias[currentImage] || "/placeholder.svg"}
                alt={`${cabana.nombre} - Imagen ${currentImage + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {cabana.fotografias.map((imagen, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`relative h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImage === idx ? 'border-primary' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img
                    src={imagen || "/placeholder.svg"}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Reservation */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{cabana.nombre}</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {cabana.descripcion}
            </p>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-lg font-medium">Hasta {cabana.capacidad_maxima} personas</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold">${cabana.precio_por_noche}</span>
                <span className="text-muted-foreground">/ noche</span>
              </div>
            </div>

            {/* Services */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Servicios incluidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {cabana.servicios.map((servicio, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{servicio}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reservation Form */}
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
                      max={cabana.capacidad_maxima}
                      required
                      value={formData.personas}
                      onChange={(e) => setFormData({...formData, personas: e.target.value})}
                      placeholder={`Máximo ${cabana.capacidad_maxima}`}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Confirmar Reserva
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Cabañas Ushuaia. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
