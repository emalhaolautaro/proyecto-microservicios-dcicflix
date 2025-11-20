import random
import requests
from fastapi import FastAPI

app = FastAPI()

# URL del servicio Movies dentro de la red de Docker
MOVIES_SERVICE_URL = "http://movies-api:8000/movies"

@app.get("/random")
def get_random_movies():
    try:
        # 1. Pedir todas las películas al servicio Movies
        response = requests.get(MOVIES_SERVICE_URL)
        response.raise_for_status()  # Lanza un error si la petición no fue exitosa
        
        # Extraer la lista de películas de la respuesta JSON
        data = response.json()
        movies = data.get("movies", [])
        
        # 2. Seleccionar algunas al azar (ej. 2 películas)
        if not movies:
            return {"message": "No se encontraron películas."}
            
        if len(movies) < 2:
            return movies  # Si hay pocas, devolvemos todas
        
        return random.sample(movies, 2)
    except requests.exceptions.RequestException as e:
        return {"error": f"No se pudo contactar con el servicio de películas: {str(e)}"}
    except Exception as e:
        return {"error": f"Ocurrió un error inesperado: {str(e)}"}