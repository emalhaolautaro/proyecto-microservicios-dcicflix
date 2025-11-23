const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 8000;

// URI de conexión desde variable de entorno
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/movies_db';

let db;

// Conectar a MongoDB
async function connectDB() {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    db = client.db();
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

// Ruta principal
app.get('/', (req, res) => {
  res.json({ message: 'Movies API funcionando correctamente' });
});

// Obtener todas las películas
app.get('/movies', async (req, res) => {
  try {
    const movies = await db.collection('movies').find({}).limit(50).toArray();
    res.json({
      count: movies.length,
      movies: movies
    });
  } catch (error) {
    console.error('Error obteniendo películas:', error);
    res.status(500).json({ error: 'Error obteniendo películas' });
  }
});

// Buscar películas por nombre
app.get('/movies/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const movies = await db.collection('movies').find({
      title: { $regex: searchQuery, $options: 'i' }
    }).limit(20).toArray();
    
    res.json({
      count: movies.length,
      movies: movies
    });
  } catch (error) {
    console.error('Error buscando películas:', error);
    res.status(500).json({ error: 'Error buscando películas' });
  }
});

// Obtener película por ID
app.get('/movies/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!movie) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }
    
    res.json(movie);
  } catch (error) {
    console.error('Error obteniendo película:', error);
    res.status(500).json({ error: 'Error obteniendo película' });
  }
});

// Obtener todos los comentarios
app.get('/comments', async (req, res) => {
  try {
    const comments = await db.collection('comments').find({}).limit(50).toArray();
    res.json({
      count: comments.length,
      comments: comments
    });
  } catch (error) {
    console.error('Error obteniendo comentarios:', error);
    res.status(500).json({ error: 'Error obteniendo comentarios' });
  }
});

// Iniciar servidor
async function startServer() {
  await connectDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

startServer();