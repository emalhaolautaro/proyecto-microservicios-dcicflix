import React, { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Estados para Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Estados para Registro
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: loginEmail, 
          password: loginPassword 
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Adaptar los perfiles al formato que espera el frontend
        const profiles = data.user.profiles.map((p, idx) => ({
          id: p._id || `profile_${idx}`,
          name: p.name,
          avatar: p.avatar,
          isKid: p.isKid,
          userEmail: data.user.email 
        }));
        
        onLoginSuccess(data.user.profiles, data.token, data.user.email);
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Validaciones
    if (!registerEmail || !registerPassword || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (registerPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: registerEmail, 
          password: registerPassword 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('¡Usuario creado exitosamente! Ya puedes iniciar sesión.');
        // Limpiar formulario
        setRegisterEmail('');
        setRegisterPassword('');
        setConfirmPassword('');
        // Cambiar a login después de 2 segundos
        setTimeout(() => {
          setIsRegistering(false);
          setSuccessMessage('');
        }, 2000);
      } else {
        setError(data.message || 'Error al crear usuario');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: '#0a0a0a',
        border: '2px solid #00f3ff',
        borderRadius: '10px',
        padding: '40px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 0 30px rgba(0, 243, 255, 0.3)'
      }}>
        {/* Logo */}
        <h1 className="hacker-font neon-blue" style={{ 
          fontSize: '2.5rem', 
          textAlign: 'center',
          marginBottom: '10px'
        }}>
          DCIC<span style={{ color: 'white' }}>FLIX</span>
        </h1>
        
        <p style={{
          textAlign: 'center',
          color: '#666',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          marginBottom: '30px'
        }}>
          {isRegistering ? 'Crear nueva cuenta' : 'Acceso al sistema'}
        </p>

        {/* Mensajes de error/éxito */}
        {error && (
          <div style={{
            background: '#ff0000',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {successMessage && (
          <div style={{
            background: '#00ff00',
            color: 'black',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            ✓ {successMessage}
          </div>
        )}

        {/* Formulario de LOGIN */}
        {!isRegistering ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                color: '#00f3ff', 
                marginBottom: '8px',
                fontFamily: 'monospace'
              }}>
                Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  color: 'white',
                  fontFamily: 'monospace',
                  fontSize: '1rem'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                color: '#00f3ff', 
                marginBottom: '8px',
                fontFamily: 'monospace'
              }}>
                Contraseña
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  color: 'white',
                  fontFamily: 'monospace',
                  fontSize: '1rem'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: '#00f3ff',
                color: 'black',
                border: 'none',
                borderRadius: '5px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: '"VT323", monospace',
                transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = '#00d4e6';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = '#00f3ff';
              }}
            >
              {loading ? 'CONECTANDO...' : 'INICIAR SESIÓN'}
            </button>
          </form>
        ) : (
          // Formulario de REGISTRO
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                color: '#00f3ff', 
                marginBottom: '8px',
                fontFamily: 'monospace'
              }}>
                Email
              </label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  color: 'white',
                  fontFamily: 'monospace',
                  fontSize: '1rem'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                color: '#00f3ff', 
                marginBottom: '8px',
                fontFamily: 'monospace'
              }}>
                Contraseña
              </label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  color: 'white',
                  fontFamily: 'monospace',
                  fontSize: '1rem'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                color: '#00f3ff', 
                marginBottom: '8px',
                fontFamily: 'monospace'
              }}>
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  color: 'white',
                  fontFamily: 'monospace',
                  fontSize: '1rem'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: '#00f3ff',
                color: 'black',
                border: 'none',
                borderRadius: '5px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: '"VT323", monospace',
                transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = '#00d4e6';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = '#00f3ff';
              }}
            >
              {loading ? 'CREANDO...' : 'CREAR CUENTA'}
            </button>
          </form>
        )}

        {/* Botón para cambiar entre Login y Registro */}
        <div style={{
          marginTop: '25px',
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #333'
        }}>
          <p style={{ color: '#666', fontFamily: 'monospace', fontSize: '0.9rem' }}>
            {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          </p>
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setSuccessMessage('');
            }}
            style={{
              background: 'transparent',
              border: '1px solid #00f3ff',
              color: '#00f3ff',
              padding: '8px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              marginTop: '10px',
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
            {isRegistering ? 'Volver a Login' : 'Crear Usuario'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;