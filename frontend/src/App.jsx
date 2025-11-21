import React, { useState, useEffect } from 'react';
import IntroAnimation from './components/IntroAnimation';
import './index.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showIntro) {
      setLoading(true);
      
      // CAMBIO CLAVE: Usamos la ruta relativa "/random".
      // El proxy de Vite (vite.config.js) redirigirá esto a http://random-movies-service:8001/random
      fetch("/random")
        .then(res => res.json())
        .then(data => {
          console.log("Datos recibidos:", data);
          setMovies(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error conectando:", err);
          setLoading(false);
        });
    }
  }, [showIntro]);

  return (
    <div>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      {!showIntro && (
        <div className="fade-in" style={{ padding: '2rem' }}>
          
          <header style={{ borderBottom: '1px solid #00f3ff', marginBottom: '2rem', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="hacker-font neon-blue" style={{ fontSize: '2.5rem', margin: 0 }}>
              DCIC<span style={{ color: 'white' }}>FLIX</span>
            </h1>
            <div style={{ fontFamily: 'monospace', color: '#888' }}>
              Usuario: <span style={{ color: 'white' }}>Anonimo</span>
            </div>
          </header>

          <main>
            <h2 className="hacker-font" style={{ color: '#ccc' }}>&gt; Películas Recomendadas</h2>
            
            {loading && <p style={{color: '#00f3ff', fontFamily: 'monospace'}}>Estableciendo enlace seguro...</p>}

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
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00f3ff'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333'}
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