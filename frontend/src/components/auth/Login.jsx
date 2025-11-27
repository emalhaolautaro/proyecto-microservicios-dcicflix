import React, { useState } from 'react';
import { loginUser, registerUser } from '../../services/authService';

const Login = ({ onLoginSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileName, setProfileName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegistering) {
                // REGISTRO
                await registerUser(email, password, profileName);

                // Auto-login después del registro
                const data = await loginUser(email, password);
                onLoginSuccess(data.user.profiles, data.token, data.user.email);
            } else {
                // LOGIN
                const data = await loginUser(email, password);
                onLoginSuccess(data.user.profiles, data.token, data.user.email);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container fade-in" style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: '100vh', background: '#000'
        }}>
            <div style={{
                background: '#111', padding: '2rem', borderRadius: '10px',
                border: '1px solid #00f3ff', boxShadow: '0 0 20px rgba(0, 243, 255, 0.2)',
                width: '100%', maxWidth: '400px'
            }}>
                <h2 className="hacker-font neon-blue" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    {isRegistering ? 'NUEVO RECLUTA' : 'ACCESO AL SISTEMA'}
                </h2>

                {error && (
                    <div style={{
                        background: 'rgba(255, 0, 0, 0.2)', color: '#ff4444',
                        padding: '10px', borderRadius: '5px', marginBottom: '1rem',
                        border: '1px solid #ff4444', fontSize: '0.9rem'
                    }}>
                        ⚠ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.9rem' }}>
                            CORREO ELECTRÓNICO
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '10px', background: '#222',
                                border: '1px solid #333', color: 'white', outline: 'none',
                                fontFamily: 'monospace'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                            onBlur={(e) => e.target.style.borderColor = '#333'}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.9rem' }}>
                            CONTRASEÑA
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '10px', background: '#222',
                                border: '1px solid #333', color: 'white', outline: 'none',
                                fontFamily: 'monospace'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                            onBlur={(e) => e.target.style.borderColor = '#333'}
                        />
                    </div>

                    {isRegistering && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.9rem' }}>
                                NOMBRE DE PERFIL (Opcional)
                            </label>
                            <input
                                type="text"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                placeholder="Ej: Neo"
                                style={{
                                    width: '100%', padding: '10px', background: '#222',
                                    border: '1px solid #333', color: 'white', outline: 'none',
                                    fontFamily: 'monospace'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                                onBlur={(e) => e.target.style.borderColor = '#333'}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '12px',
                            background: loading ? '#333' : '#00f3ff',
                            color: loading ? '#888' : 'black',
                            border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'monospace', fontSize: '1.1rem',
                            transition: 'all 0.3s'
                        }}
                    >
                        {loading ? 'PROCESANDO...' : (isRegistering ? 'REGISTRARSE' : 'INGRESAR')}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError('');
                            setProfileName('');
                        }}
                        style={{
                            background: 'transparent', border: 'none',
                            color: '#00f3ff', textDecoration: 'underline',
                            cursor: 'pointer', fontFamily: 'monospace'
                        }}
                    >
                        {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;