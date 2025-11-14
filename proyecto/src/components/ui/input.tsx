// app/components/ui/input.tsx
import React from "react";

// Props para Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string; // Permite pasar un id para el input
  className?: string; // Clases personalizadas para el input
}

const Input = ({ id, className, ...props }: InputProps) => {
  return (
    <input
      id={id}
      className={`px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props} // Pasa todas las demás propiedades (min, max, value, etc.)
    />
  );
};

export { Input };
