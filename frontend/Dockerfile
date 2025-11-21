# Usamos una imagen ligera de Node
FROM node:22-alpine

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de definición de paquetes primero (para aprovechar el caché)
COPY package.json package-lock.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Exponemos el puerto estándar de Vite
EXPOSE 3000

# Iniciamos la aplicación
# IMPORTANTE: '--host' es necesario para acceder desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]