/**
 * Interface que define la estructura de una Cabaña
 *
 */
export interface Cabana {
  id: string;
  nombre: string;
  descripcion: string;
  capacidad: number;
  precio: number;
  servicios: string[];
  imagenes: string[];
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
 *
 */
export interface Reserva {
  id: string;
  cabana_id: string;
  user_id: string;
  huesped: Huesped;
  fecha_entrada: string;
  fecha_salida: string;
  cantidad_personas: number;
  fecha_creacion: string;
  estado: "confirmada" | "pendiente" | "cancelada";
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
