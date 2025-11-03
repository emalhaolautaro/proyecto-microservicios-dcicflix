import { NextResponse } from "next/server"
import { getMovieById } from "@/data/movies"

interface Params {
  id: string
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const movie = await getMovieById(Number(params.id))
    if (!movie) return NextResponse.json({ error: "No encontrada" }, { status: 404 })
    return NextResponse.json(movie)
  } catch {
    return NextResponse.json({ error: "Error al buscar la película" }, { status: 500 })
  }
}