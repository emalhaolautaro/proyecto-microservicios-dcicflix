const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 8004;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/opiniones_db';

// Esquema de Interacciones (debe coincidir con opinion-service)
const InteractionSchema = new mongoose.Schema({
    user_id: { type: String, required: true, index: true },
    profile_id: { type: String, required: true, index: true },
    profile_name: { type: String },
    movie_id: { type: String, required: true, index: true },
    movie_title: String,
    score: { type: Number, required: true, min: 1, max: 10 },
    timestamp: { type: Date, default: Date.now, index: true }
});

const Interaction = mongoose.model('Interaction', InteractionSchema);

// Conectar a MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Ratings Service conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

// Ruta principal
app.get('/', (req, res) => {
  res.json({ message: 'Ratings API funcionando correctamente' });
});

// Obtener calificaciones por email de usuario
app.get('/ratings/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const ratings = await Interaction.find({ user_id: email })
      .sort({ timestamp: -1 })
      .lean();
    
    res.json({
      count: ratings.length,
      ratings: ratings
    });
  } catch (error) {
    console.error('Error obteniendo calificaciones por usuario:', error);
    res.status(500).json({ error: 'Error obteniendo calificaciones' });
  }
});

// Obtener calificaciones por email y nombre de perfil
app.get('/ratings/user/:email/profile/:profileName', async (req, res) => {
  try {
    const { email, profileName } = req.params;
    const ratings = await Interaction.find({ 
      user_id: email,
      profile_name: profileName 
    })
      .sort({ timestamp: -1 })
      .lean();
    
    res.json({
      count: ratings.length,
      ratings: ratings
    });
  } catch (error) {
    console.error('Error obteniendo calificaciones por perfil:', error);
    res.status(500).json({ error: 'Error obteniendo calificaciones' });
  }
});

// Obtener calificaciones por profile_id
app.get('/ratings/profile/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const ratings = await Interaction.find({ profile_id: profileId })
      .sort({ timestamp: -1 })
      .lean();
    
    res.json({
      count: ratings.length,
      ratings: ratings
    });
  } catch (error) {
    console.error('Error obteniendo calificaciones por profile_id:', error);
    res.status(500).json({ error: 'Error obteniendo calificaciones' });
  }
});

// Obtener todas las calificaciones (con límite)
app.get('/ratings', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const ratings = await Interaction.find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    
    res.json({
      count: ratings.length,
      ratings: ratings
    });
  } catch (error) {
    console.error('Error obteniendo todas las calificaciones:', error);
    res.status(500).json({ error: 'Error obteniendo calificaciones' });
  }
});

// Obtener estadísticas de un usuario
app.get('/ratings/stats/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const stats = await Interaction.aggregate([
      { $match: { user_id: email } },
      {
        $group: {
          _id: null,
          totalRatings: { $sum: 1 },
          averageScore: { $avg: '$score' },
          minScore: { $min: '$score' },
          maxScore: { $max: '$score' }
        }
      }
    ]);
    
    if (stats.length === 0) {
      return res.json({
        totalRatings: 0,
        averageScore: 0,
        minScore: 0,
        maxScore: 0
      });
    }
    
    res.json(stats[0]);
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
});

// Iniciar servidor
async function startServer() {
  await connectDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Ratings Service corriendo en http://localhost:${PORT}`);
  });
}

// Manejo de cierre
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando Ratings Service...');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();
