import express from "express";
import Pelicula from "../models/Pelicula.js";

const router = express.Router();

// Obtener todas las películas
router.get("/", async (req, res) => {
  try {
    const peliculas = await Pelicula.find();
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las películas" });
  }
});

// Obtener película por ID
router.get("/:id", async (req, res) => {
  try {
    const pelicula = await Pelicula.findOne({ id: parseInt(req.params.id) });
    if (!pelicula) return res.status(404).json({ error: "Película no encontrada" });
    res.json(pelicula);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la película" });
  }
});

export default router;
