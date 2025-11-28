import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import SearchBar from '../components/ui/SearchBar';
import MovieGrid from '../components/movies/MovieGrid';
import MovieCarousel from '../components/movies/MovieCarousel';
import MovieDetail from '../components/movies/MovieDetail';
import UserRatings from '../components/ui/UserRatings';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useMovies } from '../hooks/useMovies';
import { useRecommendations } from '../hooks/useRecommendations';

const DashboardPage = () => {
    const { userEmail, logout } = useAuth();
    const { currentProfile, clearProfile } = useProfile();

    const {
        movies, loading, searchQuery, setSearchQuery, isSearching,
        handleSearch, clearSearch, loadRandom
    } = useMovies();

    const {
        recommendations, loadingRecommendations, loadRecommendations
    } = useRecommendations(userEmail, currentProfile);


    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showRatings, setShowRatings] = useState(false);

    useEffect(() => {
        loadRandom();
        loadRecommendations();
    }, [loadRandom, loadRecommendations]);

    const handleLogout = () => {
        clearProfile();
    };

    return (
        <div className="fade-in" style={{ padding: '2rem' }}>
            <Header
                currentProfile={currentProfile}
                onLogout={logout} // Logout global
                onChangeProfile={handleLogout} // Volver a selección de perfil
                onShowRatings={() => setShowRatings(true)}
                onFilterLanguage={loadRandom}
            />

            <main>
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearch={handleSearch}
                    onClear={clearSearch}
                    isSearching={isSearching}
                />

                {isSearching ? (
                    <>
                        <h2 className="hacker-font" style={{ color: '#ccc' }}>
                            {`> Resultados de búsqueda (${movies.length})`}
                        </h2>
                        {loading && (
                            <p style={{ color: '#00f3ff', fontFamily: 'monospace' }}>
                                Estableciendo enlace seguro...
                            </p>
                        )}
                        <MovieGrid movies={movies} onMovieClick={setSelectedMovie} />
                    </>
                ) : (
                    <>
                        {loading && (
                            <p style={{ color: '#00f3ff', fontFamily: 'monospace' }}>
                                Estableciendo enlace seguro...
                            </p>
                        )}
                        <MovieCarousel 
                            movies={movies} 
                            title="> Películas Destacadas"
                            onMovieClick={setSelectedMovie} 
                        />
                    </>
                )}

                {/* RECOMENDACIONES PERSONALIZADAS */}
                {!isSearching && (
                    <>
                        {loadingRecommendations && (
                            <p style={{ color: '#00f3ff', fontFamily: 'monospace' }}>
                                Analizando preferencias...
                            </p>
                        )}

                        {recommendations.length === 0 && !loadingRecommendations && (
                            <p style={{ color: '#888', fontFamily: 'monospace' }}>
                                No hay recomendaciones disponibles en este momento.
                            </p>
                        )}

                        {recommendations.length > 0 && (
                            <MovieCarousel
                                movies={recommendations}
                                title="> Creemos que podría interesarte..."
                                onMovieClick={setSelectedMovie}
                                isRecommendation={true}
                            />
                        )}
                    </>
                )}
            </main>

            {selectedMovie && (
                <MovieDetail
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                    currentProfile={currentProfile}
                />
            )}

            {showRatings && currentProfile && (
                <UserRatings
                    currentProfile={currentProfile}
                    onClose={() => setShowRatings(false)}
                    onMovieClick={setSelectedMovie}
                />
            )}
        </div>
    );
};

export default DashboardPage;
