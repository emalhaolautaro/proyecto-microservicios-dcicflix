import React from 'react';

const NoImageIcon = ({ color = '#00f3ff' }) => (
    <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 200 300" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ background: '#0a0a0a' }}
    >
        <rect x="50" y="80" width="100" height="100" stroke={color} strokeWidth="2" fill="none" strokeDasharray="5,5"/>
        <circle cx="75" cy="110" r="8" fill={color} opacity="0.5"/>
        <path d="M 60 150 L 80 130 L 100 145 L 130 115 L 140 125" stroke={color} strokeWidth="2" fill="none"/>
        <text x="100" y="200" fontFamily="VT323, monospace" fontSize="16" fill={color} textAnchor="middle" opacity="0.7">
            NO IMAGE
        </text>
        <text x="100" y="220" fontFamily="VT323, monospace" fontSize="14" fill={color} textAnchor="middle" opacity="0.5">
            AVAILABLE
        </text>
    </svg>
);

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
            <img
                src={imagen || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}
                alt={titulo}
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    display: imagen ? 'block' : 'none'
                }}
                onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.nextElementSibling;
                    if (fallback) fallback.style.display = 'block';
                }}
            />
            
            <div 
                className="no-image-fallback" 
                style={{ 
                    display: !imagen ? 'block' : 'none',
                    width: '100%', 
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}
            >
                <NoImageIcon color={isRecommendation ? '#ff00ff' : '#00f3ff'} />
            </div>

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
