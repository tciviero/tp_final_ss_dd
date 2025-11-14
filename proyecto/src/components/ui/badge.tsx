// app/components/ui/badge.tsx
import React from "react";

// Definir los valores permitidos para el `variant`
type BadgeVariant = "secondary" | "outline"; 

// Props para Badge
interface BadgeProps {
  children: React.ReactNode;
  className?: string; // Permite clases personalizadas
  variant?: BadgeVariant; // Permite elegir el estilo del badge
}

const Badge = ({ children, className, variant = "secondary" }: BadgeProps) => {
  // Estilos por defecto y clases adicionales dependiendo del `variant`
  const variantClasses = {
    secondary: "bg-blue-500 text-white",
    outline: "border border-blue-500 text-blue-500 bg-transparent",
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export { Badge };
