import mongoose from "mongoose";

const PeliculaSchema = new mongoose.Schema({
  id: Number,
  title: String,
  year: Number,
  duration: String,
  genre: String,
  director: String,
  description: String,
  videoUrl: String,
  posterUrl: String,
  publicDomainReason: String
});

export default mongoose.model("Pelicula", PeliculaSchema, "peliculas");
