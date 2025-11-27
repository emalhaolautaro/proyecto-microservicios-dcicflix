import React from 'react';

const Header = ({ currentProfile, onLogout, onChangeProfile, onShowRatings, onFilterLanguage }) => {
    if (!currentProfile) return null;

    return (
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
                    onClick={() => onFilterLanguage('Spanish')}
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
                    🇪🇸 Películas en Español
                </button>

                <button
                    onClick={() => onFilterLanguage('English')}
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
                    🇺🇸 Películas en Inglés
                </button>

                <button
                    onClick={onShowRatings}
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
                        onClick={onChangeProfile}
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

                <button
                    onClick={onLogout}
                    style={{
                        background: 'transparent', border: '1px solid #333',
                        color: '#666', cursor: 'pointer', padding: '5px 10px', marginLeft: '10px'
                    }}
                    title="Cerrar Sesión Global"
                >
                    X
                </button>
            </div>
        </header>
    );
};

export default Header;
