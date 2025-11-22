import React, { useState } from 'react';

function StarRating({ rating, onRatingChange }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    onRatingChange(value);
  };

  const handleMouseEnter = (value) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => {
        const isFilled = value <= (hoverRating || rating);
        
        return (
          <button
            key={value}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '2rem',
              padding: '3px',
              transition: 'all 0.2s',
              color: isFilled ? '#f5c518' : '#333',
              textShadow: isFilled ? '0 0 10px rgba(245, 197, 24, 0.8)' : 'none',
              transform: hoverRating === value ? 'scale(1.2)' : 'scale(1)',
            }}
            aria-label={`Calificar con ${value} estrella${value > 1 ? 's' : ''}`}
          >
            {isFilled ? '★' : '☆'}
          </button>
        );
      })}
      
      {rating > 0 && (
        <span style={{
          marginLeft: '10px',
          color: '#00f3ff',
          fontFamily: 'monospace',
          fontSize: '1.3rem',
          fontWeight: 'bold',
          minWidth: '60px'
        }}>
          {rating}/10
        </span>
      )}
    </div>
  );
}

export default StarRating;