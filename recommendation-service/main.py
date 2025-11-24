# -*- coding: utf-8 -*-
"""Sistema de Recomendación - Microservicio FastAPI"""

import pandas as pd
import numpy as np
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from pymongo import MongoClient
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
import json
import os
import warnings
warnings.filterwarnings('ignore')

# Configuración FastAPI
app = FastAPI()

# Configuración MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongodb:27017")
MONGO_DB = "movies_db"
MONGO_INTERACTIONS_DB = "opiniones_db"

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✅ Conexión a MongoDB exitosa")
except Exception as e:
    print(f"❌ Error al conectar con MongoDB: {e}")

def load_movies_from_mongodb():
    """Carga todas las películas de MongoDB"""
    try:
        db = client[MONGO_DB]
        movies_collection = db['movies']
        movies_data = list(movies_collection.find({}))
        df = pd.DataFrame(movies_data)
        
        # Eliminar duplicados por título (conservar solo el primero)
        if not df.empty and 'title' in df.columns:
            df = df.drop_duplicates(subset=['title'], keep='first')
        
        return df
    except Exception as e:
        print(f"Error al cargar películas: {e}")
        return pd.DataFrame()


def load_interactions_from_mongodb():
    """Carga todas las interacciones del usuario desde MongoDB"""
    try:
        db = client[MONGO_INTERACTIONS_DB]
        interactions_collection = db['interactions']
        interactions_data = list(interactions_collection.find({}))
        df = pd.DataFrame(interactions_data)
        
        # Eliminar duplicados por user_id, profile_name y movie_id (conservar el primero)
        if not df.empty and 'user_id' in df.columns and 'profile_name' in df.columns and 'movie_id' in df.columns:
            df = df.drop_duplicates(subset=['user_id', 'profile_name', 'movie_id'], keep='first')
        
        return df
    except Exception as e:
        print(f"Error al cargar interacciones: {e}")
        return pd.DataFrame()


def extract_rating_value(rating_data):
    """Extrae el valor numérico del rating en diferentes formatos"""
    if isinstance(rating_data, dict):
        if '$numberDouble' in rating_data:
            try:
                return float(rating_data['$numberDouble'])
            except (ValueError, TypeError):
                return None
    elif isinstance(rating_data, (int, float)):
        return float(rating_data)
    elif isinstance(rating_data, str):
        try:
            return float(rating_data)
        except (ValueError, TypeError):
            return None
    return None


def format_genres(genres_data):
    """Formatea los géneros a string separado por comas"""
    if isinstance(genres_data, list):
        return ', '.join(genre for genre in genres_data if genre is not None)
    elif isinstance(genres_data, str):
        return genres_data
    return None


def clean_float_values(df):
    """Limpia valores infinitos y NaN de todas las columnas numéricas del DataFrame"""
    df_clean = df.copy()
    for col in df_clean.columns:
        if df_clean[col].dtype in ['float64', 'float32']:
            # Reemplazar infinitos por NaN
            df_clean[col] = df_clean[col].replace([np.inf, -np.inf], np.nan)
            # Llenar NaN con 0
            df_clean[col] = df_clean[col].fillna(0)
            # Asegurar que es float válido
            df_clean[col] = df_clean[col].astype(float)
    return df_clean


def prepare_data(dfmovies, dfopiniones):
    """Prepara y procesa los datos de películas e interacciones"""
    # Extraer el valor del $oid de la columna '_id'
    dfmovies['movie_id_str'] = dfmovies['_id'].apply(
        lambda x: str(x['$oid']) if isinstance(x, dict) and '$oid' in x else str(x)
    )
    
    # Extraer y procesar el 'rating' de la columna 'imdb'
    dfmovies['imdb_rating'] = dfmovies['imdb'].apply(
        lambda x: extract_rating_value(x.get('rating')) if isinstance(x, dict) else None
    )
    
    # Formatear la columna 'genres'
    dfmovies['formatted_genres'] = dfmovies['genres'].apply(format_genres)
    
    # Asegurar que el 'movie_id' en dfopiniones sea string
    if not dfopiniones.empty:
        dfopiniones['movie_id'] = dfopiniones['movie_id'].astype(str)
        
        # Unir datos
        merged_data = pd.merge(
            dfopiniones,
            dfmovies[['movie_id_str', 'title', 'imdb_rating', 'formatted_genres', 'poster', 'plot', 'fullplot', 'cast', 'directors', 'writers']],
            left_on='movie_id',
            right_on='movie_id_str',
            how='inner'
        )
        
        # Seleccionar y renombrar columnas
        final_table = merged_data[[
            'user_id', 'profile_name', 'title', 'score', 'imdb_rating',
            'movie_id_str', 'formatted_genres', 'poster', 'plot', 'fullplot', 'cast', 'directors', 'writers'
        ]]
        
        final_table = final_table.rename(columns={
            'title': 'movie_title',
            'score': 'user_score',
            'imdb_rating': 'average_imdb_rating',
            'formatted_genres': 'genres'
        })
        
        return final_table
    
    return pd.DataFrame()


def recommend_movies(df_interactions, df_movies_metadata, target_user_email, target_profile_name):
    """Genera recomendaciones de películas para un usuario y perfil específico"""
    
    # Agregar columnas faltantes a dfmovies si no existen
    movies_df_processed = df_movies_metadata.copy()
    
    if 'movie_id_str' not in movies_df_processed.columns:
        movies_df_processed['movie_id_str'] = movies_df_processed['_id'].apply(
            lambda x: str(x['$oid']) if isinstance(x, dict) and '$oid' in x else str(x)
        )
    
    if 'imdb_rating' not in movies_df_processed.columns:
        movies_df_processed['imdb_rating'] = movies_df_processed['imdb'].apply(
            lambda x: extract_rating_value(x.get('rating')) if isinstance(x, dict) else None
        )
    
    if 'formatted_genres' not in movies_df_processed.columns:
        movies_df_processed['formatted_genres'] = movies_df_processed['genres'].apply(format_genres)
    
    # Asegurar que 'movie_id_str' sea string
    movies_df_processed['movie_id_str'] = movies_df_processed['movie_id_str'].astype(str)
    
    # Manejar valores nulos en 'imdb_rating'
    movies_df_processed['imdb_rating'] = movies_df_processed['imdb_rating'].fillna(5.0)
    
    # Filtrar historial del usuario (buscar en df_interactions)
    # df_interactions puede tener columnas renombradas, así que usamos ambas opciones
    user_id_col = 'user_id' if 'user_id' in df_interactions.columns else 'user_id'
    profile_col = 'profile_name' if 'profile_name' in df_interactions.columns else 'profile_name'
    
    user_history = df_interactions[
        (df_interactions[user_id_col] == target_user_email) &
        (df_interactions[profile_col] == target_profile_name)
    ]
    
    # Si no hay historial O el usuario tiene menos de 10 calificaciones, retornar películas populares
    if user_history.empty or len(user_history) < 10:
        if user_history.empty:
            print(f"⚠️ No se encontró historial para {target_user_email} con perfil {target_profile_name}")
        else:
            print(f"⚠️ Usuario tiene solo {len(user_history)} calificaciones (menos de 10)")
        
        print(f"ℹ️ Retornando películas populares por calidad")
        
        # Si no hay historial o muy pocas calificaciones, retornar películas de mejor calidad
        unseen_movies_df = movies_df_processed.copy()
        unseen_movies_df['imdb_rating'] = unseen_movies_df['imdb_rating'].fillna(5.0)
        unseen_movies_df['predicted_score'] = unseen_movies_df['imdb_rating'] / 10.0
        
        # Limpiar infinitos y NaN
        unseen_movies_df['predicted_score'] = unseen_movies_df['predicted_score'].replace([np.inf, -np.inf], np.nan).fillna(0.5)
        
        recommendations = unseen_movies_df.sort_values(by='predicted_score', ascending=False)
        final_columns = [
            'movie_id_str', 'title', 'poster', 'plot', 'fullplot', 'cast', 'directors',
            'writers', 'formatted_genres', 'imdb_rating', 'year', 'runtime', 'genres', 'imdb',
            'predicted_score'
        ]
        available_columns = [col for col in final_columns if col in recommendations.columns]
        result = recommendations[available_columns].head(10).copy()
        
        # Eliminar duplicados por movie_id_str
        result = result.drop_duplicates(subset=['movie_id_str'], keep='first')
        
        # Si después de eliminar duplicados tenemos menos de 10, agregar más películas
        if len(result) < 10:
            remaining_movies = recommendations[~recommendations['movie_id_str'].isin(result['movie_id_str'])][available_columns]
            additional = remaining_movies.head(10 - len(result))
            result = pd.concat([result, additional], ignore_index=True)
        
        # Limpiar TODOS los valores infinitos o NaN antes de retornar
        result = clean_float_values(result)
        
        if 'imdb' in result.columns:
            result['imdb'] = result['imdb'].apply(lambda x: str(x) if x is not None else None)
        
        return result
    
    # Obtener el nombre de la columna del ID de película
    movie_id_col = 'movie_id_str' if 'movie_id_str' in user_history.columns else 'movie_id'
    score_col = 'user_score' if 'user_score' in user_history.columns else 'score'
    genres_col = 'genres' if 'genres' in user_history.columns else 'formatted_genres'
    
    seen_movies = user_history[movie_id_col].unique().tolist()
    print(f"Usuario '{target_profile_name}' ({target_user_email}) ha visto {len(seen_movies)} películas.")
    
    # Identificar géneros favoritos
    highly_rated_movies = user_history[user_history[score_col] >= 7]
    favorite_genres_list = []
    for genres_str in highly_rated_movies[genres_col].dropna():
        favorite_genres_list.extend([genre.strip() for genre in genres_str.split(',') if genre.strip()])
    
    favorite_genres_str = ''
    if favorite_genres_list:
        genre_counts = Counter(favorite_genres_list)
        favorite_genres = [genre for genre, count in genre_counts.most_common(5)]
        favorite_genres_str = ', '.join(favorite_genres)
    
    # Filtrar películas no vistas
    unseen_movies_df = movies_df_processed[~movies_df_processed['movie_id_str'].isin(seen_movies)].copy()
    unseen_movies_df['formatted_genres'] = unseen_movies_df['formatted_genres'].fillna('')
    
    # Identificar usuarios vecinos
    user_rated_movies_scores = user_history[[movie_id_col, score_col]].copy()
    user_rated_movies_scores.columns = ['movie_id_str', 'target_user_score']
    
    other_users_interactions = df_interactions[
        ~((df_interactions[user_id_col] == target_user_email) &
          (df_interactions[profile_col] == target_profile_name))
    ].copy()
    
    # Normalizar columnas
    if 'movie_id_str' not in other_users_interactions.columns:
        other_users_interactions['movie_id_str'] = other_users_interactions.get('movie_id', '')
    if 'user_score' not in other_users_interactions.columns:
        other_users_interactions['user_score'] = other_users_interactions.get('score', 0)
    
    shared_movies_with_scores = pd.merge(
        user_rated_movies_scores,
        other_users_interactions[['movie_id_str', user_id_col, profile_col, 'user_score']],
        on='movie_id_str',
        how='inner',
        suffixes=('_target', '_other')
    )
    
    shared_movies_with_scores['score_difference'] = abs(
        shared_movies_with_scores['target_user_score'] - shared_movies_with_scores['user_score']
    )
    
    potential_neighbors_df = shared_movies_with_scores[shared_movies_with_scores['score_difference'] <= 1]
    neighbor_agreement_counts = potential_neighbors_df.groupby([user_id_col, profile_col]).size().reset_index(name='agreement_count')
    identified_neighbors_df = neighbor_agreement_counts[neighbor_agreement_counts['agreement_count'] >= 1]
    
    # Calcular scores predichos
    # Si hay pocos vecinos (menos de 3) o el usuario ha visto pocas películas, reducir peso social
    has_enough_neighbors = not identified_neighbors_df.empty and len(identified_neighbors_df) >= 1
    has_few_ratings = len(seen_movies) < 10
    
    social_weight = 0.7 if (has_enough_neighbors and not has_few_ratings) else 0.3
    quality_weight = 0.2 if (has_enough_neighbors and not has_few_ratings) else 0.6
    genre_weight = 0.1 if (has_enough_neighbors and not has_few_ratings) else 0.1
    
    if has_enough_neighbors:
        df_interactions['user_profile_id'] = df_interactions[user_id_col] + '_' + df_interactions[profile_col]
        identified_neighbors_df['user_profile_id'] = identified_neighbors_df[user_id_col] + '_' + identified_neighbors_df[profile_col]
        
        neighbor_interactions = df_interactions[
            df_interactions['user_profile_id'].isin(identified_neighbors_df['user_profile_id'])
        ]
        
        neighbor_unseen_movies_interactions = neighbor_interactions[
            ~neighbor_interactions['movie_id_str'].isin(seen_movies)
        ]
        
        social_scores = neighbor_unseen_movies_interactions.groupby('movie_id_str')['user_score'].mean().reset_index()
        social_scores.columns = ['movie_id_str', 'social_score_A']
        unseen_movies_df = pd.merge(
            unseen_movies_df,
            social_scores,
            on='movie_id_str',
            how='left'
        )
    else:
        unseen_movies_df['social_score_A'] = 0
    
    unseen_movies_df['social_score_A'] = unseen_movies_df['social_score_A'].fillna(0)
    
    # Score Calidad (B): IMDb rating normalizado
    unseen_movies_df['imdb_rating'] = unseen_movies_df['imdb_rating'].fillna(5.0)
    unseen_movies_df['quality_score_B'] = unseen_movies_df['imdb_rating'] / 10.0
    unseen_movies_df['quality_score_B'] = unseen_movies_df['quality_score_B'].fillna(0.5)
    
    # Score Bonus (C): Género favorito
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix_movies = tfidf.fit_transform(unseen_movies_df['formatted_genres'])
    
    if favorite_genres_str:
        tfidf_user_genres = tfidf.transform([favorite_genres_str])
    else:
        tfidf_user_genres = tfidf.transform([''])
    
    if tfidf_user_genres.shape[0] > 0 and tfidf_matrix_movies.shape[0] > 0:
        cosine_sim = linear_kernel(tfidf_user_genres, tfidf_matrix_movies).flatten()
    else:
        cosine_sim = np.zeros(len(unseen_movies_df))
    
    unseen_movies_df['bonus_score_C'] = np.where(cosine_sim > 0, 10, 0)
    
    # Fórmula final con pesos dinámicos
    unseen_movies_df['predicted_score'] = (
        (unseen_movies_df['social_score_A'] * social_weight) +
        (unseen_movies_df['quality_score_B'] * quality_weight) +
        (unseen_movies_df['bonus_score_C'] * genre_weight)
    )
    
    # Asegurar que no hay infinitos o NaN antes de ordenar
    unseen_movies_df = clean_float_values(unseen_movies_df)
    
    # Ordenar y devolver top 10
    recommendations = unseen_movies_df.sort_values(by='predicted_score', ascending=False)
    
    final_columns = [
        'movie_id_str', 'title', 'poster', 'plot', 'fullplot', 'cast', 'directors',
        'writers', 'formatted_genres', 'imdb_rating', 'year', 'runtime', 'genres', 'imdb',
        'social_score_A', 'quality_score_B', 'bonus_score_C', 'predicted_score'
    ]
    
    available_columns = [col for col in final_columns if col in recommendations.columns]
    result = recommendations[available_columns].head(10).copy()
    
    # Eliminar duplicados por movie_id_str (en caso de que haya)
    result = result.drop_duplicates(subset=['movie_id_str'], keep='first')
    
    # Si después de eliminar duplicados tenemos menos de 10, agregar más películas
    if len(result) < 10:
        remaining_movies = recommendations[~recommendations['movie_id_str'].isin(result['movie_id_str'])][available_columns]
        additional = remaining_movies.head(10 - len(result))
        result = pd.concat([result, additional], ignore_index=True)
    
    # Limpiar TODOS los valores infinitos o NaN antes de retornar
    result = clean_float_values(result)
    
    # Convertir imdb a string si existe para evitar errores de serialización
    if 'imdb' in result.columns:
        result['imdb'] = result['imdb'].apply(lambda x: str(x) if x is not None else None)
    
    return result


@app.get("/")
def root():
    return {"message": "Recommendation Service funcionando correctamente"}


@app.get("/recommendations")
def get_recommendations(email: str = Query(...), profile_name: str = Query(...)):
    """
    Obtiene recomendaciones de películas para un usuario y perfil específico
    
    Parámetros:
    - email: Email del usuario (ej: admin@dcicflix.com)
    - profile_name: Nombre del perfil (ej: Lautaro)
    """
    try:
        # Cargar datos desde MongoDB
        dfmovies = load_movies_from_mongodb()
        dfopiniones = load_interactions_from_mongodb()
        
        if dfmovies.empty:
            raise HTTPException(status_code=500, detail="No se pudieron cargar las películas")
        
        if dfopiniones.empty:
            raise HTTPException(status_code=500, detail="No se pudieron cargar las interacciones")
        
        # Preparar datos
        final_table = prepare_data(dfmovies, dfopiniones)
        
        if final_table.empty:
            raise HTTPException(status_code=500, detail="Error al procesar los datos")
        
        # Generar recomendaciones
        recommendations = recommend_movies(final_table, dfmovies, email, profile_name)
        
        # Limpiar TODO antes de convertir a JSON
        recommendations = clean_float_values(recommendations)
        
        # Convertir a lista de dictionaries, manejando valores especiales
        result_list = []
        for _, row in recommendations.iterrows():
            row_dict = {}
            
            for col in row.index:
                value = row[col]
                
                # Manejo especial para diferentes tipos de datos
                if value is None:
                    row_dict[col] = None
                elif isinstance(value, (np.integer, np.int64, np.int32)):
                    row_dict[col] = int(value)
                elif isinstance(value, (np.floating, float)):
                    # Validar que sea número válido
                    if np.isfinite(value):
                        row_dict[col] = float(value)
                    else:
                        row_dict[col] = 0.0
                elif isinstance(value, np.ndarray):
                    row_dict[col] = value.tolist()
                else:
                    row_dict[col] = value
            
            result_list.append(row_dict)
        
        return JSONResponse(content={
            "email": email,
            "profile_name": profile_name,
            "recommendations": result_list
        })
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error al generar recomendaciones: {str(e)}")