"use client"

import { useState } from "react"

interface CabanaGalleryProps {
  imagenes: string[]
  nombre: string
}

export default function CabanaGallery({ imagenes, nombre }: CabanaGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <div>
      <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
        <img
          src={imagenes[currentImage] || "/placeholder.svg"}
          alt={`${nombre} - Imagen ${currentImage + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {imagenes.map((imagen, idx) => (
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
  )
}