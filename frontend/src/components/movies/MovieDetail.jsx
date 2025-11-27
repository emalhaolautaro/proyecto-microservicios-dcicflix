import React, { useState } from 'react';
import StarRating from '../ui/StarRating';

function MovieDetail({ movie, onClose, currentProfile }) {
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSubmitRating = async () => {
        if (rating === 0) {
            alert("Por favor selecciona una calificación");
            return;
        }

        console.log("🔍 DEBUG currentProfile:", currentProfile);
        console.log("🔍 DEBUG movie:", movie);

        setIsSubmitting(true);

        try {
            // Extraer correctamente el movie_id desde múltiples fuentes
            let movieId = null;

            // Primero intentar con movie_id_str (del recomendador)
            if (movie.movie_id_str) {
                movieId = movie.movie_id_str;
            }
            // Si viene como objeto con $oid (formato MongoDB search/random)
            else if (typeof movie._id === 'object' && movie._id !== null && movie._id.$oid) {
                movieId = movie._id.$oid;
            }
            // Si _id es un string directo
            else if (typeof movie._id === 'string') {
                movieId = movie._id;
            }

            if (!movieId) {
                console.error("❌ No se pudo extraer movie_id. Movie object:", movie);
                alert("Error: No se puede identificar la película. Por favor recarga la página.");
                return;
            }

            const payload = {
                user_id: currentProfile.userEmail || 'unknown',
                profile_id: currentProfile.id,
                profile_name: currentProfile.name,
                movie_id: movieId,
                movie_title: movie.title,
                score: rating
            };

            console.log("📤 Enviando payload:", payload);

            const response = await fetch('/calificar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log("✅ Calificación enviada exitosamente:", responseData);
                setSubmitSuccess(true);
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                console.error("❌ Error response:", responseData);
                alert("Error al enviar calificación: " + (responseData.error || response.statusText));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Extraer rating desde múltiples posibles ubicaciones
    let movieRating = "N/A";
    if (movie.imdb_rating !== undefined && movie.imdb_rating !== null) {
        movieRating = movie.imdb_rating;
    } else if (movie.imdb?.rating?.$numberDouble) {
        movieRating = movie.imdb.rating.$numberDouble;
    } else if (movie.imdb?.rating) {
        movieRating = movie.imdb.rating;
    }

    const year = movie.year || "N/A";
    const runtime = movie.runtime || "N/A";

    // Procesar géneros: vienen como string separado por comas desde MongoDB
    let genresArray = [];
    if (movie.genres) {
        if (Array.isArray(movie.genres)) {
            genresArray = movie.genres;
        } else if (typeof movie.genres === 'string') {
            genresArray = movie.genres.split(',').map(g => g.trim()).filter(g => g);
        }
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '20px',
                animation: 'fadeIn 0.3s ease-in'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#0a0a0a',
                    border: '2px solid #00f3ff',
                    borderRadius: '10px',
                    maxWidth: '800px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative',
                    boxShadow: '0 0 30px rgba(0, 243, 255, 0.5)',
                    animation: 'slideIn 0.3s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'transparent',
                        border: '1px solid #00f3ff',
                        color: '#00f3ff',
                        fontSize: '1.5rem',
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        zIndex: 10
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = '#00f3ff';
                        e.target.style.color = 'black';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#00f3ff';
                    }}
                >
                    ✕
                </button>

                {/* Contenido */}
                <div style={{ display: 'flex', gap: '30px', padding: '30px', flexWrap: 'wrap' }}>
                    {/* Poster */}
                    <div style={{ flex: '0 0 250px' }}>
                        {movie.poster ? (
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                style={{
                                    width: '100%',
                                    borderRadius: '8px',
                                    border: '2px solid #333',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
                                }}
                            />
                        ) : (
                            <div style={{
                                width: '100%',
                                aspectRatio: '2/3',
                                background: '#111',
                                border: '2px solid #333',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '4rem'
                            }}>
                                🎬
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <h2 className="hacker-font neon-blue" style={{ fontSize: '2rem', marginBottom: '10px' }}>
                            {movie.title}
                        </h2>

                        <div style={{
                            fontFamily: 'monospace',
                            color: '#888',
                            marginBottom: '20px',
                            display: 'flex',
                            gap: '15px',
                            flexWrap: 'wrap'
                        }}>
                            <span>📅 {year}</span>
                            <span>⏱️ {runtime} min</span>
                            <span style={{ color: '#f5c518', fontWeight: 'bold' }}>
                                ⭐ {movieRating}
                            </span>
                        </div>

                        {/* Géneros */}
                        {genresArray.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                {genresArray.map((genre, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            display: 'inline-block',
                                            background: '#1a1a1a',
                                            border: '1px solid #00f3ff',
                                            color: '#00f3ff',
                                            padding: '3px 10px',
                                            borderRadius: '15px',
                                            fontSize: '0.85rem',
                                            marginRight: '8px',
                                            marginBottom: '8px',
                                            fontFamily: 'monospace'
                                        }}
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Match Reason - Recuadro Magenta */}
                        {movie.match_reason && (
                            <div style={{
                                marginBottom: '20px',
                                padding: '12px 15px',
                                background: 'rgba(255, 0, 255, 0.1)',
                                border: '2px solid #ff00ff',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>💡</span>
                                <div>
                                    <div style={{
                                        color: '#ff00ff',
                                        fontFamily: 'monospace',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        marginBottom: '3px'
                                    }}>
                                        ¿POR QUÉ TE LA RECOMENDAMOS?
                                    </div>
                                    <div style={{
                                        color: '#ffaaff',
                                        fontFamily: 'monospace',
                                        fontSize: '0.9rem'
                                    }}>
                                        {movie.match_reason}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Plot */}
                        {movie.plot && (
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ color: '#00f3ff', fontFamily: 'monospace', fontSize: '1rem', marginBottom: '8px' }}>
                                    &gt; SINOPSIS
                                </h3>
                                <p style={{
                                    color: '#ccc',
                                    lineHeight: '1.6',
                                    fontFamily: 'monospace',
                                    fontSize: '0.95rem'
                                }}>
                                    {movie.plot}
                                </p>
                            </div>
                        )}

                        {/* Director y Cast */}
                        <div style={{ marginBottom: '25px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                            {movie.directors && movie.directors.length > 0 && (
                                <div style={{ marginBottom: '8px' }}>
                                    <span style={{ color: '#00f3ff' }}>Director:</span>{' '}
                                    <span style={{ color: '#ccc' }}>{movie.directors.join(', ')}</span>
                                </div>
                            )}
                            {movie.cast && movie.cast.length > 0 && (
                                <div>
                                    <span style={{ color: '#00f3ff' }}>Cast:</span>{' '}
                                    <span style={{ color: '#ccc' }}>{movie.cast.slice(0, 3).join(', ')}</span>
                                </div>
                            )}
                        </div>

                        {/* Sistema de Calificación */}
                        <div style={{
                            background: '#111',
                            border: '2px solid #00f3ff',
                            borderRadius: '8px',
                            padding: '20px',
                            marginTop: '25px'
                        }}>
                            <h3 className="hacker-font" style={{
                                color: '#00f3ff',
                                marginBottom: '15px',
                                fontSize: '1.2rem'
                            }}>
                                &gt; TU CALIFICACIÓN
                            </h3>

                            <StarRating rating={rating} onRatingChange={setRating} />

                            {submitSuccess ? (
                                <div style={{
                                    marginTop: '15px',
                                    padding: '10px',
                                    background: '#00ff00',
                                    color: 'black',
                                    textAlign: 'center',
                                    borderRadius: '5px',
                                    fontWeight: 'bold',
                                    fontFamily: 'monospace'
                                }}>
                                    ✓ Calificación enviada exitosamente
                                </div>
                            ) : (
                                <button
                                    onClick={handleSubmitRating}
                                    disabled={isSubmitting || rating === 0}
                                    style={{
                                        marginTop: '15px',
                                        width: '100%',
                                        padding: '12px',
                                        background: rating === 0 ? '#333' : '#00f3ff',
                                        color: rating === 0 ? '#666' : 'black',
                                        border: 'none',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        cursor: rating === 0 ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        fontFamily: '"VT323", monospace'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (rating !== 0 && !isSubmitting) {
                                            e.target.style.background = '#00d4e6';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (rating !== 0 && !isSubmitting) {
                                            e.target.style.background = '#00f3ff';
                                        }
                                    }}
                                >
                                    {isSubmitting ? 'ENVIANDO...' : 'ENVIAR CALIFICACIÓN'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
            </div>
        </div>
    );
}

export default MovieDetail;