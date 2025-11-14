import { NextResponse } from "next/server";
import { getCabanas } from "@/lib/json-db";
import { Cabana } from "@/lib/types";

export async function GET() {
  try {
    const cabanas: Cabana[] = await getCabanas();

    return NextResponse.json(cabanas, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el catálogo de cabañas:", error);
    return NextResponse.json(
      { message: "No se pudo cargar el catálogo de cabañas." },
      { status: 500 }
    );
  }
}
