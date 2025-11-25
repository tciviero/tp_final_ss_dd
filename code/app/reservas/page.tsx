"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Calendar, Users, Home, ListChecks } from 'lucide-react'
import { Navbar } from "@/components/navbar"
import { getUserId } from "@/lib/userIdManager"

interface Huesped {
  nombre: string
  email: string
  telefono?: string
}

interface Reserva {
  id: string
  cabana_id: string
  user_id: string
  huesped: Huesped
  fecha_entrada: string
  fecha_salida: string
  cantidad_personas: number
  fecha_creacion: string
  estado: "confirmada" | "cancelada"
}

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export default function ReservasPage() {
    const [reservas, setReservas] = useState<Reserva[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userId, setUserId] = useState<string>("")

    useEffect(() => {
      // Obtener el user_id del cliente
      const id = getUserId()
      setUserId(id)

      const fetchReservas = async () => {
        try {
          // 👈 Filtrar por user_id
          const response = await fetch(`/api/reservar?user_id=${id}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
          })

          if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener la lista de reservas.`)
          }

          const data = await response.json()
          setReservas(data.reservas || [])
          setError(null)
        } catch (err) {
          console.error('Error al cargar las reservas:', err)
          setError('Hubo un problema al cargar los datos de reservas.')
        } finally {
          setLoading(false)
        }
      }

      if (id) {
        fetchReservas()
      }
    }, [])

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-sky-600" />
          <span className="text-xl text-gray-700">Cargando reservas...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex justify-center p-8">
          <Card className="w-full max-w-4xl border-red-400 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">Error de Carga</CardTitle>
            </CardHeader>
            <CardContent className="text-red-700">
              {error} Por favor, verifica que tu servidor esté corriendo.
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="container mx-auto p-4 md:p-8">
          <Navbar />
          <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
            Mis Reservas
          </h1>
          
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Tienes {reservas.length} {reservas.length === 1 ? 'reserva' : 'reservas'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reservas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Aún no tienes reservas registradas.</p>
                  <a href="/catalogo">
                    <Button>Ver Cabañas Disponibles</Button>
                  </a>
                </div>
              ) : (
                <Table>
                  <TableCaption>Lista de tus reservas confirmadas.</TableCaption>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[120px] font-bold text-gray-700">ID Reserva</TableHead>
                      <TableHead className="font-bold text-gray-700 flex items-center">
                        <Home className="w-4 h-4 mr-1"/> Cabaña
                      </TableHead>
                      <TableHead className="font-bold text-gray-700">Huésped</TableHead>
                      <TableHead className="font-bold text-gray-700 flex items-center">
                        <Calendar className="w-4 h-4 mr-1"/> Check-in
                      </TableHead>
                      <TableHead className="font-bold text-gray-700">Check-out</TableHead>
                      <TableHead className="font-bold text-gray-700 flex items-center">
                        <Users className="w-4 h-4 mr-1"/> Personas
                      </TableHead>
                      <TableHead className="font-bold text-gray-700">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservas.map((reserva) => (
                      <TableRow key={reserva.id}>
                        <TableCell className="font-mono text-sm text-gray-600">
                          {reserva.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="font-semibold">{reserva.cabana_id}</TableCell> 
                        <TableCell>
                            <div className='font-medium'>{reserva.huesped.nombre}</div>
                            <div className='text-xs text-gray-500'>{reserva.huesped.email}</div>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(reserva.fecha_entrada)}</TableCell>
                        <TableCell className="text-sm">{formatDate(reserva.fecha_salida)}</TableCell>
                        <TableCell className="text-center">{reserva.cantidad_personas}</TableCell>
                        <TableCell>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {reserva.estado}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

        <div className="py-4 bg-background border-t mt-8">
          <div className="container mx-auto px-4 flex justify-center">
            <a href="/">
              <Button variant="ghost" className="text-sm text-gray-500 hover:text-sky-600">
                Volver al Inicio
              </Button>
            </a>
          </div>
        </div>

        <footer className="bg-card border-t py-8">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>© 2025 Cabañas Ushuaia. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    )
}