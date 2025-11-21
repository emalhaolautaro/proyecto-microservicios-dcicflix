import React, { useState, useEffect } from 'react';
import IntroAnimation from './components/IntroAnimation';
import Login from './components/Login';
import ProfileSelector from './components/ProfileSelector';
import './index.css';

function App() {
  // --- ESTADOS GLOBALES ---
  const [showIntro, setShowIntro] = useState(true);
  
  // Estados de Autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfiles, setUserProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null); // null = Selector, Object = Home

  // Estados de Datos (Películas)
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- HANDLERS ---

  const handleLoginSuccess = (profiles, token) => {
    console.log("Login exitoso. Perfiles cargados:", profiles);
    // Aquí podrías guardar el token en localStorage si quisieras persistencia
    // localStorage.setItem('token', token);
    setUserProfiles(profiles);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // "Cerrar sesión" del perfil actual para volver al selector
    setCurrentProfile(null);
    setMovies([]);
  };

  const handleFullLogout = () => {
    // Volver a pantalla de login
    setIsLoggedIn(false);
    setCurrentProfile(null);
    setUserProfiles([]);
  };

  // --- EFECTOS ---

  // Cargar películas SOLO cuando hay un perfil seleccionado y la intro terminó
  useEffect(() => {
    if (!showIntro && isLoggedIn && currentProfile) {
      setLoading(true);
      
      // Simulamos un pequeño delay de "conexión segura"
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

  // --- RENDERIZADO ---

  return (
    <div>
      {/* 1. ANIMACIÓN INTRO */}
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      {/* 2. PANTALLA DE LOGIN (Si no hay intro y no está logueado) */}
      {!showIntro && !isLoggedIn && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {/* 3. SELECTOR DE PERFILES (Logueado, pero sin perfil elegido) */}
      {!showIntro && isLoggedIn && !currentProfile && (
        <div style={{ position: 'relative' }}>
            {/* Botón para volver al Login completo */}
            <button 
                onClick={handleFullLogout}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: '1px solid #333', color: '#666', cursor: 'pointer', padding: '5px 10px', zIndex: 10 }}
            >
                Cerrar Sesión Global
            </button>
            <ProfileSelector profiles={userProfiles} onSelectProfile={setCurrentProfile} />
        </div>
      )}

      {/* 4. APP PRINCIPAL / HOME (Logueado y con perfil) */}
      {/* AQUÍ RECUPERAMOS EL CÓDIGO VIEJO DEL GRID */}
      {!showIntro && isLoggedIn && currentProfile && (
        <div className="fade-in" style={{ padding: '2rem' }}>
          
          {/* HEADER ORIGINAL MODIFICADO CON DATOS DINÁMICOS */}
          <header style={{ borderBottom: '1px solid #00f3ff', marginBottom: '2rem', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="hacker-font neon-blue" style={{ fontSize: '2.5rem', margin: 0 }}>
              DCIC<span style={{ color: 'white' }}>FLIX</span>
            </h1>
            
            {/* Sección de Usuario a la derecha */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontFamily: 'monospace', color: '#888', textAlign: 'right', lineHeight: '1.2' }}>
                    <div>Usuario: <span style={{ color: '#00f3ff', fontWeight: 'bold' }}>{currentProfile.name}</span></div>
                    <div 
                        onClick={handleLogout} 
                        style={{ fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', color: '#555' }}
                        onMouseEnter={(e) => e.target.style.color = 'white'}
                        onMouseLeave={(e) => e.target.style.color = '#555'}
                    >
                        &lt; Cambiar Perfil
                    </div>
                </div>
                {/* Avatar del perfil */}
                <img 
                    src={currentProfile.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=default"} 
                    alt="Avatar"
                    style={{ width: '45px', height: '45px', borderRadius: '5px', border: '2px solid #00f3ff' }}
                />
            </div>
          </header>

          <main>
            <h2 className="hacker-font" style={{ color: '#ccc' }}>&gt; Películas Recomendadas</h2>
            
            {loading && <p style={{color: '#00f3ff', fontFamily: 'monospace'}}>Estableciendo enlace seguro...</p>}

            {/* GRID ORIGINAL DE PELÍCULAS */}
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
                    title={movie.plot}
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
                    {imagen ? (
                      <img 
                        src={imagen} 
                        alt={titulo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}

                    <div style={{ 
                      display: imagen ? 'none' : 'flex',
                      width: '100%', height: '100%', 
                      flexDirection: 'column',
                      justifyContent: 'center', alignItems: 'center', 
                      textAlign: 'center', padding: '10px', color: '#555' 
                    }}>
                      <span style={{fontSize: '2rem'}}>🎬</span>
                      <span className="hacker-font" style={{marginTop: '10px'}}>{titulo}</span>
                    </div>

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
                      fontFamily: '"VT323", monospace',
                      fontSize: '1.1rem'
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
    </div>
  );
}

export default App;