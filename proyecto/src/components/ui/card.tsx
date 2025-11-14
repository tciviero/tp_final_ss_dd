// app/components/ui/card.tsx
import React from "react";

// Props para Card
interface CardProps {
  children: React.ReactNode;
  className?: string; // Permite clases personalizadas en Card
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={`border p-4 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

// Props para CardContent, también acepta className
interface CardContentProps {
  children: React.ReactNode;
  className?: string; // Permite clases personalizadas en CardContent
}

const CardContent = ({ children, className }: CardContentProps) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

// Props para CardHeader, también acepta className
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string; // Permite clases personalizadas en CardHeader
}

const CardHeader = ({ children, className }: CardHeaderProps) => {
  return <div className={`p-4 border-b ${className}`}>{children}</div>;
};

// Props para CardFooter, también acepta className
interface CardFooterProps {
  children: React.ReactNode;
  className?: string; // Permite clases personalizadas en CardFooter
}

const CardFooter = ({ children, className }: CardFooterProps) => {
  return <div className={`p-4 border-t ${className}`}>{children}</div>;
};

// **Nuevo componente CardTitle**
interface CardTitleProps {
  children: React.ReactNode;
  className?: string; // Permite clases personalizadas en CardTitle
}

const CardTitle = ({ children, className }: CardTitleProps) => {
  return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
};

export { Card, CardContent, CardHeader, CardFooter, CardTitle };
