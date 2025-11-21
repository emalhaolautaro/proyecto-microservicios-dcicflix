import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8002/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setTimeout(() => {
          onLoginSuccess(data.user.profiles, data.token);
        }, 800);
      } else {
        setError(data.message || 'Acceso denegado');
        setLoading(false);
      }
    } catch (err) {
      setError('Error de conexión al mainframe');
      setLoading(false);
    }
  };

  // Estilos reutilizables
  const inputStyle = {
    boxSizing: 'border-box', // <--- CRUCIAL: Asegura que el padding no rompa el ancho
    padding: '15px',
    background: 'rgba(0, 0, 0, 0.7)', 
    border: '1px solid #00f3ff', // Borde simétrico para balance visual perfecto
    borderRadius: '5px', // Pequeño redondeo para que coincida con el contenedor
    color: '#00f3ff',
    fontFamily: 'monospace',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    width: '100%', 
    textAlign: 'center', // Texto centrado
    caretColor: '#00f3ff'
  };

  // Estilo para los Labels
  const labelStyle = {
    display: 'block',
    color: '#00f3ff', 
    fontSize: '0.9rem',
    marginBottom: '10px',
    fontFamily: 'monospace',
    textAlign: 'center', // Label centrado
    fontWeight: 'bold',
    letterSpacing: '2px', 
    textShadow: '0 0 8px rgba(0, 243, 255, 0.6)', 
    textTransform: 'uppercase'
  };

  return (
    <div className="full-screen flex-center" style={{ 
      flexDirection: 'column', 
      background: '#000', 
      backgroundImage: 'radial-gradient(circle at center, #112 0%, #000 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Estilos globales para corregir el autocompletado del navegador */}
      <style>
        {`
          * {
            box-sizing: border-box; /* Asegura cálculo de medidas correcto en todo */
          }
          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus, 
          input:-webkit-autofill:active  {
            -webkit-box-shadow: 0 0 0 30px #050505 inset !important;
            -webkit-text-fill-color: #00f3ff !important;
            transition: background-color 5000s ease-in-out 0s;
            text-align: center !important;
          }
          ::placeholder {
            color: #445566;
            opacity: 1; 
            text-align: center;
          }
        `}
      </style>

      {/* Fondo Grid decorativo */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%', 
        background: 'linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px', zIndex: 0, pointerEvents: 'none'
      }}></div>

      {/* CONTENEDOR PRINCIPAL (TARJETA) */}
      <div style={{ 
        zIndex: 1, 
        padding: '3rem', 
        border: '2px solid #00f3ff',
        borderRadius: '20px',
        boxShadow: '0 0 30px rgba(0, 243, 255, 0.15), inset 0 0 20px rgba(0, 243, 255, 0.1)',
        backgroundColor: 'rgba(0,0,0,0.85)',
        maxWidth: '450px',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center' // Asegura centrado vertical del contenido
      }}>
        <h1 className="hacker-font neon-blue" style={{ 
          textAlign: 'center', 
          marginBottom: '2rem', 
          fontSize: '2rem',
          fontFamily: 'monospace',
          letterSpacing: '3px',
          color: '#00f3ff',
          textShadow: '0 0 10px #00f3ff',
          width: '100%'
        }}>
          ACCESS<span style={{ color: 'white', textShadow: 'none' }}>_CONTROL</span>
        </h1>
        
        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem', 
          width: '100%',
          alignItems: 'center'
        }}>
          
          <div style={{ width: '100%', textAlign: 'center' }}>
            <label style={labelStyle}>Identificador de Usuario</label>
            <input 
              type="email" 
              placeholder="user@dcicflix.com" 
              value={email} onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.boxShadow = '0 0 15px rgba(0,243,255,0.6)'; e.target.style.background = 'rgba(0, 243, 255, 0.05)'; }}
              onBlur={(e) => { e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(0, 0, 0, 0.7)'; }}
            />
          </div>

          <div style={{ width: '100%', textAlign: 'center' }}>
            <label style={labelStyle}>Clave de Acceso</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.boxShadow = '0 0 15px rgba(0,243,255,0.6)'; e.target.style.background = 'rgba(0, 243, 255, 0.05)'; }}
              onBlur={(e) => { e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(0, 0, 0, 0.7)'; }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '1rem',
              padding: '15px 30px', 
              width: '100%',
              background: loading ? '#333' : 'transparent', 
              color: loading ? '#888' : '#00f3ff', 
              border: '1px solid #00f3ff',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              letterSpacing: '3px',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 0 10px rgba(0, 243, 255, 0.1)',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => { if(!loading) { e.target.style.background = '#00f3ff'; e.target.style.color = '#000'; e.target.style.boxShadow = '0 0 25px rgba(0, 243, 255, 0.6)'; } }}
            onMouseLeave={(e) => { if(!loading) { e.target.style.background = 'transparent'; e.target.style.color = '#00f3ff'; e.target.style.boxShadow = '0 0 10px rgba(0, 243, 255, 0.1)'; } }}
          >
            {loading ? 'DESENCRIPTANDO...' : 'INICIAR_SESIÓN >'}
          </button>
        </form>
        
        {error && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '10px', 
            width: '100%',
            background: 'rgba(255, 0, 0, 0.1)', 
            border: '1px solid red', 
            borderRadius: '5px',
            color: '#ff5555', 
            textAlign: 'center',
            fontFamily: 'monospace',
            boxShadow: '0 0 10px rgba(255, 0, 0, 0.2)'
          }}>
            ⚠ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;