const amqp = require('amqplib');
const mongoose = require('mongoose');

const RABBIT_HOST = process.env.RABBIT_HOST || 'amqp://admin:admin@rabbitmq:5672';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/opiniones_db'; 
const QUEUE_NAME = process.env.QUEUE_NAME || 'opiniones_queue';

// Esquema actualizado con más información para recomendaciones
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

async function startConsumer() {
    try {
        console.log('🔄 Intentando conectar a MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log("✅ Opiniones Service conectado a MongoDB");

        console.log('🔄 Intentando conectar a RabbitMQ...');
        const connection = await amqp.connect(RABBIT_HOST);
        console.log("✅ Conectado a RabbitMQ");
        
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log(`🐰 Esperando mensajes en la cola: ${QUEUE_NAME}`);

        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                try {
                    const contenido = JSON.parse(msg.content.toString());
                    console.log("📥 Mensaje recibido:", JSON.stringify(contenido, null, 2));

                    // Validar campos requeridos
                    if (!contenido.user_id || !contenido.movie_id || !contenido.score) {
                        console.error("❌ Mensaje inválido - faltan campos requeridos:", contenido);
                        channel.ack(msg); // Ack para sacarlo de la cola
                        return;
                    }

                    // Crear la interacción
                    const nuevaInteraccion = new Interaction({
                        user_id: contenido.user_id,
                        profile_id: contenido.profile_id || contenido.user_id, // Fallback si no viene profile_id
                        profile_name: contenido.profile_name || 'Unknown',
                        movie_id: contenido.movie_id,
                        movie_title: contenido.movie_title || 'Unknown',
                        score: contenido.score,
                        timestamp: contenido.timestamp || new Date()
                    });

                    console.log("💾 Intentando guardar:", nuevaInteraccion);
                    const resultado = await nuevaInteraccion.save();
                    console.log(`✅ GUARDADO EXITOSO en MongoDB con ID: ${resultado._id}`);
                    console.log(`   📊 ${contenido.movie_title} - ${contenido.score} estrellas`);
                    console.log(`   👤 User: ${contenido.user_id} | Profile: ${contenido.profile_name || contenido.profile_id}`);
                    
                    channel.ack(msg);
                } catch (err) {
                    console.error("❌ ERROR COMPLETO guardando en Mongo:");
                    console.error("   Mensaje:", err.message);
                    console.error("   Stack:", err.stack);
                    console.error("   Contenido que intentó guardar:", contenido);
                    // No hacer ack si hay error, para que el mensaje vuelva a la cola
                }
            }
        });

        // Manejo de cierre de conexión
        connection.on('close', () => {
            console.error('⚠️ Conexión a RabbitMQ cerrada. Reintentando en 5s...');
            setTimeout(startConsumer, 5000);
        });

        connection.on('error', (err) => {
            console.error('❌ Error en conexión RabbitMQ:', err.message);
        });

    } catch (error) {
        console.error("❌ Error iniciando Consumidor:", error.message);
        console.log("⏳ Reintentando en 5 segundos...");
        setTimeout(startConsumer, 5000); 
    }
}

// Manejo de señales de cierre
process.on('SIGINT', async () => {
    console.log('\n🛑 Cerrando Opinion Service...');
    await mongoose.connection.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Cerrando Opinion Service...');
    await mongoose.connection.close();
    process.exit(0);
});

startConsumer();