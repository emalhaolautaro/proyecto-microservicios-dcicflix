import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, onClear, isSearching }) => {
    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <input
                    type="text"
                    placeholder="Buscar película..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                    style={{
                        flex: 1,
                        padding: '10px 15px',
                        background: '#111',
                        border: '1px solid #00f3ff',
                        color: '#00f3ff',
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                />
                <button
                    onClick={onSearch}
                    style={{
                        padding: '10px 20px',
                        background: '#00f3ff',
                        color: '#000',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}
                >
                    BUSCAR
                </button>
                {isSearching && (
                    <button
                        onClick={onClear}
                        style={{
                            padding: '10px 20px',
                            background: 'transparent',
                            color: '#00f3ff',
                            border: '1px solid #00f3ff',
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            fontSize: '1rem'
                        }}
                    >
                        LIMPIAR
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
