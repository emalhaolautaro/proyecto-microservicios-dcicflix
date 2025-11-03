import express from "express";
import mongoose from "mongoose";
import peliculasRouter from "./routes/peliculas.js";

const app = express();
app.use(express.json());

// Conexión a MongoDB
mongoose.connect("mongodb://root:example@mongo:27017/peliculasDB?authSource=admin")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error de conexión:", err));

// Rutas
app.use("/peliculas", peliculasRouter);

// Puerto
const PORT = 3001;
app.listen(PORT, () => console.log(`🎬 API de películas corriendo en el puerto ${PORT}`));
