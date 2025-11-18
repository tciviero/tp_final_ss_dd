import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign } from 'lucide-react'
import { Navbar } from "@/components/navbar"
import cabanas from "@/data/cabanas.json"

export default function CatalogoPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestras Cabañas</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Descubre nuestra selección de cabañas en el corazón de la Patagonia
          </p>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cabanas.map((cabana) => (
              <Card key={cabana.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={cabana.imagen || "/placeholder.svg"}
                      alt={cabana.nombre}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{cabana.nombre}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {cabana.descripcion}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{cabana.capacidad} personas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">${cabana.precio}/noche</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cabana.servicios.slice(0, 3).map((servicio, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {servicio}
                      </Badge>
                    ))}
                    {cabana.servicios.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{cabana.servicios.length - 3} más
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link href={`/cabanas/${cabana.id}`} className="w-full">
                    <Button className="w-full">Ver Detalles y Reservar</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Cabañas Ushuaia. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
