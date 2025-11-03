// /app/api/movies/route.ts
import { NextResponse } from "next/server"
import { getAllMovies } from "@/data/movies" // tu módulo de acceso a MongoDB

export async function GET() {
  try {
    const movies = await getAllMovies()
    return NextResponse.json(movies)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "No se pudieron obtener las películas" }, { status: 500 })
  }
}