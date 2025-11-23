import requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

app = FastAPI()

# URL del servicio Movies dentro de la red de Docker
MOVIES_SERVICE_URL = "http://movies-api:8000"

@app.get("/search/{query}")
def search_movies(query: str):
    """
    Busca películas por nombre actuando como intermediario
    entre el frontend y el servicio movies-api
    """
    try:
        # Llamar al endpoint de búsqueda del movies-api
        response = requests.get(f"{MOVIES_SERVICE_URL}/movies/search/{query}")
        response.raise_for_status()
        
        # Obtener los datos
        data = response.json()
        movies = data.get("movies", [])
        
        # Retornar los resultados
        return {
            "query": query,
            "count": len(movies),
            "movies": movies
        }
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"No se pudo contactar con el servicio de películas: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ocurrió un error inesperado: {str(e)}"
        )

@app.get("/")
def root():
    return {"message": "Search Movies Service funcionando correctamente"}
