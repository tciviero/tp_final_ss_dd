// app/components/ui/button.tsx
import React from "react";

// Definimos las opciones para el tamaño del botón
type ButtonSize = "sm" | "md" | "lg";

// Definimos las opciones para el tipo de botón (variant)
type ButtonVariant = "primary" | "secondary" | "outline";

// Props para Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize; // Tamaño del botón (sm, md, lg)
  variant?: ButtonVariant; // Estilo del botón (primary, secondary, outline)
  className?: string; // Clases personalizadas para el botón
}

const Button = ({ size = "md", variant = "primary", className, children, ...props }: ButtonProps) => {
  // Definir las clases para el tamaño del botón
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Definir las clases para el estilo (variant) del botón
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500",
    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500",
  };

  return (
    <button
      {...props} // Pasa todas las demás propiedades, incluyendo 'type', 'onClick', etc.
      className={`rounded-md shadow-md focus:outline-none focus:ring-2 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export { Button };
