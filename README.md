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

```
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

## 🤖 Funcionamiento del Recomendador
El microservicio de recomendación de DCICFLIX inicia su ejecución recibiendo como parámetros el identificador de la cuenta (email) y el perfil activo. A continuación, establece conexión con la capa de persistencia (MongoDB) para extraer el catálogo completo de movies_db y el historial de interacciones de opiniones_db. 

Antes de comenzar, vale aclarar que para este sistema, el término "Vecino" refiere a dos usuarios que calificaron la misma película de forma similar (misma calificación o con 1 punto de diferencia). Una vez que estos usuarios califican similarmente 5 películas, se los considera como vecinos y se asume que tienen gustos similares.

Estos datos crudos son transformados en DataFrames de Pandas, generando tres estructuras clave en memoria:
- Matriz de Contenido: Metadatos de cada película (Géneros, Director, Trama).
- Historial del Usuario Objetivo: El subconjunto de películas ya vistas y calificadas por el perfil actual.
- Matriz de Interacciones Globales: El registro histórico del resto de la comunidad, fundamental para el filtrado colaborativo.

Una vez estructurados los datos, el sistema no aplica una fórmula estática, sino que evalúa la densidad de datos del usuario para seleccionar la estrategia óptima.
- Cold Start: el sistema ve que el usuario tiene menos de 10 calificaciones, por lo que decide recomendar películas mejor calificadas en IMDB.
- Lobo Solitario (o Contenido Puro): el sistema tiene más de 10 películas para poder tomar mejores decisiones, pero carece de opiniones sociales (sea porque el usuario calificó menos de 30 películas o no existen vecinos). Para recomendar, toma en cuenta los directores, el género y el plot de las películas para construir el perfil del usuario. Luego busca en la lista de todas las películas aquellas que el usuario no vio y calcula de la siguiente forma:
      - Géneros: calcula la intersección entre los géneros de la película y los que le gustan al usuario y lo divide por el largo de la lista de géneros preferidos por el usuario. El coeficiente resultante es el puntaje de esta columna.
      - Director: si alguno de los directores que ve el usuario aparece en la película, el score es 1, de lo contrario es 0.
      - Plot: primero crea un texto gigante con los plot de todas las películas calificadas con 8 o más puntos. Vectoriza las palabras y le quita peso a aquellas palabras comunes en el idioma inglés y le suma más peso a las palabras más exóticas o no tan comunes. Luego, aplica la función de similitud de coseno para determinar si la película a recomendar es similar a los gustos del usuario. Si hablan de cosas similares, va a devolver un resultado mayor a si tratan de cosas diferentes.
      - Score quality: es el score de IMDB de las películas normalizado.
   
   Una vez calculados esos valores, primero se calcula el "Content Score" como la suma de genero*0.3 + director*0.2 + plot*0.5. Como encontrar patrones en el procesamiento de lenguaje natural es mucho más complicado que encontrar géneros y directores similares, se le da más peso en la decisión final. 
- Modo Social: El sistema busca vecinos y filtra las películas que vieron para obtener solo las que tienen calificación de 6 o más puntos. Si varios vecinos vieron la misma película candidata, se calcula el promedio de sus notas. Luego, se normaliza la puntuación para que quede entre 0 y 1. Si no hay vecinos suficientes (menos de 30 calificaciones o sin coincidencias), este score se queda en 0.0 y el sistema confía más en el contenido (género/trama).

Luego, si hay al menos un vecino, el cálculo que se realiza es: social_score*0.8+content_score*0.15+score_quality*0.05. El sistema está pensado para que las opiniones de los demás usuarios se tengan muy en cuenta. Por otro lado, el modo lobo solitario tiene social_score*0.0 + content_score*0.7 + score_quality*0.3, priorizando los gustos del usuario.

Para generar la sensación de dinamismo, el sistema recolecta las mejores 50 películas de la tabla final y se queda con 12 de manera aleatoria. Así, en cada petición siempre aparecen películas diferentes dentro de las mejores seleccionadas.

El sistema genera una columna llamada match_reason, que sirve para que el frontend pueda mostrarle al usuario por qué se eligió recomendar una película. Las condiciones para cada etiqueta son:
El sistema evalúa las condiciones en el siguiente orden y asigna la primera que se cumpla:
- "Tu comunidad la recomienda" (Prioridad 1). Condición: score_social > 0.7. Motivo: Validación social fuerte. Los usuarios con gustos similares ("vecinos") calificaron la película muy positivamente.

- "De tu director favorito" (Prioridad 2). Condición: score_director > 0. Motivo: Afinidad de autor. La película es dirigida por alguien que figura en el Top 3 histórico del usuario.

- "Trama similar a lo que ves" (Prioridad 3). Condición: score_plot > 0.15. Motivo: Similitud semántica (NLP). El análisis TF-IDF detectó una coincidencia significativa entre la sinopsis y las películas que el usuario "amó".

- "De tus géneros top" (Prioridad 4). Condición: score_genre > 0.5. Motivo: Coincidencia de contenido estándar. La película comparte más del 50% de sus géneros con los favoritos del usuario.

- Etiqueta por Defecto: Si ninguna condición específica se cumple, se asigna una etiqueta contextual según el modo activo:
   - Modo Cold Start: "Tendencia Global" (Indica que la sugerencia se basa exclusivamente en la calidad general (IMDb) y la popularidad, ya que el sistema aún no tiene suficientes datos para personalizar).
   - Modo Híbrido: "Basado en Tu Comunidad" (Mezcla balanceada de factores).
   - Modo Lobo Solitario: "Basado en Tus Gustos" (Inferencia general de contenido).
---
*Desarrollado para la asignatura Tópicos de Desarrollo WEB.*