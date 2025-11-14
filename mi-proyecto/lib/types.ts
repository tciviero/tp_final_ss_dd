/**
 * Interface que define la estructura de una Cabaña
 * (Basado en el archivo cabanas.json)
 */
export interface Cabana {
  id: string; // Ejemplo: "C001"
  nombre: string;
  descripcion: string;
  capacidad_maxima: number;
  precio_por_noche: number;
  servicios: string[]; // Lista de servicios ofrecidos
  fotografias: string[]; // URLs o rutas a las imágenes
}

/**
 * Interface que define la estructura de los datos del Huesped
 */
export interface Huesped {
  nombre: string;
  email: string;
  telefono: string;
}

/**
 * Interface que define la estructura de una Reserva
 * (Basado en el archivo reservas.json)
 */
export interface Reserva {
  id: string; // ID único de la reserva (ej. R_XYZ789)
  cabana_id: string; // ID de la cabaña reservada
  huesped: Huesped;
  fecha_entrada: string; // Formato YYYY-MM-DD
  fecha_salida: string; // Formato YYYY-MM-DD
  cantidad_personas: number;
  fecha_creacion: string; // Marca de tiempo (ISO 8601)
  estado: "confirmada" | "pendiente" | "cancelada"; // Control de estado
}

/**
 * Interface para el objeto que se recibe desde el formulario de reserva (POST request)
 * Es ligeramente diferente a Reserva porque no incluye 'id', 'fecha_creacion' ni 'estado'
 */
export interface NuevaReservaPayload {
  cabana_id: string;
  huesped: Huesped;
  fecha_entrada: string;
  fecha_salida: string;
  cantidad_personas: number;
}
