import React, { useEffect, useState } from 'react';

const IntroAnimation = ({ onComplete }) => {
  const [stage, setStage] = useState('entering'); // entering | waiting | zooming

  useEffect(() => {
    // 1. Fase de espera
    const timer1 = setTimeout(() => setStage('waiting'), 1000);
    // 2. Fase de Zoom gigante
    const timer2 = setTimeout(() => setStage('zooming'), 2500);
    // 3. Fin
    const timer3 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3200);

    return () => {
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3);
    };
  }, [onComplete]);

  // Estilos dinámicos para el zoom
  const containerStyle = {
    backgroundColor: '#000000',
    zIndex: 9999,
  };

  const textStyle = {
    fontSize: 'clamp(4rem, 15vw, 10rem)', // Responsivo
    letterSpacing: '0.5rem',
    transition: 'transform 0.7s ease-in, opacity 0.7s ease-in',
    // Si estamos en etapa 'zooming', aplicamos la escala gigante
    transform: stage === 'zooming' ? 'scale(50)' : 'scale(1)',
    opacity: stage === 'zooming' ? 0 : 1
  };

  return (
    <div className="full-screen flex-center" style={containerStyle}>
      <div className="hacker-font" style={textStyle}>
        {/* Parte 'DCIC' con Neon Azul */}
        <span className="neon-blue">DCIC</span>
        
        {/* Parte 'FLIX' con parpadeo */}
        <span style={{ color: '#e0e0e0', marginLeft: '5px' }} className="animate-flicker">
          FLIX
        </span>
      </div>
    </div>
  );
};

export default IntroAnimation;