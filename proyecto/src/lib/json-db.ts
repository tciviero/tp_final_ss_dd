import * as fs from "fs/promises";
import * as path from "path";
import { Cabana, Reserva } from "./types";

// Rutas a los archivos JSON (Next.js server-side)
// Usa process.cwd() para asegurar que la ruta es correcta desde la raíz del proyecto.
const CABANAS_FILE = path.join(process.cwd(), "data", "cabanas.json");
const RESERVAS_FILE = path.join(process.cwd(), "data", "reservas.json");

/**
 * Lee el archivo de cabañas y afirma su tipo como Cabana[].
 * @returns {Promise<Cabana[]>} El catálogo de cabañas tipado.
 */
export async function getCabanas(): Promise<Cabana[]> {
  try {
    const data = await fs.readFile(CABANAS_FILE, "utf-8");
    // Afirmamos que el JSON parseado coincide con el tipo Cabana[].
    // Esto "engaña" a TypeScript para que confíe en la estructura del archivo.
    return JSON.parse(data) as Cabana[];
  } catch (error) {
    console.error("Error al leer cabanas.json:", error);
    // En un caso de fallo, devolvemos un array vacío tipado.
    return [];
  }
}

/**
 * Lee el archivo de reservas y afirma su tipo como Reserva[].
 * @returns {Promise<Reserva[]>} El listado de reservas tipado.
 */
export async function getReservas(): Promise<Reserva[]> {
  try {
    const data = await fs.readFile(RESERVAS_FILE, "utf-8");
    // Afirmamos que el JSON parseado coincide con el tipo Reserva[].
    return JSON.parse(data) as Reserva[];
  } catch (error) {
    console.error("Error al leer reservas.json:", error);
    return [];
  }
}

/**
 * Añade una nueva reserva al registro y reescribe el archivo JSON.
 * @param {Reserva} nuevaReserva La nueva reserva, ya completamente tipada.
 * @returns {Promise<void>}
 */
export async function saveReserva(nuevaReserva: Reserva): Promise<void> {
  // 1. Obtenemos todas las reservas existentes (función tipada)
  const reservas = await getReservas();

  // 2. Agregamos la nueva reserva tipada al array existente
  reservas.push(nuevaReserva);

  try {
    // 3. Escribimos el array completo de vuelta al archivo con formato (indentación 2).
    await fs.writeFile(RESERVAS_FILE, JSON.stringify(reservas, null, 2));
  } catch (error) {
    console.error("Error al escribir reservas.json:", error);
    throw new Error(
      'No se pudo guardar la reserva en la "base de datos" JSON.'
    );
  }
}
