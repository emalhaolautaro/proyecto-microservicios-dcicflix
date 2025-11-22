// calification-service/index.js
const express = require('express');
const amqp = require('amqplib');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8003;
const RABBIT_HOST = process.env.RABBIT_HOST || 'amqp://admin:admin@rabbitmq:5672';
const QUEUE_NAME = process.env.QUEUE_NAME || 'opiniones_queue';

app.use(cors());
app.use(express.json());

let channel = null;
let connection = null;

// Conectar a RabbitMQ al iniciar (con reconexión)
async function connectRabbit() {
  try {
    console.log(`🔌 Intentando conectar a RabbitMQ en ${RABBIT_HOST}...`);
    connection = await amqp.connect(RABBIT_HOST);

    connection.on('error', (err) => {
      console.error('❌ Error en conexión RabbitMQ:', err && err.message);
    });

    connection.on('close', () => {
      console.warn('⚠️ Conexión a RabbitMQ cerrada. Reintentando en 5s...');
      channel = null;
      connection = null;
      setTimeout(connectRabbit, 5000);
    });

    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log('🐰 Calification Service conectado a RabbitMQ');
    console.log(`📨 Cola: ${QUEUE_NAME}`);
  } catch (error) {
    console.error('❌ Error conectando a RabbitMQ:', error && error.message);
    channel = null;
    connection = null;
    setTimeout(connectRabbit, 5000);
  }
}

// Endpoint para recibir calificaciones
app.post('/calificar', async (req, res) => {
  try {
    // Esperamos que el frontend envíe: user_id, profile_id, profile_name, movie_id, movie_title, score
    const { user_id, profile_id, profile_name, movie_id, movie_title, score } = req.body;

    // Validar datos requeridos
    if (!user_id || !profile_id || !profile_name || !movie_id || !movie_title || (score === undefined || score === null)) {
      return res.status(400).json({
        error: 'Faltan datos requeridos',
        required: ['user_id', 'profile_id', 'profile_name', 'movie_id', 'movie_title', 'score']
      });
    }

    // Validar rango de score (1-10)
    const numericScore = Number(score);
    if (!Number.isFinite(numericScore) || numericScore < 1 || numericScore > 10) {
      return res.status(400).json({
        error: 'La calificación debe ser un número entre 1 y 10'
      });
    }

    // Crear mensaje para RabbitMQ
    const mensaje = {
      user_id,
      profile_id,
      profile_name,
      movie_id,
      movie_title,
      score: numericScore,
      timestamp: new Date().toISOString()
    };

    // Verificar que el canal esté disponible
    if (!channel) {
      console.warn('⚠️ Canal RabbitMQ no disponible al intentar enviar mensaje');
      return res.status(503).json({
        error: 'Servicio de mensajería no disponible. Intenta nuevamente.'
      });
    }

    // Enviar a la cola (persistente)
    channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(mensaje)),
      { persistent: true }
    );

    console.log('📤 Calificación enviada a cola:', mensaje);

    return res.status(200).json({
      success: true,
      message: 'Calificación recibida y enviada a procesamiento',
      data: mensaje
    });

  } catch (error) {
    console.error('❌ Error procesando calificación:', error && error.stack ? error.stack : error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error && error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'calification-service',
    rabbitmq: channel ? 'connected' : 'disconnected'
  });
});

// Iniciar servidor y conectar RabbitMQ
const server = app.listen(PORT, () => {
  console.log(`🚀 Calification Service corriendo en puerto ${PORT}`);
  connectRabbit();
});

// Manejo de cierre graceful
async function shutdown(signal) {
  console.log(`\n🛑 Recibida señal ${signal}. Cerrando Calification Service...`);
  try {
    if (channel) {
      try {
        await channel.close();
        console.log('✅ Canal RabbitMQ cerrado');
      } catch (e) {
        console.warn('⚠️ Error cerrando canal RabbitMQ:', e && e.message);
      }
    }
    if (connection) {
      try {
        await connection.close();
        console.log('✅ Conexión RabbitMQ cerrada');
      } catch (e) {
        console.warn('⚠️ Error cerrando conexión RabbitMQ:', e && e.message);
      }
    }
    if (server) {
      server.close(() => {
        console.log('✅ Servidor Express cerrado');
        process.exit(0);
      });
      // Forzar salida si no cierra en 5s
      setTimeout(() => {
        console.warn('⏱ Forzando exit 1 después de timeout');
        process.exit(1);
      }, 5000).unref();
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('❌ Error durante shutdown:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
