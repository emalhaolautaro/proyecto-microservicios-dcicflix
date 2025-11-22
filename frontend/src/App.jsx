import React, { useState, useEffect } from 'react';
import IntroAnimation from './components/IntroAnimation';
import Login from './components/Login';
import ProfileSelector from './components/ProfileSelector';
import MovieDetail from './components/MovieDetail';
import './index.css';

function App() {
  // --- ESTADOS ---
  const [showIntro, setShowIntro] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfiles, setUserProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null); // <--- NUEVO: email real del usuario logueado

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);

  // --- LOGIN ---
  const handleLoginSuccess = (profiles, token, email) => {
    console.log("Login exitoso. Perfiles cargados:", profiles);

    // Guardamos el email real del usuario
    setUserEmail(email);

    // Le agregamos ese email a cada perfil
    const profilesWithEmail = profiles.map((p, idx) => ({
      id: p._id || `profile_${idx}`,
      name: p.name,
      avatar: p.avatar,
      isKid: p.isKid,
      userEmail: email // <--- AHORA SÍ CORRECTO
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

  // --- EFECTO: Carga películas ---
  useEffect(() => {
    if (!showIntro && isLoggedIn && currentProfile) {
      setLoading(true);

      setTimeout(() => {
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
            userEmail={userEmail}  // <--- MUY IMPORTANTE ✔
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
            <h2 className="hacker-font" style={{ color: '#ccc' }}>
              &gt; Películas Recomendadas
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
    </div>
  );
}

export default App;