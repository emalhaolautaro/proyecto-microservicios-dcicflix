# Usamos una imagen ligera de Node.js
FROM node:18-alpine

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias para aprovechar el caché de Docker
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Exponemos el puerto que usa este servicio
EXPOSE 8002

# Comando para iniciar la aplicación
CMD ["npm", "start"]