import random
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS (Buenas prácticas para microservicios)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# URL del servicio Movies dentro de la red de Docker
MOVIES_SERVICE_URL = "http://movies-api:8000/movies"

@app.get("/random")
def get_random_movies(lang: str = None):
    try:
        print(f"🎲 Consultando catálogo completo en: {MOVIES_SERVICE_URL} con filtro lang={lang}")
        
        # 1. Pedir todas las películas al servicio Movies
        params = {}
        if lang:
            params['lang'] = lang
            
        response = requests.get(MOVIES_SERVICE_URL, params=params, timeout=10)
        response.raise_for_status()
        
        # Extraer la lista de películas de la respuesta JSON
        # Manejamos ambos casos: si devuelve lista directa o dict con key "movies"
        data = response.json()
        movies = data.get("movies", []) if isinstance(data, dict) else data
        
        if not movies:
            return []
            
        print(f"📚 Catálogo recibido: {len(movies)} películas.")

        # 2. ESTRATEGIA DE POOL ALEATORIO (Doble Randomización)
        
        # Paso A: Mezclar la lista completa para romper el orden por defecto de Mongo
        random.shuffle(movies)
        
        # Paso B: Crear un "Pool de Candidatos" (ej: 50 películas)
        # Esto asegura que seleccionamos de un grupo variado, no siempre del principio
        pool_size = min(len(movies), 50)
        pool = movies[:pool_size]
        
        # Paso C: Muestreo final del Pool
        # Elegimos 12 películas (divisible por 2, 3, 4 para que la grilla del frontend quede bonita)
        sample_size = min(len(pool), 12)
        final_selection = random.sample(pool, sample_size)
        
        print(f"✅ Retornando {len(final_selection)} películas aleatorias.")
        return final_selection

    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión con Movies API: {e}")
        # Devolvemos lista vacía o error controlado para no romper el frontend
        return {"error": f"Servicio de películas no disponible: {str(e)}"}
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return {"error": f"Ocurrió un error interno: {str(e)}"}

@app.get("/")
def root():
    return {"service": "Random Movies Service", "status": "active"}