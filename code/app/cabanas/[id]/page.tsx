import Link from "next/link"
//import Cabana from "../../lib/types.ts"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, ChevronLeft, Check } from 'lucide-react'
import { Navbar } from "@/components/navbar"
import { Cabana } from "@/lib/types"
import CabanaGallery from "./CabanaGallery"
import ReservationForm from "./ReservationForm"
import { getCabanaById } from "@/lib/json-db"

/*async function getCabana(id: string): Promise<Cabana | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cabanas/${id}`, {
      cache: 'no-store' // O usa 'force-cache' si quieres cache
    })
    
    if (!res.ok) {
      return null
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching cabana:', error)
    return null
  }
}*/

export default async function CabanaDetailPage({ params }: { params: Promise<{ id: string }> } ) {
const { id } = await params
//const cabana = await getCabana(id)
const res = await fetch(`http://localhost:3000/api/cabanas/${id}`)
const cabana = await res.json()

  if (!cabana) {
    notFound()
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
          <CabanaGallery imagenes={cabana.imagenes} nombre={cabana.nombre} />

          {/* Details & Reservation */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{cabana.nombre}</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {cabana.descripcion}
            </p>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-lg font-medium">Hasta {cabana.capacidad} personas</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold">${cabana.precio}</span>
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
                  {cabana.servicios.map((servicio: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{servicio}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reservation Form */}
            <ReservationForm cabana={cabana} />
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