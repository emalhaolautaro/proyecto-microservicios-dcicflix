import React, { useState, useEffect } from 'react';

function UserRatings({ currentProfile, onClose, onMovieClick }) {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/ratings/user/${encodeURIComponent(currentProfile.userEmail)}/profile/${encodeURIComponent(currentProfile.name)}`
      );
      const data = await response.json();
      console.log("Calificaciones recibidas:", data);
      setRatings(data.ratings || []);
    } catch (error) {
      console.error("Error cargando calificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas directamente desde las calificaciones del usuario
  const userStats = {
    total: ratings.length,
    average: ratings.length > 0 
      ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(1)
      : 0
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (score) => {
    return Array.from({ length: 10 }, (_, i) => (
      <span 
        key={i}
        style={{
          color: i < score ? '#f5c518' : '#333',
          fontSize: '1.2rem'
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
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
          maxWidth: '1000px',
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

        {/* Header */}
        <div style={{ 
          padding: '30px', 
          borderBottom: '1px solid #00f3ff'
        }}>
          <h2 className="hacker-font neon-blue" style={{ fontSize: '2rem', marginBottom: '10px' }}>
            MIS CALIFICACIONES
          </h2>
          <p style={{ color: '#888', fontFamily: 'monospace', fontSize: '0.9rem' }}>
            Perfil: <span style={{ color: '#00f3ff' }}>{currentProfile.name}</span>
          </p>

          {/* Estadísticas del usuario */}
          {!loading && userStats.total > 0 && (
            <div style={{
              display: 'flex',
              gap: '20px',
              marginTop: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                background: '#111',
                border: '1px solid #00f3ff',
                padding: '10px 15px',
                borderRadius: '5px',
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}>
                <div style={{ color: '#888' }}>Películas Calificadas</div>
                <div style={{ color: '#00f3ff', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {userStats.total}
                </div>
              </div>
              <div style={{
                background: '#111',
                border: '1px solid #00f3ff',
                padding: '10px 15px',
                borderRadius: '5px',
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}>
                <div style={{ color: '#888' }}>Tu Promedio</div>
                <div style={{ color: '#f5c518', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  ★ {userStats.average}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div style={{ padding: '30px' }}>
          {loading && (
            <p style={{ color: '#00f3ff', fontFamily: 'monospace', textAlign: 'center' }}>
              Cargando calificaciones...
            </p>
          )}

          {!loading && ratings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#888', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                Aún no has calificado ninguna película
              </p>
              <p style={{ color: '#555', fontFamily: 'monospace', fontSize: '0.9rem', marginTop: '10px' }}>
                ¡Comienza a calificar películas para ver tu historial aquí!
              </p>
            </div>
          )}

          {!loading && ratings.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {ratings.map((rating, index) => (
                <div
                  key={index}
                  style={{
                    background: '#111',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#00f3ff';
                    e.currentTarget.style.background = '#151515';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#333';
                    e.currentTarget.style.background = '#111';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      color: '#00f3ff', 
                      fontFamily: 'monospace', 
                      fontSize: '1.1rem',
                      marginBottom: '5px'
                    }}>
                      {rating.movie_title}
                    </h3>
                    <p style={{ 
                      color: '#666', 
                      fontFamily: 'monospace', 
                      fontSize: '0.8rem'
                    }}>
                      {formatDate(rating.timestamp)}
                    </p>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {renderStars(rating.score)}
                    </div>
                    <div style={{ 
                      color: '#f5c518', 
                      fontFamily: 'monospace', 
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}>
                      {rating.score}/10
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default UserRatings;