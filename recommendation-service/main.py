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

def normalize_text(text):
    """Función auxiliar para normalizar títulos"""
    if pd.isna(text): return ""
    return str(text).lower().strip()

def load_movies_from_mongodb():
    try:
        db = client[MONGO_DB]
        movies_collection = db['movies']
        movies_data = list(movies_collection.find({}))
        df = pd.DataFrame(movies_data)
        
        if not df.empty and 'title' in df.columns:
            # Estandarizamos: 'title_norm'
            df['title_norm'] = df['title'].apply(normalize_text)
            df = df.drop_duplicates(subset=['title_norm'], keep='first')
        
        return df
    except Exception as e:
        print(f"Error al cargar películas: {e}")
        return pd.DataFrame()

def load_interactions_from_mongodb():
    try:
        db = client[MONGO_INTERACTIONS_DB]
        interactions_collection = db['interactions']
        interactions_data = list(interactions_collection.find({}))
        df = pd.DataFrame(interactions_data)
        
        # Normalizar título en interacciones
        if not df.empty:
            # Buscamos la columna de título disponible
            col_title = 'movie_title' if 'movie_title' in df.columns else 'title'
            
            if col_title in df.columns:
                # CAMBIO: Usamos el mismo nombre 'title_norm' que en movies
                df['title_norm'] = df[col_title].apply(normalize_text)

        if not df.empty and 'user_id' in df.columns and 'profile_name' in df.columns and 'title_norm' in df.columns:
            if 'timestamp' in df.columns:
                df = df.sort_values('timestamp', ascending=False)
            # Deduplicar usando el título normalizado
            df = df.drop_duplicates(subset=['user_id', 'profile_name', 'title_norm'], keep='first')
        
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
    dfmovies['plot'] = dfmovies['plot'].fillna('')
    dfmovies['directors'] = dfmovies['directors'].apply(lambda x: x if isinstance(x, list) else [])
    
    if 'title_norm' not in dfmovies.columns:
        dfmovies['title_norm'] = dfmovies['title'].apply(normalize_text)

    if dfopiniones.empty:
        return pd.DataFrame(columns=['user_id', 'profile_name', 'movie_title', 'user_score', 'average_imdb_rating', 'movie_id_str', 'genres', 'poster', 'plot', 'fullplot', 'cast', 'directors', 'writers'])
    
    # Asegurar title_norm en opiniones
    if 'title_norm' not in dfopiniones.columns:
        col_title = 'movie_title' if 'movie_title' in dfopiniones.columns else 'title'
        if col_title in dfopiniones.columns:
            dfopiniones['title_norm'] = dfopiniones[col_title].apply(normalize_text)
        else:
            return pd.DataFrame()

    merged = pd.merge(
        dfopiniones,
        dfmovies[['title_norm', 'title', 'movie_id_str', 'imdb_rating', 'formatted_genres', 'poster', 'plot', 'fullplot', 'cast', 'directors', 'writers']],
        on='title_norm',
        how='inner',
        suffixes=('_opin', '')
    )
    
    merged['movie_title'] = merged['title']
    merged = merged.rename(columns={'score': 'user_score', 'formatted_genres': 'genres'})
    merged = merged.loc[:, ~merged.columns.duplicated()]
    
    return merged

def recommend_movies(df_interactions, df_movies_metadata, target_user_email, target_profile_name):
    
    # 1. Preparar Metadata
    movies_df_processed = df_movies_metadata.copy()
    
    if 'title_norm' not in movies_df_processed.columns:
        movies_df_processed['title_norm'] = movies_df_processed['title'].apply(normalize_text)
    
    if 'movie_id_str' not in movies_df_processed.columns:
        movies_df_processed['movie_id_str'] = movies_df_processed['_id'].apply(lambda x: str(x['$oid']) if isinstance(x, dict) and '$oid' in x else str(x))
    
    if 'imdb_rating' not in movies_df_processed.columns:
        movies_df_processed['imdb_rating'] = movies_df_processed['imdb'].apply(lambda x: extract_rating_value(x.get('rating')) if isinstance(x, dict) else None)
    movies_df_processed['imdb_rating'] = movies_df_processed['imdb_rating'].fillna(5.0)

    if 'formatted_genres' not in movies_df_processed.columns:
        movies_df_processed['formatted_genres'] = movies_df_processed['genres'].apply(format_genres)
        
    movies_df_processed['plot'] = movies_df_processed['plot'].fillna('')
    movies_df_processed['directors'] = movies_df_processed['directors'].apply(lambda x: x if isinstance(x, list) else [])

    # 2. Filtrar Historial Usuario
    seen_titles_norm = set()
    
    if df_interactions.empty:
        user_history = pd.DataFrame()
    else:
        user_id_col = 'user_id'
        profile_col = 'profile_name'
        
        user_history = df_interactions[
            (df_interactions[user_id_col] == target_user_email) &
            (df_interactions[profile_col] == target_profile_name)
        ].copy().reset_index(drop=True)
        
        if not user_history.empty:
            # Si prepare_data funcionó, user_history ya tiene 'title_norm'
            if 'title_norm' in user_history.columns:
                seen_titles_norm = set(user_history['title_norm'].dropna().unique())
            
            print(f"🎬 Películas vistas (títulos normalizados): {len(seen_titles_norm)}")

    final_columns = [
        'movie_id_str', 'title', 'poster', 'plot', 'fullplot', 'cast', 'directors',
        'writers', 'formatted_genres', 'imdb_rating', 'year', 'runtime', 'genres', 'imdb',
        'predicted_score', 'match_reason', 'social_score_A', 'quality_score_B', 'bonus_score_C'
    ]

    num_ratings = len(user_history)
    print(f"📊 Usuario: {target_user_email} | Calificaciones: {num_ratings}")

    # --- FASE 1: COLD START ---
    if num_ratings < 10:
        print(f"❄️ Modo Cold Start.")
        
        unseen_movies_df = movies_df_processed[
            ~movies_df_processed['title_norm'].isin(seen_titles_norm)
        ].copy()
        
        unseen_movies_df['predicted_score'] = unseen_movies_df['imdb_rating'] / 10.0
        unseen_movies_df['predicted_score'] = unseen_movies_df['predicted_score'].fillna(0.5)
        unseen_movies_df['match_reason'] = 'Tendencia Global'
        
        recommendations = unseen_movies_df.sort_values(by='predicted_score', ascending=False)
        
        available_cols = [col for col in final_columns if col in recommendations.columns]
        recommendations = recommendations.drop_duplicates(subset=['title_norm'], keep='first')
        
        top_50_pool = recommendations[available_cols].head(50)
        result = top_50_pool.sample(n=min(12, len(top_50_pool))) if not top_50_pool.empty else top_50_pool
        
        result = clean_float_values(result)
        if 'imdb' in result.columns: result['imdb'] = result['imdb'].apply(lambda x: str(x) if x is not None else None)
        return result
    
    # --- MODOS AVANZADOS ---
    
    score_col = 'user_score' if 'user_score' in user_history.columns else 'score'
    genres_col = 'genres' if 'genres' in user_history.columns else 'formatted_genres'
    
    # 1. Perfil Géneros
    liked_movies = user_history[user_history[score_col] >= 7].copy()
    favorite_genres_list = []
    for genres_str in liked_movies[genres_col].dropna():
        favorite_genres_list.extend([genre.strip() for genre in str(genres_str).split(',') if genre.strip()])
    top_genres = [g[0] for g in Counter(favorite_genres_list).most_common(5)] if favorite_genres_list else []
    print(f"❤️ Géneros favoritos: {top_genres}")

    # 2. Perfil Directores
    directors_list = []
    if 'directors' in liked_movies.columns:
        for d_list in liked_movies['directors']:
            if isinstance(d_list, list): directors_list.extend(d_list)
    top_directors = [d[0] for d in Counter(directors_list).most_common(3)] if directors_list else []
    print(f"🎬 Directores favoritos: {top_directors}")

    # 3. Perfil Trama
    loved_movies = user_history[user_history[score_col] >= 8]
    user_plot_corpus = " ".join(loved_movies['plot'].astype(str).tolist()) if 'plot' in loved_movies.columns else ""
    
    # --- CANDIDATOS ---
    candidates = movies_df_processed[
        ~movies_df_processed['title_norm'].isin(seen_titles_norm)
    ].copy()
    candidates['formatted_genres'] = candidates['formatted_genres'].fillna('')
    
    # --- BÚSQUEDA DE VECINOS ---
    candidates['score_social'] = 0.0
    has_enough_neighbors = False
    
    if not df_interactions.empty and num_ratings >= 30:
        if 'title_norm' in user_history.columns:
            user_rated = user_history[['title_norm', score_col]].copy()
            user_rated.columns = ['join_title', 'target_user_score']
            
            other_users = df_interactions[~((df_interactions['user_id'] == target_user_email) & (df_interactions['profile_name'] == target_profile_name))].copy()
            
            if not other_users.empty:
                # Asegurar title_norm en others
                if 'title_norm' not in other_users.columns:
                     col_orig = 'movie_title' if 'movie_title' in other_users.columns else 'title'
                     if col_orig in other_users.columns:
                         other_users['title_norm'] = other_users[col_orig].apply(normalize_text)
                
                if 'title_norm' in other_users.columns:
                    other_score_col = 'user_score' if 'user_score' in other_users.columns else 'score'
                    
                    # Merge limpio por 'title_norm'
                    shared = pd.merge(
                        user_rated,
                        other_users[['title_norm', 'user_id', 'profile_name', other_score_col]],
                        left_on='join_title', right_on='title_norm',
                        how='inner'
                    )
                    
                    if not shared.empty:
                        shared['diff'] = abs(shared['target_user_score'] - shared[other_score_col])
                        
                        potential = shared[shared['diff'] <= 1]
                        counts = potential.groupby(['user_id', 'profile_name']).size().reset_index(name='count')
                        real_neighbors = counts[counts['count'] >= 5]
                        
                        if not real_neighbors.empty:
                            has_enough_neighbors = True
                            print(f"🤝 Vecinos encontrados: {len(real_neighbors)}")
                            
                            df_interactions['uid_pid'] = df_interactions['user_id'] + '_' + df_interactions['profile_name']
                            real_neighbors['uid_pid'] = real_neighbors['user_id'] + '_' + real_neighbors['profile_name']
                            
                            neighbor_data = df_interactions[df_interactions['uid_pid'].isin(real_neighbors['uid_pid'])].copy()
                            
                            if 'title_norm' not in neighbor_data.columns:
                                 # Regenerar si se perdió en la copia
                                 col_orig = 'movie_title' if 'movie_title' in neighbor_data.columns else 'title'
                                 neighbor_data['title_norm'] = neighbor_data[col_orig].apply(normalize_text)

                            neighbor_good = neighbor_data[
                                (~neighbor_data['title_norm'].isin(seen_titles_norm)) & 
                                (neighbor_data[other_score_col] >= 6)
                            ]
                            
                            # Groupby por title_norm
                            social_scores = neighbor_good.groupby('title_norm')[other_score_col].mean().reset_index()
                            social_scores.columns = ['title_norm', 'social_score_A']
                            
                            # Merge final con candidatos
                            candidates = pd.merge(candidates, social_scores, on='title_norm', how='left')
                            candidates['score_social'] = candidates['social_score_A'].fillna(0.0) / 10.0 

    # --- SCORES CONTENIDO ---
    
    # Género
    def calc_genre_sim(g_str):
        if not isinstance(g_str, str): return 0.0
        movie_g = set([x.strip() for x in g_str.split(',')])
        user_g = set(top_genres)
        if not user_g: return 0.0
        return len(movie_g.intersection(user_g)) / len(user_g)
    candidates['score_genre'] = candidates['formatted_genres'].apply(calc_genre_sim)

    # Director
    candidates['score_director'] = candidates['directors'].apply(lambda x: 1.0 if any(d in top_directors for d in x) else 0.0)

    # Plot
    candidates['score_plot'] = 0.0
    if user_plot_corpus and len(user_plot_corpus) > 50:
        try:
            tfidf = TfidfVectorizer(stop_words='english', max_features=2000)
            corpus = [user_plot_corpus] + candidates['plot'].tolist()
            matrix = tfidf.fit_transform(corpus)
            sims = linear_kernel(matrix[0:1], matrix[1:]).flatten()
            candidates['score_plot'] = sims
        except: pass

    # Calidad
    candidates['score_quality'] = candidates['imdb_rating'].fillna(5.0) / 10.0

    # --- FÓRMULA FINAL ---
    
    if has_enough_neighbors:
        w_social, w_content, w_quality = 0.8, 0.15, 0.05
        mode_label = "Tu Comunidad"
    else:
        w_social, w_content, w_quality = 0.0, 0.7, 0.3
        mode_label = "Tus Gustos"

    w_gen, w_dir, w_plt = 0.3, 0.2, 0.5

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

    conditions = [
        (candidates['score_social'] > 0.7, 'Tu comunidad la recomienda'),
        (candidates['score_director'] > 0, 'De tu director favorito'),
        (candidates['score_plot'] > 0.15, 'Trama similar a lo que ves'),
        (candidates['score_genre'] > 0.5, 'De tus géneros top')
    ]
    candidates['match_reason'] = np.select([c[0] for c in conditions], [c[1] for c in conditions], default=f'Basado en {mode_label}')

    # --- RETORNO ---
    candidates = clean_float_values(candidates)
    recommendations = candidates.sort_values(by='predicted_score', ascending=False)
    
    available_cols = [c for c in final_columns if c in recommendations.columns]
    
    # Deduplicar por título normalizado
    recommendations = recommendations.drop_duplicates(subset=['title_norm'], keep='first')
    
    top_50_pool = recommendations[available_cols].head(50)
    result = top_50_pool.sample(n=min(12, len(top_50_pool))) if not top_50_pool.empty else top_50_pool
    
    if len(result) < 12:
        remaining = recommendations[~recommendations['title_norm'].isin(result['title_norm'])][available_cols]
        result = pd.concat([result, remaining.head(12 - len(result))], ignore_index=True)
        
    result = clean_float_values(result)
    if 'imdb' in result.columns: result['imdb'] = result['imdb'].apply(lambda x: str(x) if x is not None else None)
    
    print(f"✅ Recomendaciones generadas. Modo: {mode_label}")
    return result

# --- ENDPOINTS ---

@app.get("/recommendations")
def get_recommendations(email: str = Query(...), profile_name: str = Query(...)):
    try:
        dfmovies = load_movies_from_mongodb()
        dfopiniones = load_interactions_from_mongodb()
        
        if dfmovies.empty: raise HTTPException(status_code=500, detail="No se pudieron cargar las películas")
        
        final_table = prepare_data(dfmovies, dfopiniones)
        recs = recommend_movies(final_table, dfmovies, email, profile_name)
        
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