import { NextResponse } from "next/server";
import { getCabanaById } from "@/lib/json-db";
import { Cabana } from "@/lib/types";

export async function GET(_req: Request,{ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const cabana: Cabana | null = await getCabanaById(id);  

    return NextResponse.json(cabana, { status: 200 });
  } catch (error) {
    console.error("Error al obtener la información de la cabaña.", error);
    return NextResponse.json(
      { message: "Error al obtener la información de la cabaña." },
      { status: 500 }
    );
  }
}
