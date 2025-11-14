import Link from "next/link"
import { Mountain } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
            <Mountain className="h-6 w-6 text-primary" />
            <span>Cabañas Ushuaia</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link href="/catalogo" className="text-sm font-medium hover:text-primary transition-colors">
              Catálogo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
