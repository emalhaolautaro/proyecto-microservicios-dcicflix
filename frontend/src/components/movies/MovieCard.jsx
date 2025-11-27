import React from 'react';

const MovieCard = ({ movie, onClick, isRecommendation = false }) => {
    const uniqueId = movie._id?.$oid || movie._id || movie.movie_id_str;
    const titulo = movie.title;
    const imagen = movie.poster;

    // Lógica unificada para obtener el rating
    let rating = "N/A";
    if (movie.imdb_rating !== undefined && movie.imdb_rating !== null) {
        rating = movie.imdb_rating;
    } else if (movie.imdb?.rating?.$numberDouble) {
        rating = movie.imdb.rating.$numberDouble;
    } else if (movie.imdb?.rating) {
        rating = movie.imdb.rating;
    } else if (movie.average_imdb_rating) {
        rating = movie.average_imdb_rating;
    }

    const borderColor = isRecommendation ? '#ff00ff' : '#333';
    const hoverColor = isRecommendation ? 'rgba(255, 0, 255, 0.3)' : 'rgba(0, 243, 255, 0.3)';
    const badgeColor = isRecommendation ? '#ff00ff' : '#f5c518';
    const badgeTextColor = 'black';
    const titleBorderColor = isRecommendation ? '#ff00ff' : '#00f3ff';
    const titleColor = isRecommendation ? '#ff00ff' : '#00f3ff';

    return (
        <div
            onClick={() => onClick(movie)}
            style={{
                backgroundColor: '#111',
                border: `1px solid ${borderColor}`,
                aspectRatio: '2/3',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = isRecommendation ? '#ff00ff' : '#00f3ff';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.zIndex = '10';
                e.currentTarget.style.boxShadow = `0 0 15px ${hoverColor}`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = borderColor;
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.zIndex = '1';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {imagen && (
                <img
                    src={imagen}
                    alt={titulo}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            )}

            <div style={{
                position: 'absolute', top: '5px', right: '5px',
                background: badgeColor, color: badgeTextColor,
                fontWeight: 'bold', fontSize: '0.8rem',
                padding: '2px 5px', borderRadius: '3px',
                fontFamily: 'sans-serif'
            }}>
                ★ {rating}
            </div>

            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,0.85)',
                borderTop: `1px solid ${titleBorderColor}`,
                color: titleColor,
                padding: '8px', textAlign: 'center',
                fontFamily: '"VT323", monospace', fontSize: '1.1rem'
            }}>
                {titulo}
            </div>
        </div>
    );
};

export default MovieCard;
