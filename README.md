# 🎬 DCICFlix - Plataforma de Streaming basada en Microservicios

**DCICFlix** es una plataforma de streaming de películas diseñada con una arquitectura de **microservicios**, utilizando tecnologías modernas para el desarrollo web, orquestación de contenedores y procesamiento de datos. Este proyecto demuestra la implementación de sistemas distribuidos, comunicación asíncrona y servicios especializados.

---

## 🚀 Tecnologías Principales

El proyecto utiliza un stack tecnológico diverso y robusto:

### 🎨 Frontend
- **React** (v19) con **Vite**: Para una interfaz de usuario rápida y reactiva.
- **TailwindCSS**: Framework de utilidades para un diseño moderno y responsive.
- **React Router**: Manejo de navegación SPA.

### ⚙️ Backend & Microservicios
- **Node.js & Express**: Base para la mayoría de los servicios RESTful (`movies-api`, `auth-service`, `calification-service`, `ratings-service`).
- **Python & FastAPI**: Utilizado para servicios de alto rendimiento y lógica de datos/ML (`random-movies-service`, `search-movies-service`, `recommendation-service`).
- **RabbitMQ**: Broker de mensajería para la comunicación asíncrona entre servicios (ej. procesamiento de calificaciones).

### 💾 Base de Datos & Almacenamiento
- **MongoDB**: Base de datos NoSQL principal, con instancias separadas para autenticación, películas y opiniones para garantizar el desacoplamiento.

### 🤖 Inteligencia Artificial & Datos
- **Pandas, NumPy & Scikit-learn**: Implementados en el servicio de recomendaciones para ofrecer contenido personalizado a los usuarios.

### 🐳 DevOps & Infraestructura
- **Docker & Docker Compose**: Contenerización de todos los servicios y orquestación para un despliegue sencillo y reproducible.

---

## 🏗️ Arquitectura del Sistema

El sistema está compuesto por múltiples contenedores que interactúan entre sí:

| Servicio | Puerto | Descripción | Tecnologías |
|----------|--------|-------------|-------------|
| **Frontend** | `3000` | Interfaz de usuario principal. | React, Vite |
| **Movies API** | `8000` | API central para gestión de películas. | Node.js, Express |
| **Auth Service** | `8002` | Gestión de usuarios, autenticación (JWT) y perfiles. | Node.js, Express |
| **Random Movies** | `8001` | Provee sugerencias de películas aleatorias. | Python, FastAPI |
| **Search Service** | `8005` | Motor de búsqueda de películas. | Python, FastAPI |
| **Recommendation** | `8006` | Sistema de recomendación basado en ML. | Python, FastAPI, Sklearn |
| **Calification** | `8003` | Recibe calificaciones y las envía a la cola. | Node.js, RabbitMQ |
| **Opinion** | N/A | Worker que consume de RabbitMQ y guarda en DB. | Node.js, RabbitMQ |
| **Ratings** | `8004` | Consulta de calificaciones históricas. | Node.js, Express |

### 🔄 Flujo de Datos (Ejemplo: Calificaciones)
1. El usuario califica una película en el **Frontend**.
2. La petición va al **Calification Service**.
3. Este servicio publica un mensaje en **RabbitMQ**.
4. El **Opinion Service** consume el mensaje y guarda la calificación en **MongoDB**.
5. El **Ratings Service** puede consultar estas calificaciones posteriormente.

---

## 🛠️ Instalación y Ejecución

### Prerrequisitos
- **Docker Desktop** instalado y corriendo.
- **Git** para clonar el repositorio.

### Pasos para correr el proyecto

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd proyecto-microservicios-dcicflix
   ```

2. **Ejecutar con Docker Compose**
   Este comando construirá las imágenes e iniciará todos los servicios.
   ```bash
   docker-compose up --build
   ```
   *Nota: La primera vez puede tardar unos minutos mientras se descargan las imágenes y se instalan las dependencias.*

3. **Acceder a la aplicación**
   Una vez que todos los contenedores estén arriba, abre tu navegador en:
   👉 **http://localhost:3000**

---

## 📂 Estructura del Proyecto

```plaintext
proyecto-microservicios-dcicflix/
├── auth-service/           # Servicio de Autenticación (Node.js)
├── calification-service/   # Productor de Calificaciones (Node.js)
├── frontend/               # Aplicación Web (React + Vite)
├── movies-api/             # API Core de Películas (Node.js)
├── opinion-service/        # Consumidor de Opiniones (Node.js)
├── random-movies-service/  # Servicio de Películas Aleatorias (Python)
├── ratings-service/        # Servicio de Lectura de Ratings (Node.js)
├── recommendation-service/ # Motor de Recomendaciones ML (Python)
├── search-movies-service/  # Servicio de Búsqueda (Python)
└── docker-compose.yml      # Orquestación de contenedores
```

## 📝 Notas Adicionales
- El proyecto incluye un contenedor `mongo-seed` que puebla automáticamente la base de datos con películas y comentarios de prueba al iniciar.
- Cada microservicio tiene su propio `Dockerfile` y gestión de dependencias (`package.json` o `requirements.txt`), asegurando aislamiento total.

---
*Desarrollado para la asignatura Tópicos de Desarrollo WEB.*
