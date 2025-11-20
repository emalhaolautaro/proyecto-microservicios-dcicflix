import random
import requests
from fastapi import FastAPI

app = FastAPI()

# URL del servicio Movies dentro de la red de Docker
MOVIES_SERVICE_URL = "http://movies-service:8000/movies"

@app.get("/random")
def get_random_movies():
    try:
        # 1. Pedir todas las películas al servicio Movies
        response = requests.get(MOVIES_SERVICE_URL)
        movies = response.json()
        
        # 2. Seleccionar algunas al azar (ej. 2 películas)
        if len(movies) < 2:
            return movies # Si hay pocas, devolvemos todas
        
        return random.sample(movies, 2)
    except Exception as e:
        return {"error": f"No se pudo contactar con el servicio de películas: {str(e)}"}