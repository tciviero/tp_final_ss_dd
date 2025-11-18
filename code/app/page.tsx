import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mountain, Wifi, Flame, Utensils, Trees, MapPin } from 'lucide-react'
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/ushuaia-patagonia-mountains-landscape-cabin.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Mountain className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white text-balance">
            Cabañas en Ushuaia
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto text-balance">
            Experimenta la magia del fin del mundo en nuestras acogedoras cabañas patagónicas
          </p>
          <Link href="/catalogo">
            <Button size="lg" className="text-lg px-8 py-6">
              Ver Catálogo de Cabañas
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Por qué elegirnos
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Ubicación Privilegiada</h3>
                <p className="text-muted-foreground">
                  Rodeadas de naturaleza, cerca de los principales atractivos de Ushuaia
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6 text-center">
                <Flame className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Confort Total</h3>
                <p className="text-muted-foreground">
                  Calefacción, chimenea y todas las comodidades para tu estadía perfecta
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6 text-center">
                <Trees className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Naturaleza Pura</h3>
                <p className="text-muted-foreground">
                  Vistas espectaculares a montañas, lagos y bosques patagónicos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para tu aventura patagónica?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Reserva ahora y vive una experiencia única en el fin del mundo
          </p>
          <Link href="/catalogo">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Explorar Cabañas
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Cabañas Ushuaia. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
