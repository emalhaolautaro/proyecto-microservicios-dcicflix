const mongoose = require('mongoose');

// Esquema de una película en la lista (Simple, solo guardamos ID y fecha)
const MovieRefSchema = new mongoose.Schema({
  movieId: { type: String, required: true }, // ID que viene de movies-api
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

// Esquema del PERFIL (Sub-entidad)
const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: "https://default-avatar.com/img.png" },
  isKid: { type: Boolean, default: false },
  
  // AQUÍ va la magia: Listas propias de cada perfil
  myList: [MovieRefSchema],      // "Mi Lista"
  history: [MovieRefSchema],     // Historial de visualización
  likes: [String]                // IDs de pelis que le dio Like
});

// Esquema PRINCIPAL (Cuenta)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  profiles: [ProfileSchema] // Array de perfiles
});

module.exports = mongoose.model('User', UserSchema);