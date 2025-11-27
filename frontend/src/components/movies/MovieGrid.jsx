import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, onMovieClick, isRecommendation = false }) => {
    if (!movies || movies.length === 0) return null;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '25px',
            marginTop: '20px'
        }}>
            {movies.map((movie, index) => (
                <MovieCard
                    key={movie._id?.$oid || movie._id || movie.movie_id_str || index}
                    movie={movie}
                    onClick={onMovieClick}
                    isRecommendation={isRecommendation}
                />
            ))}
        </div>
    );
};

export default MovieGrid;
