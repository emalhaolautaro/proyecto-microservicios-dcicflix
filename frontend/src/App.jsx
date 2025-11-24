import React, { useState, useEffect } from 'react';
import IntroAnimation from './components/IntroAnimation';
import Login from './components/Login';
import ProfileSelector from './components/ProfileSelector';
import MovieDetail from './components/MovieDetail';
import UserRatings from './components/UserRatings';
import './index.css';

function App() {
  // --- ESTADOS ---
  const [showIntro, setShowIntro] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfiles, setUserProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showRatings, setShowRatings] = useState(false);

  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // --- LOGIN ---
  const handleLoginSuccess = (profiles, token, email) => {
    console.log("Login exitoso. Perfiles cargados:", profiles);

    setUserEmail(email);

    const profilesWithEmail = profiles.map((p, idx) => ({
      id: p._id || `profile_${idx}`,
      name: p.name,
      avatar: p.avatar,
      isKid: p.isKid,
      userEmail: email
    }));

    setUserProfiles(profilesWithEmail);
    setAuthToken(token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentProfile(null);
    setMovies([]);
  };

  const handleFullLogout = () => {
    setIsLoggedIn(false);
    setCurrentProfile(null);
    setUserProfiles([]);
    setAuthToken(null);
    setUserEmail(null);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      loadRandomMovies();
      return;
    }

    setLoading(true);
    setIsSearching(true);

    fetch(`/search/${encodeURIComponent(searchQuery)}`)
      .then(res => res.json())
      .then(data => {
        console.log("Resultados de búsqueda:", data);
        setMovies(data.movies || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error buscando películas:", err);
        setLoading(false);
      });
  };

  const loadRandomMovies = () => {
    setLoading(true);
    fetch("/random")
      .then(res => res.json())
      .then(data => {
        console.log("Películas recibidas:", data);
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error conectando:", err);
        setLoading(false);
      });
  };

  const loadRecommendations = () => {
    if (!currentProfile || !userEmail) {
      console.log("No hay perfil o email");
      return;
    }

    setLoadingRecommendations(true);
    const params = new URLSearchParams({
      email: userEmail,
      profile_name: currentProfile.name
    });

    fetch(`/recommendations?${params}`)
      .then(res => res.json())
      .then(data => {
        console.log("Recomendaciones recibidas:", data);
        if (data.recommendations) {
          setRecommendations(data.recommendations);
        }
        setLoadingRecommendations(false);
      })
      .catch(err => {
        console.error("Error cargando recomendaciones:", err);
        setLoadingRecommendations(false);
      });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    loadRandomMovies();
  };

  // --- EFECTO: Carga películas ---
  useEffect(() => {
    if (!showIntro && isLoggedIn && currentProfile) {
      setTimeout(() => {
        loadRandomMovies();
        loadRecommendations();
      }, 500);
    }
  }, [showIntro, isLoggedIn, currentProfile]);

  // --- RENDER ---
  return (
    <div>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      {!showIntro && !isLoggedIn && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {!showIntro && isLoggedIn && !currentProfile && (
        <div style={{ position: 'relative' }}>
          <button 
            onClick={handleFullLogout}
            style={{ 
              position: 'absolute', top: '20px', right: '20px',
              background: 'transparent', border: '1px solid #333',
              color: '#666', cursor: 'pointer', padding: '5px 10px', zIndex: 10
            }}
          >
            Cerrar Sesión Global
          </button>

          <ProfileSelector 
            profiles={userProfiles}
            onSelectProfile={setCurrentProfile}
            token={authToken}
            userEmail={userEmail}
          />
        </div>
      )}

      {!showIntro && isLoggedIn && currentProfile && (
        <div className="fade-in" style={{ padding: '2rem' }}>
          
          <header style={{ 
            borderBottom: '1px solid #00f3ff',
            marginBottom: '2rem', paddingBottom: '1rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h1 className="hacker-font neon-blue" style={{ fontSize: '2.5rem', margin: 0 }}>
              DCIC<span style={{ color: 'white' }}>FLIX</span>
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button
                onClick={() => setShowRatings(true)}
                style={{
                  background: 'transparent',
                  border: '1px solid #00f3ff',
                  color: '#00f3ff',
                  padding: '8px 15px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  borderRadius: '5px',
                  transition: 'all 0.2s'
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
                ★ MIS CALIFICACIONES
              </button>
              <div style={{ fontFamily: 'monospace', color: '#888', textAlign: 'right', lineHeight: '1.2' }}>
                <div>
                  Usuario: <span style={{ color: '#00f3ff', fontWeight: 'bold' }}>
                    {currentProfile.name}
                  </span>
                </div>
                <div 
                  onClick={handleLogout}
                  style={{
                    fontSize: '0.8rem', cursor: 'pointer',
                    textDecoration: 'underline', color: '#555'
                  }}
                >
                  &lt; Cambiar Perfil
                </div>
              </div>

              <img 
                src={currentProfile.avatar} 
                alt="Avatar"
                style={{
                  width: '45px', height: '45px',
                  borderRadius: '5px', border: '2px solid #00f3ff'
                }}
              />
            </div>
          </header>

          <main>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <input
                  type="text"
                  placeholder="Buscar película..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    flex: 1,
                    padding: '10px 15px',
                    background: '#111',
                    border: '1px solid #00f3ff',
                    color: '#00f3ff',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleSearch}
                  style={{
                    padding: '10px 20px',
                    background: '#00f3ff',
                    color: '#000',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  BUSCAR
                </button>
                {isSearching && (
                  <button
                    onClick={handleClearSearch}
                    style={{
                      padding: '10px 20px',
                      background: 'transparent',
                      color: '#00f3ff',
                      border: '1px solid #00f3ff',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontSize: '1rem'
                    }}
                  >
                    LIMPIAR
                  </button>
                )}
              </div>
            </div>

            <h2 className="hacker-font" style={{ color: '#ccc' }}>
              {isSearching ? `> Resultados de búsqueda (${movies.length})` : '> Películas Recomendadas'}
            </h2>

            {loading && (
              <p style={{ color: '#00f3ff', fontFamily: 'monospace' }}>
                Estableciendo enlace seguro...
              </p>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '25px',
              marginTop: '20px'
            }}>
              
              {movies.map((movie, index) => {
                const uniqueId = movie._id?.$oid || movie._id || index;
                const titulo = movie.title;
                const imagen = movie.poster; 
                const rating = movie.imdb?.rating?.$numberDouble || movie.imdb?.rating || "N/A";

                return (
                  <div
                    key={uniqueId}
                    onClick={() => handleMovieClick(movie)}
                    style={{
                      backgroundColor: '#111',
                      border: '1px solid #333',
                      aspectRatio: '2/3',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#00f3ff';
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.zIndex = '10';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#333';
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
                      background: '#f5c518', color: 'black',
                      fontWeight: 'bold', fontSize: '0.8rem',
                      padding: '2px 5px', borderRadius: '3px',
                      fontFamily: 'sans-serif'
                    }}>
                      ★ {rating}
                    </div>

                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'rgba(0,0,0,0.85)',
                      borderTop: '1px solid #00f3ff',
                      color: '#00f3ff',
                      padding: '8px', textAlign: 'center',
                      fontFamily: '"VT323", monospace', fontSize: '1.1rem'
                    }}>
                      {titulo}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RECOMENDACIONES PERSONALIZADAS */}
            <h2 className="hacker-font" style={{ color: '#ccc', marginTop: '3rem' }}>
              {`> Creemos que podría interesarte...`}
            </h2>

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
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '25px',
                marginTop: '20px'
              }}>
                
                {recommendations.map((movie, index) => {
                  const uniqueId = movie.movie_id_str || index;
                  const titulo = movie.title;
                  const imagen = movie.poster;
                  
                  // Cálculo de rating para mostrar en la tarjeta
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

                  return (
                    <div
                      key={uniqueId}
                      onClick={() => handleMovieClick(movie)}
                      style={{
                        backgroundColor: '#111',
                        border: '1px solid #ff00ff',
                        aspectRatio: '2/3',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.zIndex = '10';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
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

                      {/* --- AQUÍ AGREGUÉ DE NUEVO EL BADGE DE RATING --- */}
                      <div style={{
                        position: 'absolute', top: '5px', right: '5px',
                        background: '#ff00ff', color: 'black', // Color magenta para diferenciarlas
                        fontWeight: 'bold', fontSize: '0.8rem',
                        padding: '2px 5px', borderRadius: '3px',
                        fontFamily: 'sans-serif'
                      }}>
                        ★ {rating}
                      </div>
                      {/* ----------------------------------------------- */}

                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'rgba(0,0,0,0.85)',
                        borderTop: '2px solid #ff00ff',
                        color: '#ff00ff',
                        padding: '8px', textAlign: 'center',
                        fontFamily: '"VT323", monospace', fontSize: '1.1rem'
                      }}>
                        {titulo}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      )}

      {selectedMovie && (
        <MovieDetail 
          movie={selectedMovie}
          onClose={handleCloseModal}
          currentProfile={currentProfile}
        />
      )}

      {showRatings && currentProfile && (
        <UserRatings
          currentProfile={currentProfile}
          onClose={() => setShowRatings(false)}
          onMovieClick={handleMovieClick}
        />
      )}
    </div>
  );
}

export default App;