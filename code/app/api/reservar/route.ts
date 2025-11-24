import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getCabanas, getReservas, saveReserva } from "@/lib/json-db";
import { Reserva, NuevaReservaPayload, Cabana } from "@/lib/types";
import { sendConfirmationEmail } from "./emailService";

/**
 * Manejador GET: Devuelve todas las reservas existentes.
 */
export async function GET(request: Request) {
  console.log("SERVIDOR: --- Petición GET a /api/reservas recibida para listar ---");
  try {
    const reservas: any[] = await getReservas(); // Obtiene todas las reservas del JSON
    
    // Aquí podrías agregar lógica para filtrar (ej. por fechas futuras) o ordenar.
    
    console.log(`SERVIDOR: Devolviendo ${reservas.length} reservas.`);
    return NextResponse.json({ reservas: reservas }, { status: 200 });
  } catch (error) {
    console.error("SERVIDOR: ERROR 500 - Fallo al listar reservas:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al obtener las reservas." },
      { status: 500 }
    );
  }
}


/**
 * Verifica si dos rangos de fechas se superponen.
 * La superposición ocurre si (Nueva entrada < Salida existente) Y (Nueva salida > Entrada existente).
 */
function checkDateOverlap(
  newStart: Date,
  newEnd: Date,
  existingStart: Date,
  existingEnd: Date
): boolean {
  return newStart < existingEnd && newEnd > existingStart;
}


export async function POST(request: Request) {
  try {
    const payload: NuevaReservaPayload =
      (await request.json()) as NuevaReservaPayload;

    const {
      cabana_id,
      fecha_entrada,
      fecha_salida,
      cantidad_personas,
      huesped,
    } = payload;

    if (
      !cabana_id ||
      !fecha_entrada ||
      !fecha_salida ||
      !cantidad_personas ||
      !huesped ||
      !huesped.nombre ||
      !huesped.email
    ) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios en la solicitud." },
        { status: 400 }
      );
    }

    const newStartDate = new Date(fecha_entrada);
    const newEndDate = new Date(fecha_salida);

    if (newStartDate.getTime() >= newEndDate.getTime()) {
      return NextResponse.json(
        {
          message:
            "La fecha de salida debe ser posterior a la fecha de entrada.",
        },
        { status: 400 }
      );
    }
    if (newStartDate.getTime() < new Date().getTime()) {
      return NextResponse.json(
        { message: "No se puede reservar en una fecha pasada." },
        { status: 400 }
      );
    }

    const cabanas: Cabana[] = await getCabanas();
    const reservas: Reserva[] = await getReservas();

    const cabanaSeleccionada = cabanas.find((c) => c.id === cabana_id);

    if (!cabanaSeleccionada) {
      return NextResponse.json(
        { message: `Cabaña con ID ${cabana_id} no encontrada.` },
        { status: 404 }
      );
    }

    if (cantidad_personas > cabanaSeleccionada.capacidad) {
      return NextResponse.json(
        {
          message: `La capacidad máxima para la cabaña ${cabanaSeleccionada.nombre} es de ${cabanaSeleccionada.capacidad} personas.`,
        },
        { status: 400 }
      );
    }

    const reservasExistentesParaCabana = reservas.filter(
      (r) => r.cabana_id === cabana_id && r.estado === "confirmada"
    );

    for (const reserva of reservasExistentesParaCabana) {
      const existingStartDate = new Date(reserva.fecha_entrada);
      const existingEndDate = new Date(reserva.fecha_salida);

      if (
        checkDateOverlap(
          newStartDate,
          newEndDate,
          existingStartDate,
          existingEndDate
        )
      ) {
        return NextResponse.json(
          {
            message:
              "Las fechas seleccionadas se superponen con una reserva existente. Por favor, elige otro rango.",
          },
          { status: 409 }
        );
      }
    }

    const nuevaReserva: Reserva = {
      id: `R_${uuidv4()}`,
      cabana_id: cabana_id,
      huesped: huesped,
      fecha_entrada: fecha_entrada,
      fecha_salida: fecha_salida,
      cantidad_personas: cantidad_personas,
      fecha_creacion: new Date().toISOString(),
      estado: "confirmada",
    };

    await saveReserva(nuevaReserva);
    //TODO: enviar email de confirmacion, falta todo lo relacionado a email
  // 3. ENVÍO DE EMAIL: Llamamos al servicio de email aquí
    let emailExitoso = false;
    try {
        emailExitoso = await sendConfirmationEmail(nuevaReserva);
        if (!emailExitoso) {
            console.warn(`SERVIDOR: La reserva ${nuevaReserva.id} se guardó, pero falló el envío del email de confirmación al huésped.`);
        }
    } catch (emailError) {
        // Capturar cualquier excepción de red o del servicio de email
        console.error(`SERVIDOR: Excepción al intentar enviar email para reserva ${nuevaReserva.id}:`, emailError);
    }
    // Fin de la lógica de email


    // Respuesta exitosa
    return NextResponse.json(
      {
        message: "Reserva creada exitosamente.",
        reserva: nuevaReserva,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error interno en el Route Handler /api/reservar:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al procesar la reserva." },
      { status: 500 }
    );
  }
}
