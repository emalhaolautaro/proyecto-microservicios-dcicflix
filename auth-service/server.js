const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const PORT = 8002;
const JWT_SECRET = 'secreto_super_seguro_para_la_facultad'; // En prod esto va en .env

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/auth_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🔥 Auth Service conectado a MongoDB'))
  .catch(err => console.error('Error conectando a Mongo:', err));

// 1. REGISTRO (Crea usuario + Perfil inicial)
app.post('/register', async (req, res) => {
  try {
    const { email, password, profileName } = req.body;

    // Validar si existe
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "El usuario ya existe" });

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con un perfil inicial
    const initialProfileName = profileName || "Unnamed";
    const newUser = new User({
      email,
      password: hashedPassword,
      profiles: [{
        name: initialProfileName,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${initialProfileName}`,
        isKid: false
      }]
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario creado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. LOGIN (Devuelve Token + Lista de Perfiles)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar Token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

    // Devolvemos el token y los perfiles para que el frontend muestre el selector
    res.json({
      token,
      user: {
        email: user.email,
        profiles: user.profiles
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. AGREGAR UN NUEVO PERFIL
app.post('/profiles', async (req, res) => {
  try {
    const { token, name, avatar, isKid } = req.body; // En un caso real, el token va en headers

    if (!token) return res.status(401).json({ message: "No autorizado" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Validar límite de perfiles (Máximo 4)
    if (user.profiles.length >= 4) {
      return res.status(400).json({ message: "Límite de perfiles alcanzado (Máximo 4)" });
    }

    // Push del nuevo perfil al array
    user.profiles.push({
      name,
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      isKid: isKid || false
    });

    await user.save();
    res.json({ profiles: user.profiles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. ACTUALIZAR PERFIL (PUT)
app.put('/profiles/:profileId', async (req, res) => {
  try {
    console.log(`PUT /profiles/${req.params.profileId}`, req.body);
    const { token, name, isKid } = req.body;
    const { profileId } = req.params;

    if (!token) return res.status(401).json({ message: "No autorizado" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const profile = user.profiles.id(profileId);
    if (!profile) return res.status(404).json({ message: "Perfil no encontrado" });

    // Validar nombre único (excluyendo el perfil actual)
    if (name) {
      const nameExists = user.profiles.some(p => p.name.toLowerCase() === name.toLowerCase() && p._id.toString() !== profileId);
      if (nameExists) {
        return res.status(400).json({ message: "Ya existe un perfil con ese nombre" });
      }
      profile.name = name;
    }

    if (typeof isKid === 'boolean') {
      profile.isKid = isKid;
    }

    await user.save();
    res.json({ profiles: user.profiles });

  } catch (error) {
    console.error("PUT Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 5. ELIMINAR PERFIL (DELETE)
app.delete('/profiles/:profileId', async (req, res) => {
  try {
    console.log(`DELETE /profiles/${req.params.profileId}`, req.body, req.query);
    const token = req.body.token || req.query.token;
    const { profileId } = req.params;

    if (!token) return res.status(401).json({ message: "No autorizado" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const profile = user.profiles.id(profileId);
    if (!profile) return res.status(404).json({ message: "Perfil no encontrado" });

    // Opcional: Impedir borrar el último perfil
    if (user.profiles.length <= 1) {
      return res.status(400).json({ message: "No puedes eliminar el último perfil" });
    }

    user.profiles.pull(profileId);

    await user.save();
    res.json({ profiles: user.profiles });

  } catch (error) {
    console.error("DELETE Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Auth Service corriendo en el puerto ${PORT}`);
});
