db = db.getSiblingDB('peliculasDB'); // crea/usa la base 'peliculasDB'

db.peliculas.drop(); // borra la colección si ya existía

const fs = require('fs');
const path = '/docker-entrypoint-initdb.d/peliculas.json'; // ruta dentro del contenedor
const data = fs.readFileSync(path, 'utf8');
const peliculas = JSON.parse(data);

db.peliculas.insertMany(peliculas);

print('✅ Base de datos inicializada con películas.');