import React, { useRef, useState } from 'react';
import MovieCard from './MovieCard';
import './MovieCarousel.css';

const MovieCarousel = ({ movies, title, onMovieClick, isRecommendation = false }) => {
    const carouselRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    if (!movies || movies.length === 0) return null;

    const scroll = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = carouselRef.current.offsetWidth * 0.8;
            const newScrollPosition = carouselRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            
            carouselRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    return (
        <div className="carousel-container">
            {title && (
                <h2 className={`carousel-title ${isRecommendation ? 'recommendation' : ''}`}>
                    {title}
                </h2>
            )}
            <div className="carousel-wrapper">
                {showLeftArrow && (
                    <button
                        className="carousel-arrow carousel-arrow-left"
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                    </button>
                )}
                
                <div
                    ref={carouselRef}
                    className="carousel-track"
                    onScroll={handleScroll}
                >
                    {movies.map((movie, index) => (
                        <div key={movie._id?.$oid || movie._id || movie.movie_id_str || index} className="carousel-item">
                            <MovieCard
                                movie={movie}
                                onClick={onMovieClick}
                                isRecommendation={isRecommendation}
                            />
                        </div>
                    ))}
                </div>

                {showRightArrow && (
                    <button
                        className="carousel-arrow carousel-arrow-right"
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default MovieCarousel;
