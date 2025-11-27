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

# --- FUNCIONES DE CARGA DE DATOS ---

def load_movies_from_mongodb():
    """Carga todas las películas de MongoDB"""
    try:
        db = client[MONGO_DB]
        movies_collection = db['movies']
        movies_data = list(movies_collection.find({}))
        df = pd.DataFrame(movies_data)
        
        # Eliminar duplicados por título
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
        
        # Normalizar movie_id
        if not df.empty and 'movie_id' in df.columns:
            df['movie_id'] = df['movie_id'].astype(str)

        # Eliminar duplicados
        if not df.empty and 'user_id' in df.columns and 'profile_name' in df.columns and 'movie_id' in df.columns:
            if 'timestamp' in df.columns:
                df = df.sort_values('timestamp', ascending=False)
            df = df.drop_duplicates(subset=['user_id', 'profile_name', 'movie_id'], keep='first')
        
        return df
    except Exception as e:
        print(f"Error al cargar interacciones: {e}")
        return pd.DataFrame()


def extract_rating_value(rating_data):
    if isinstance(rating_data, dict):
        if '$numberDouble' in rating_data:
            try: return float(rating_data['$numberDouble'])
            except: return None
    elif isinstance(rating_data, (int, float)): return float(rating_data)
    elif isinstance(rating_data, str):
        try: return float(rating_data)
        except: return None
    return None


def format_genres(genres_data):
    if isinstance(genres_data, list): return ', '.join(g for g in genres_data if g)
    elif isinstance(genres_data, str): return genres_data
    return None


def clean_float_values(df):
    df_clean = df.copy()
    for col in df_clean.columns:
        if df_clean[col].dtype in ['float64', 'float32']:
            df_clean[col] = df_clean[col].replace([np.inf, -np.inf], np.nan).fillna(0.0)
    return df_clean


def prepare_data(dfmovies, dfopiniones):
    # Preparar Movies
    dfmovies['movie_id_str'] = dfmovies['_id'].apply(lambda x: str(x['$oid']) if isinstance(x, dict) and '$oid' in x else str(x))
    dfmovies['imdb_rating'] = dfmovies['imdb'].apply(lambda x: extract_rating_value(x.get('rating')) if isinstance(x, dict) else None)
    dfmovies['formatted_genres'] = dfmovies['genres'].apply(format_genres)
    
    # Limpieza para los nuevos features (Plot y Director)
    dfmovies['plot'] = dfmovies['plot'].fillna('')
    dfmovies['directors'] = dfmovies['directors'].apply(lambda x: x if isinstance(x, list) else [])

    if dfopiniones.empty:
        return pd.DataFrame(columns=['user_id', 'profile_name', 'movie_title', 'user_score', 'average_imdb_rating', 'movie_id_str', 'genres', 'poster', 'plot', 'fullplot', 'cast', 'directors', 'writers'])
    
    dfopiniones['movie_id'] = dfopiniones['movie_id'].astype(str)
    
    # Merge
    merged = pd.merge(
        dfopiniones,
        dfmovies[['movie_id_str', 'title', 'imdb_rating', 'formatted_genres', 'poster', 'plot', 'fullplot', 'cast', 'directors', 'writers']],
        left_on='movie_id', 
        right_on='movie_id_str', 
        how='inner'
    )
    
    # Renombrar
    merged = merged.rename(columns={'title': 'movie_title', 'score': 'user_score', 'formatted_genres': 'genres'})
    
    # Limpiar columnas duplicadas
    merged = merged.loc[:, ~merged.columns.duplicated(keep='first')]
    
    # Seleccionar columnas necesarias
    cols = [
        'user_id', 'profile_name', 'movie_id', 'movie_id_str', 'user_score', 'movie_title', 
        'genres', 'poster', 'plot', 'fullplot', 'cast', 'directors', 'writers', 'imdb_rating'
    ]
    cols = [c for c in cols if c in merged.columns]
    
    # Resetear índice
    return merged[cols].copy().reset_index(drop=True)


def recommend_movies(df_interactions, df_movies_metadata, target_user_email, target_profile_name):
    """Genera recomendaciones de películas usando lógica Híbrida Avanzada"""
    
    # --- CONFIGURACIÓN ---
    MIN_RATINGS_PERSONALIZED = 10
    MIN_RATINGS_NEIGHBORS = 30
    MIN_COMMON_MOVIES = 5

    # Procesar metadatos de películas (Candidatos)
    movies_df_processed = df_movies_metadata.copy()
    
    if 'movie_id_str' not in movies_df_processed.columns:
        movies_df_processed['movie_id_str'] = movies_df_processed['_id'].apply(lambda x: str(x['$oid']) if isinstance(x, dict) and '$oid' in x else str(x))
    
    if 'imdb_rating' not in movies_df_processed.columns:
        movies_df_processed['imdb_rating'] = movies_df_processed['imdb'].apply(lambda x: extract_rating_value(x.get('rating')) if isinstance(x, dict) else None)
    movies_df_processed['imdb_rating'] = movies_df_processed['imdb_rating'].fillna(5.0)

    if 'formatted_genres' not in movies_df_processed.columns:
        movies_df_processed['formatted_genres'] = movies_df_processed['genres'].apply(format_genres)
        
    movies_df_processed['plot'] = movies_df_processed['plot'].fillna('')
    movies_df_processed['directors'] = movies_df_processed['directors'].apply(lambda x: x if isinstance(x, list) else [])
    
    # --- FILTRAR HISTORIAL (Tu lógica segura) ---
    seen_movie_titles = set()
    
    if df_interactions.empty:
        user_history = pd.DataFrame()
    else:
        user_id_col = 'user_id' if 'user_id' in df_interactions.columns else 'user_id'
        profile_col = 'profile_name' if 'profile_name' in df_interactions.columns else 'profile_name'
        
        # Reset index para evitar duplicados de labels
        user_history = df_interactions[
            (df_interactions[user_id_col] == target_user_email) &
            (df_interactions[profile_col] == target_profile_name)
        ].copy().reset_index(drop=True)

        if not user_history.empty:
            if 'movie_title' in user_history.columns:
                seen_movie_titles = set(user_history['movie_title'].dropna().astype(str).str.strip().unique())
            elif 'title' in user_history.columns:
                seen_movie_titles = set(user_history['title'].dropna().astype(str).str.strip().unique())
            print(f"🎬 Películas vistas detectadas: {len(seen_movie_titles)}")

    # Columnas de resultado
    final_columns = [
        'movie_id_str', 'title', 'poster', 'plot', 'fullplot', 'cast', 'directors',
        'writers', 'formatted_genres', 'imdb_rating', 'year', 'runtime', 'genres', 'imdb',
        'predicted_score', 'match_reason', 'score_genre', 'score_director', 'score_plot', 'score_social'
    ]

    num_ratings = len(user_history)
    print(f"📊 Usuario: {target_user_email} | Calificaciones: {num_ratings}")

    # --- FASE 1: COLD START (< 10 calificaciones) ---
    if user_history.empty or num_ratings < MIN_RATINGS_PERSONALIZED:
        print(f"❄️ Modo Cold Start.")
        
        # Filtro maestro por título
        unseen_movies_df = movies_df_processed[
            ~movies_df_processed['title'].isin(seen_movie_titles)
        ].copy()
        
        unseen_movies_df['predicted_score'] = unseen_movies_df['imdb_rating'] / 10.0
        unseen_movies_df['predicted_score'] = unseen_movies_df['predicted_score'].fillna(0.5)
        unseen_movies_df['match_reason'] = 'Tendencia Global'
        
        recommendations = unseen_movies_df.sort_values(by='predicted_score', ascending=False)
        
        # Pool Aleatorio
        available_cols = [col for col in final_columns if col in recommendations.columns]
        recommendations = recommendations.drop_duplicates(subset=['movie_id_str'], keep='first')
        top_50_pool = recommendations[available_cols].head(50)
        result = top_50_pool.sample(n=min(12, len(top_50_pool))) if not top_50_pool.empty else top_50_pool
        
        result = clean_float_values(result)
        if 'imdb' in result.columns: result['imdb'] = result['imdb'].apply(lambda x: str(x) if x is not None else None)
        return result
    
    # --- PERFILADO AVANZADO (Lobo Solitario / Híbrido) ---
    
    movie_id_col = 'movie_id_str' if 'movie_id_str' in user_history.columns else 'movie_id'
    score_col = 'user_score' if 'user_score' in user_history.columns else 'score'
    genres_col = 'genres' if 'genres' in user_history.columns else 'formatted_genres'
    
    seen_movies = user_history[movie_id_col].unique().tolist()
    
    # 1. Perfil de GÉNEROS (Likes >= 7)
    liked_movies = user_history[user_history[score_col] >= 7].copy()
    favorite_genres_list = []
    for genres_str in liked_movies[genres_col].dropna():
        favorite_genres_list.extend([genre.strip() for genre in str(genres_str).split(',') if genre.strip()])
    
    favorite_genres_str = ''
    top_genres = []
    if favorite_genres_list:
        genre_counts = Counter(favorite_genres_list)
        top_genres = [genre for genre, count in genre_counts.most_common(5)]
        favorite_genres_str = ', '.join(top_genres)
        print(f"❤️ Géneros favoritos: {top_genres}")

    # 2. Perfil de DIRECTORES
    directors_list = []
    if 'directors' in liked_movies.columns:
        for d_list in liked_movies['directors']:
            if isinstance(d_list, list): directors_list.extend(d_list)
    top_directors = [d[0] for d in Counter(directors_list).most_common(3)] if directors_list else []
    print(f"🎬 Directores favoritos: {top_directors}")

    # 3. Perfil de TRAMA/PLOT (NUEVO - NLP)
    loved_movies = user_history[user_history[score_col] >= 9]
    user_plot_corpus = " ".join(loved_movies['plot'].astype(str).tolist()) if 'plot' in loved_movies.columns else ""
    
    # --- GENERACIÓN DE CANDIDATOS (FILTRANDO VISTAS POR TÍTULO) ---
    candidates = movies_df_processed[
        ~movies_df_processed['title'].isin(seen_movie_titles)
    ].copy()
    candidates['formatted_genres'] = candidates['formatted_genres'].fillna('')
    
    # --- CÁLCULO DE SCORES ---

    # A. Score SOCIAL (Vecinos)
    candidates['score_social'] = 0.0
    has_enough_neighbors = False
    
    if not df_interactions.empty and num_ratings >= MIN_RATINGS_NEIGHBORS:
        user_rated = user_history[[movie_id_col, score_col]].copy()
        user_rated.columns = ['movie_id_str', 'target_user_score']
        
        other_users = df_interactions[~((df_interactions[user_id_col] == target_user_email) & (df_interactions[profile_col] == target_profile_name))].copy()
        
        if not other_users.empty:
            # Normalizar
            if 'movie_id_str' not in other_users.columns: other_users['movie_id_str'] = other_users.get('movie_id', '')
            if 'user_score' not in other_users.columns: other_users['user_score'] = other_users.get('score', 0)

            shared = pd.merge(
                user_rated,
                other_users[['movie_id_str', user_id_col, profile_col, 'user_score']],
                on='movie_id_str',
                how='inner'
            )
            
            if not shared.empty:
                shared['diff'] = abs(shared['target_user_score'] - shared['user_score'])
                potential_matches = shared[shared['diff'] <= 1]
                neighbor_counts = potential_matches.groupby([user_id_col, profile_col]).size().reset_index(name='count')
                real_neighbors = neighbor_counts[neighbor_counts['count'] >= MIN_COMMON_MOVIES]
                
                if not real_neighbors.empty:
                    has_enough_neighbors = True
                    print(f"🤝 Vecinos encontrados: {len(real_neighbors)}")
                    
                    df_interactions['uid_pid'] = df_interactions[user_id_col] + '_' + df_interactions[profile_col]
                    real_neighbors['uid_pid'] = real_neighbors[user_id_col] + '_' + real_neighbors[profile_col]
                    
                    neighbor_data = df_interactions[df_interactions['uid_pid'].isin(real_neighbors['uid_pid'])].copy()
                    
                    # --- CORRECCIÓN CRÍTICA: ASEGURAR NOMBRE DE COLUMNA ID ---
                    # Detectamos cuál es la columna de ID disponible en neighbor_data
                    col_id_neighbor = 'movie_id_str' if 'movie_id_str' in neighbor_data.columns else 'movie_id'
                    col_score_neighbor = 'user_score' if 'user_score' in neighbor_data.columns else 'score'
                    
                    # Filtrar basura de vecinos
                    neighbor_good_data = neighbor_data[
                        (~neighbor_data[col_id_neighbor].isin(seen_movies)) & 
                        (neighbor_data[col_score_neighbor] >= 6)
                    ]
                    
                    if not neighbor_good_data.empty:
                        social_scores = neighbor_good_data.groupby(col_id_neighbor)[col_score_neighbor].mean().reset_index()
                        social_scores.columns = ['movie_id_str', 'social_score_A'] # Estandarizamos nombre para el merge
                        
                        candidates = pd.merge(candidates, social_scores, on='movie_id_str', how='left')
                        candidates['score_social'] = candidates['social_score_A'].fillna(0.0) / 10.0 

    # B. Score GÉNERO
    def calc_genre_sim(g_str):
        if not isinstance(g_str, str): return 0.0
        movie_g = set([x.strip() for x in g_str.split(',')])
        user_g = set(top_genres)
        if not user_g: return 0.0
        return len(movie_g.intersection(user_g)) / len(user_g)
    candidates['score_genre'] = candidates['formatted_genres'].apply(calc_genre_sim)

    # C. Score DIRECTOR
    candidates['score_director'] = candidates['directors'].apply(lambda x: 1.0 if any(d in top_directors for d in x) else 0.0)

    # D. Score TRAMA (NLP)
    candidates['score_plot'] = 0.0
    if user_plot_corpus and len(user_plot_corpus) > 50:
        try:
            tfidf = TfidfVectorizer(stop_words='english', max_features=2000)
            corpus = [user_plot_corpus] + candidates['plot'].tolist()
            matrix = tfidf.fit_transform(corpus)
            sims = linear_kernel(matrix[0:1], matrix[1:]).flatten()
            candidates['score_plot'] = sims
        except: pass

    # E. Score CALIDAD
    candidates['score_quality'] = candidates['imdb_rating'].fillna(5.0) / 10.0

    # --- PESOS Y FÓRMULA FINAL ---
    
    if has_enough_neighbors:
        w_social, w_content, w_quality = 0.4, 0.4, 0.2
        mode_label = "Tu Comunidad"
    else:
        w_social, w_content, w_quality = 0.0, 0.7, 0.3
        mode_label = "Tus Gustos"

    w_gen, w_dir, w_plt = 0.4, 0.3, 0.3

    candidates['content_score'] = (
        (candidates['score_genre'] * w_gen) +
        (candidates['score_director'] * w_dir) +
        (candidates['score_plot'] * w_plt)
    )
    
    candidates['predicted_score'] = (
        (candidates['score_social'] * w_social) +
        (candidates['content_score'] * w_content) +
        (candidates['score_quality'] * w_quality)
    )

    # Etiquetas
    conditions = [
        (candidates['score_social'] > 0.7, 'Tu comunidad la recomienda'),
        (candidates['score_director'] > 0, 'De tu director favorito'),
        (candidates['score_plot'] > 0.3, 'Trama similar a lo que ves'),
        (candidates['score_genre'] > 0.5, 'De tus géneros top')
    ]
    candidates['match_reason'] = np.select([c[0] for c in conditions], [c[1] for c in conditions], default=f'Basado en {mode_label}')

    # --- RETORNO FINAL ---
    candidates = clean_float_values(candidates)
    recommendations = candidates.sort_values(by='predicted_score', ascending=False)
    
    available_cols = [c for c in final_columns if c in recommendations.columns]
    recommendations = recommendations.drop_duplicates(subset=['movie_id_str'], keep='first')
    
    top_50_pool = recommendations[available_cols].head(50)
    result = top_50_pool.sample(n=min(12, len(top_50_pool))) if not top_50_pool.empty else top_50_pool
    
    if len(result) < 12:
        remaining = recommendations[~recommendations['movie_id_str'].isin(result['movie_id_str'])][available_cols]
        result = pd.concat([result, remaining.head(12 - len(result))], ignore_index=True)
        
    result = clean_float_values(result)
    if 'imdb' in result.columns: result['imdb'] = result['imdb'].apply(lambda x: str(x) if x is not None else None)
    
    print(f"✅ Recomendaciones generadas. Modo: {mode_label}")
    return result

@app.get("/recommendations")
def get_recommendations(email: str = Query(...), profile_name: str = Query(...)):
    try:
        dfmovies = load_movies_from_mongodb()
        dfopiniones = load_interactions_from_mongodb()
        if dfmovies.empty: raise HTTPException(status_code=500, detail="No se pudieron cargar las películas")
        
        final_table = prepare_data(dfmovies, dfopiniones)
        recs = recommend_movies(final_table, dfmovies, email, profile_name)
        
        # Limpieza manual de tipos para JSON
        result_list = []
        for _, row in recs.iterrows():
            row_dict = {}
            for col in row.index:
                val = row[col]
                if isinstance(val, (list, np.ndarray)):
                    if isinstance(val, np.ndarray): row_dict[col] = val.tolist()
                    else: row_dict[col] = val
                elif pd.isna(val) or val is None: row_dict[col] = None
                elif isinstance(val, (np.floating, float)):
                    row_dict[col] = float(val) if np.isfinite(val) else 0.0
                elif isinstance(val, (np.integer, int)): row_dict[col] = int(val)
                else: row_dict[col] = val
            result_list.append(row_dict)

        return JSONResponse(content={"email": email, "profile_name": profile_name, "recommendations": result_list})
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error al generar recomendaciones: {str(e)}")

@app.get("/")
def root():
    return {"message": "Recommendation Service Active"}