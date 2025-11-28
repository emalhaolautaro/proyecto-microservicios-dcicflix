import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# URL del servicio Movies dentro de la red de Docker
MOVIES_SERVICE_URL = "http://movies-api:8000"

@app.get("/search/{query}")
def search_movies(query: str):
    """
    Busca películas por nombre actuando como intermediario
    entre el frontend y el servicio movies-api.
    Elimina duplicados basándose en el título normalizado.
    """
    try:
        # Llamar al endpoint de búsqueda del movies-api
        response = requests.get(f"{MOVIES_SERVICE_URL}/movies/search/{query}")
        response.raise_for_status()
        
        # Obtener los datos
        data = response.json()
        movies = data.get("movies", [])
        
        # Eliminar duplicados basándose en título normalizado
        unique_movies = []
        seen_titles = set()
        
        for movie in movies:
            # Normalizar título: minúsculas y sin espacios
            title = movie.get("title", "")
            normalized_title = title.lower().replace(" ", "")
            
            # Solo agregar si no hemos visto este título normalizado antes
            if normalized_title not in seen_titles and normalized_title:
                seen_titles.add(normalized_title)
                unique_movies.append(movie)
        
        # Retornar los resultados sin duplicados
        return {
            "query": query,
            "count": len(unique_movies),
            "movies": unique_movies
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
