import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getCabanas, getReservas, saveReserva } from "@/lib/json-db";
import { Reserva, NuevaReservaPayload, Cabana } from "@/lib/types";
import { sendConfirmationEmail } from "./emailService";

/**
 * Manejador GET: Devuelve las reservas filtradas por user_id
 */
export async function GET(request: Request) {
  console.log("SERVIDOR: --- Petición GET a /api/reservar recibida para listar ---");
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    const reservas: Reserva[] = await getReservas();
    
    // Si hay user_id en la query, filtrar solo las reservas de ese usuario
    const reservasFiltradas = userId 
      ? reservas.filter(r => r.user_id === userId)
      : reservas; // Si no hay user_id, devolver todas (para admin)
    
    console.log(`SERVIDOR: Devolviendo ${reservasFiltradas.length} reservas para user_id: ${userId || 'todos'}`);
    return NextResponse.json({ reservas: reservasFiltradas }, { status: 200 });
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
      user_id,
      fecha_entrada,
      fecha_salida,
      cantidad_personas,
      huesped,
    } = payload;

    // Validación: ahora incluimos user_id
    if (
      !cabana_id ||
      !user_id ||
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

    // Verificar conflictos de fechas (todas las reservas confirmadas, no solo del usuario)
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
      user_id: user_id, // Guardamos el user_id
      huesped: huesped,
      fecha_entrada: fecha_entrada,
      fecha_salida: fecha_salida,
      cantidad_personas: cantidad_personas,
      fecha_creacion: new Date().toISOString(),
      estado: "confirmada",
    };

    await saveReserva(nuevaReserva);
    
    // Envío de email
    let emailExitoso = false;
    try {
        emailExitoso = await sendConfirmationEmail(nuevaReserva);
        if (!emailExitoso) {
            console.warn(`SERVIDOR: La reserva ${nuevaReserva.id} se guardó, pero falló el envío del email.`);
        }
    } catch (emailError) {
        console.error(`SERVIDOR: Excepción al intentar enviar email para reserva ${nuevaReserva.id}:`, emailError);
    }

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