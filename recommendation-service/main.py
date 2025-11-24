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
        
        # Eliminar duplicados por user_id, profile_name y movie_id
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
            df_clean[col] = df_clean[col].replace([np.inf, -np.inf], np.nan)
            df_clean[col] = df_clean[col].fillna(0)
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
    
    # Manejar tabla de opiniones vacía
    if dfopiniones.empty:
        return pd.DataFrame(columns=[
            'user_id', 'profile_name', 'movie_title', 'user_score', 'average_imdb_rating',
            'movie_id_str', 'genres', 'poster', 'plot', 'fullplot', 'cast', 'directors', 'writers'
        ])
    
    # Asegurar que el 'movie_id' en dfopiniones sea string
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


def recommend_movies(df_interactions, df_movies_metadata, target_user_email, target_profile_name):
    """Genera recomendaciones de películas para un usuario y perfil específico"""
    
    # Procesar metadatos de películas
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
    
    movies_df_processed['movie_id_str'] = movies_df_processed['movie_id_str'].astype(str)
    movies_df_processed['imdb_rating'] = movies_df_processed['imdb_rating'].fillna(5.0)
    
    # Verificar interacciones
    if df_interactions.empty:
        print("⚠️ No hay interacciones. Cold Start Global.")
        user_history = pd.DataFrame()
    else:
        user_id_col = 'user_id' if 'user_id' in df_interactions.columns else 'user_id'
        profile_col = 'profile_name' if 'profile_name' in df_interactions.columns else 'profile_name'
        
        user_history = df_interactions[
            (df_interactions[user_id_col] == target_user_email) &
            (df_interactions[profile_col] == target_profile_name)
        ]
    
    # Columnas de resultado
    final_columns = [
        'movie_id_str', 'title', 'poster', 'plot', 'fullplot', 'cast', 'directors',
        'writers', 'formatted_genres', 'imdb_rating', 'year', 'runtime', 'genres', 'imdb',
        'predicted_score'
    ]

    # --- COLD START / POCOS DATOS ---
    if user_history.empty or len(user_history) < 5:
        print(f"⚠️ Cold Start para {target_user_email}.")
        
        unseen_movies_df = movies_df_processed.copy()
        unseen_movies_df['predicted_score'] = unseen_movies_df['imdb_rating'] / 10.0
        unseen_movies_df['predicted_score'] = unseen_movies_df['predicted_score'].fillna(0.5)
        
        # Ordenamos por calidad
        recommendations = unseen_movies_df.sort_values(by='predicted_score', ascending=False)
        
        # --- SELECCIÓN ALEATORIA DEL TOP 50 ---
        available_columns = [col for col in final_columns if col in recommendations.columns]
        
        # 1. Eliminar duplicados antes de seleccionar
        recommendations = recommendations.drop_duplicates(subset=['movie_id_str'], keep='first')
        
        # 2. Tomar el Top 50
        top_50_pool = recommendations[available_columns].head(50)
        
        # 3. Elegir 10 al azar de ese pool
        if not top_50_pool.empty:
            result = top_50_pool.sample(n=min(10, len(top_50_pool)))
        else:
            result = top_50_pool # Vacío
            
        # Relleno si faltan (caso raro)
        if len(result) < 10:
            remaining = recommendations[~recommendations['movie_id_str'].isin(result['movie_id_str'])][available_columns]
            result = pd.concat([result, remaining.head(10 - len(result))], ignore_index=True)
            
        result = clean_float_values(result)
        if 'imdb' in result.columns:
            result['imdb'] = result['imdb'].apply(lambda x: str(x) if x is not None else None)
        
        return result
    
    # --- ALGORITMO DE RECOMENDACIÓN ---
    
    movie_id_col = 'movie_id_str' if 'movie_id_str' in user_history.columns else 'movie_id'
    score_col = 'user_score' if 'user_score' in user_history.columns else 'score'
    genres_col = 'genres' if 'genres' in user_history.columns else 'formatted_genres'
    
    seen_movies = user_history[movie_id_col].unique().tolist()
    
    # 1. Géneros Favoritos
    highly_rated_movies = user_history[user_history[score_col] >= 7]
    favorite_genres_list = []
    for genres_str in highly_rated_movies[genres_col].dropna():
        favorite_genres_list.extend([genre.strip() for genre in genres_str.split(',') if genre.strip()])
    
    favorite_genres_str = ''
    if favorite_genres_list:
        genre_counts = Counter(favorite_genres_list)
        favorite_genres = [genre for genre, count in genre_counts.most_common(5)]
        favorite_genres_str = ', '.join(favorite_genres)
        print(f"❤️ Géneros favoritos: {favorite_genres_str}")
    
    unseen_movies_df = movies_df_processed[~movies_df_processed['movie_id_str'].isin(seen_movies)].copy()
    unseen_movies_df['formatted_genres'] = unseen_movies_df['formatted_genres'].fillna('')
    
    # 2. Vecinos
    has_enough_neighbors = False
    if not df_interactions.empty:
        # ... (Lógica de vecinos igual que antes) ...
        user_rated = user_history[[movie_id_col, score_col]].copy()
        user_rated.columns = ['movie_id_str', 'target_user_score']
        
        other_users = df_interactions[
            ~((df_interactions[user_id_col] == target_user_email) &
              (df_interactions[profile_col] == target_profile_name))
        ].copy()
        
        if not other_users.empty:
            # Normalizar nombres para merge
            if 'movie_id_str' not in other_users.columns:
                other_users['movie_id_str'] = other_users.get('movie_id', '')
            if 'user_score' not in other_users.columns:
                other_users['user_score'] = other_users.get('score', 0)

            shared = pd.merge(
                user_rated,
                other_users[['movie_id_str', user_id_col, profile_col, 'user_score']],
                on='movie_id_str',
                how='inner'
            )
            
            if not shared.empty:
                shared['diff'] = abs(shared['target_user_score'] - shared['user_score'])
                potential = shared[shared['diff'] <= 1]
                counts = potential.groupby([user_id_col, profile_col]).size().reset_index(name='count')
                real_neighbors = counts[counts['count'] >= 1]
                
                if not real_neighbors.empty:
                    has_enough_neighbors = True
                    print(f"🤝 Vecinos encontrados: {len(real_neighbors)}")
                    
                    # Crear ID compuesto
                    df_interactions['uid_pid'] = df_interactions[user_id_col] + '_' + df_interactions[profile_col]
                    real_neighbors['uid_pid'] = real_neighbors[user_id_col] + '_' + real_neighbors[profile_col]
                    
                    neighbor_data = df_interactions[df_interactions['uid_pid'].isin(real_neighbors['uid_pid'])]
                    neighbor_unseen = neighbor_data[~neighbor_data['movie_id_str'].isin(seen_movies)]
                    
                    social_scores = neighbor_unseen.groupby('movie_id_str')['user_score'].mean().reset_index()
                    social_scores.columns = ['movie_id_str', 'social_score_A']
                    
                    unseen_movies_df = pd.merge(unseen_movies_df, social_scores, on='movie_id_str', how='left')

    if 'social_score_A' not in unseen_movies_df.columns:
        unseen_movies_df['social_score_A'] = 0
    unseen_movies_df['social_score_A'] = unseen_movies_df['social_score_A'].fillna(0)
    
    # 3. Scores B y C
    unseen_movies_df['quality_score_B'] = unseen_movies_df['imdb_rating'].fillna(5.0) / 10.0
    unseen_movies_df['bonus_score_C'] = 0.0
    
    if favorite_genres_str:
        try:
            tfidf = TfidfVectorizer(stop_words='english')
            tfidf_matrix = tfidf.fit_transform(unseen_movies_df['formatted_genres'])
            tfidf_user = tfidf.transform([favorite_genres_str])
            cosine_sim = linear_kernel(tfidf_user, tfidf_matrix).flatten()
            unseen_movies_df['bonus_score_C'] = np.where(cosine_sim > 0, 1.0, 0.0)
        except: pass
    
    # Pesos
    if has_enough_neighbors:
        print("⚖️ Modo: Híbrido")
        w_soc, w_qual, w_gen = 0.5, 0.2, 0.3
    else:
        print("⚖️ Modo: Contenido Puro")
        w_soc, w_qual, w_gen = 0.0, 0.4, 0.6
        
    unseen_movies_df['predicted_score'] = (
        (unseen_movies_df['social_score_A'] * w_soc) +
        (unseen_movies_df['quality_score_B'] * w_qual) +
        (unseen_movies_df['bonus_score_C'] * w_gen)
    )
    
    unseen_movies_df = clean_float_values(unseen_movies_df)
    
    # Ordenar ranking
    recommendations = unseen_movies_df.sort_values(by='predicted_score', ascending=False)
    
    available_columns = [col for col in final_columns if col in recommendations.columns]
    
    # --- SELECCIÓN FINAL ALEATORIA (POOL 50) ---
    
    # 1. Limpiar duplicados
    recommendations = recommendations.drop_duplicates(subset=['movie_id_str'], keep='first')
    
    # 2. Top 50 mejores matches
    top_50_pool = recommendations[available_columns].head(50)
    
    # 3. Elegir 10 al azar
    if not top_50_pool.empty:
        result = top_50_pool.sample(n=min(12, len(top_50_pool)))
    else:
        result = top_50_pool
        
    # Relleno si faltan
    if len(result) < 10:
        remaining = recommendations[~recommendations['movie_id_str'].isin(result['movie_id_str'])][available_columns]
        result = pd.concat([result, remaining.head(12 - len(result))], ignore_index=True)
        
    result = clean_float_values(result)
    
    if 'imdb' in result.columns:
        result['imdb'] = result['imdb'].apply(lambda x: str(x) if x is not None else None)
        
    return result


@app.get("/")
def root():
    return {"message": "Recommendation Service funcionando correctamente"}


@app.get("/recommendations")
def get_recommendations(email: str = Query(...), profile_name: str = Query(...)):
    try:
        dfmovies = load_movies_from_mongodb()
        dfopiniones = load_interactions_from_mongodb()
        
        if dfmovies.empty:
            raise HTTPException(status_code=500, detail="No se pudieron cargar las películas")
        
        if dfopiniones.empty:
            print("ℹ️ Base de datos de opiniones vacía. Se procederá con Cold Start.")
        
        final_table = prepare_data(dfmovies, dfopiniones)
        
        recommendations = recommend_movies(final_table, dfmovies, email, profile_name)
        recommendations = clean_float_values(recommendations)
        
        result_list = []
        for _, row in recommendations.iterrows():
            row_dict = {}
            for col in row.index:
                value = row[col]
                if value is None:
                    row_dict[col] = None
                elif isinstance(value, (np.integer, np.int64, np.int32)):
                    row_dict[col] = int(value)
                elif isinstance(value, (np.floating, float)):
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