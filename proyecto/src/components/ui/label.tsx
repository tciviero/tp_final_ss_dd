// app/components/ui/label.tsx
import React from "react";

// Props para Label
interface LabelProps {
  htmlFor: string; // Asegura que el label esté asociado con un input específico
  children: React.ReactNode; // Contenido de la etiqueta
  className?: string; // Clases personalizadas para el label
}

const Label = ({ htmlFor, children, className }: LabelProps) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  );
};

export { Label };
