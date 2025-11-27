import React, { useState } from 'react';
import { createProfile, updateProfile, deleteProfile } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const ProfileSelector = ({ profiles, onSelectProfile, token, userEmail }) => {
    const { updateProfiles } = useAuth(); // Usamos el contexto para actualizar la lista global
    const [isAdding, setIsAdding] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // State for creating
    const [newProfileName, setNewProfileName] = useState('');
    const [isKid, setIsKid] = useState(false);

    // State for editing
    const [editName, setEditName] = useState('');
    const [editIsKid, setEditIsKid] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Si profiles viene undefined, usar array vacío
    const safeProfiles = profiles || [];

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        if (!newProfileName.trim()) return;

        setLoading(true);
        setError('');

        try {
            const data = await createProfile(token, newProfileName, null, isKid);
            updateProfiles(data.profiles);
            setIsAdding(false);
            setNewProfileName('');
            setIsKid(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (e, profile) => {
        e.stopPropagation();
        setEditingProfile(profile);
        setEditName(profile.name);
        setEditIsKid(profile.isKid);
        setError('');
        setShowDeleteConfirm(false);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!editName.trim()) return;

        setLoading(true);
        setError('');

        try {
            const data = await updateProfile(token, editingProfile.id, editName, editIsKid);
            updateProfiles(data.profiles);
            setEditingProfile(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProfile = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await deleteProfile(token, editingProfile.id);
            updateProfiles(data.profiles);
            setEditingProfile(null);
            setShowDeleteConfirm(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 100%)',
            padding: '40px 20px'
        }}>
            <h1 className="hacker-font neon-blue" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '20px' }}>
                DCIC<span style={{ color: 'white' }}>FLIX</span>
            </h1>

            <h2 style={{ color: '#00f3ff', fontFamily: 'monospace', fontSize: '1.5rem', marginBottom: '50px', textAlign: 'center' }}>
                &gt; ¿Quién está mirando?
            </h2>

            {/* Grid de perfiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 180px))', gap: '30px', justifyContent: 'center', maxWidth: '900px', width: '100%' }}>

                {safeProfiles.map((profile) => (
                    <div
                        key={profile._id || profile.id}
                        onClick={() => onSelectProfile(profile)}
                        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.querySelector('.profile-avatar').style.borderColor = '#00f3ff'; e.currentTarget.querySelector('.settings-btn').style.opacity = '1'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.querySelector('.profile-avatar').style.borderColor = '#333'; e.currentTarget.querySelector('.settings-btn').style.opacity = '0'; }}
                    >
                        <div className="profile-avatar" style={{ width: '150px', height: '150px', borderRadius: '10px', overflow: 'hidden', border: '3px solid #333', transition: 'border-color 0.2s', background: '#111', position: 'relative' }}>
                            <img src={profile.avatar} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                            {/* Overlay oscuro al hacer hover para resaltar el botón de settings */}
                            <div className="settings-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.2s' }}></div>
                        </div>

                        <span style={{ marginTop: '15px', color: '#ccc', fontFamily: 'monospace', fontSize: '1.1rem', textAlign: 'center' }}>{profile.name}</span>
                        {profile.isKid && <span style={{ fontSize: '0.8rem', color: '#00f3ff', fontFamily: 'monospace', marginTop: '5px' }}>👶 Infantil</span>}

                        {/* Botón de Ajustes */}
                        <button
                            className="settings-btn"
                            onClick={(e) => handleEditClick(e, profile)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                border: '1px solid #00f3ff',
                                color: '#00f3ff',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                opacity: 0, // Invisible por defecto, visible en hover
                                transition: 'opacity 0.2s',
                                zIndex: 10
                            }}
                            title="Ajustes de perfil"
                        >
                            ⚙️
                        </button>
                    </div>
                ))}

                {/* Botón Agregar Perfil */}
                {safeProfiles.length < 4 && (
                    <div
                        onClick={() => setIsAdding(true)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.querySelector('.add-profile-box').style.borderColor = '#00f3ff'; e.currentTarget.querySelector('.add-profile-box').style.background = '#1a1a1a'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.querySelector('.add-profile-box').style.borderColor = '#333'; e.currentTarget.querySelector('.add-profile-box').style.background = '#0a0a0a'; }}
                    >
                        <div className="add-profile-box" style={{ width: '150px', height: '150px', borderRadius: '10px', border: '3px dashed #333', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                            <span style={{ fontSize: '4rem', color: '#00f3ff' }}>+</span>
                        </div>
                        <span style={{ marginTop: '15px', color: '#00f3ff', fontFamily: 'monospace', fontSize: '1.1rem' }}>Agregar Perfil</span>
                    </div>
                )}
            </div>

            {/* Modal para agregar perfil */}
            {isAdding && (
                <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}
                    onClick={() => setIsAdding(false)}
                >
                    <div
                        style={{ background: '#0a0a0a', border: '2px solid #00f3ff', borderRadius: '10px', padding: '40px', maxWidth: '450px', width: '100%', boxShadow: '0 0 30px rgba(0, 243, 255, 0.3)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="hacker-font" style={{ color: '#00f3ff', marginBottom: '25px', fontSize: '1.8rem' }}>&gt; Nuevo Perfil</h2>

                        {error && <div style={{ background: '#ff0000', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontFamily: 'monospace', fontSize: '0.9rem' }}>⚠️ {error}</div>}

                        <form onSubmit={handleCreateProfile}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', color: '#00f3ff', marginBottom: '8px', fontFamily: 'monospace' }}>Nombre del perfil</label>
                                <input
                                    type="text"
                                    value={newProfileName}
                                    onChange={(e) => setNewProfileName(e.target.value)}
                                    placeholder="Ej: Juan, María, Niños..."
                                    required
                                    style={{ width: '100%', padding: '12px', background: '#111', border: '1px solid #333', borderRadius: '5px', color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}
                                    onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                                    onBlur={(e) => e.target.style.borderColor = '#333'}
                                />
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontFamily: 'monospace', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={isKid} onChange={(e) => setIsKid(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                    <span>¿Es un perfil infantil?</span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', background: '#00f3ff', color: 'black', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: '"VT323", monospace', opacity: loading ? 0.7 : 1 }}>
                                    {loading ? 'CREANDO...' : 'CREAR PERFIL'}
                                </button>
                                <button type="button" onClick={() => { setIsAdding(false); setError(''); setNewProfileName(''); setIsKid(false); }} style={{ flex: 1, padding: '12px', background: 'transparent', color: '#00f3ff', border: '1px solid #00f3ff', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"VT323", monospace' }}>
                                    CANCELAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para EDITAR perfil */}
            {editingProfile && (
                <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}
                    onClick={() => { setEditingProfile(null); setShowDeleteConfirm(false); }}
                >
                    <div
                        style={{ background: '#0a0a0a', border: '2px solid #00f3ff', borderRadius: '10px', padding: '40px', maxWidth: '450px', width: '100%', boxShadow: '0 0 30px rgba(0, 243, 255, 0.3)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!showDeleteConfirm ? (
                            <>
                                <h2 className="hacker-font" style={{ color: '#00f3ff', marginBottom: '25px', fontSize: '1.8rem' }}>&gt; Ajustes de Perfil</h2>

                                {error && <div style={{ background: '#ff0000', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontFamily: 'monospace', fontSize: '0.9rem' }}>⚠️ {error}</div>}

                                <form onSubmit={handleUpdateProfile}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', color: '#00f3ff', marginBottom: '8px', fontFamily: 'monospace' }}>Nombre del perfil</label>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            placeholder="Nombre del perfil"
                                            required
                                            style={{ width: '100%', padding: '12px', background: '#111', border: '1px solid #333', borderRadius: '5px', color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}
                                            onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                                            onBlur={(e) => e.target.style.borderColor = '#333'}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '25px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontFamily: 'monospace', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={editIsKid} onChange={(e) => setEditIsKid(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                            <span>¿Es un perfil infantil?</span>
                                        </label>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', background: '#00f3ff', color: 'black', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: '"VT323", monospace', opacity: loading ? 0.7 : 1 }}>
                                                {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                                            </button>
                                            <button type="button" onClick={() => { setEditingProfile(null); setError(''); }} style={{ flex: 1, padding: '12px', background: 'transparent', color: '#00f3ff', border: '1px solid #00f3ff', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"VT323", monospace' }}>
                                                CANCELAR
                                            </button>
                                        </div>

                                        <hr style={{ width: '100%', border: '1px solid #333' }} />

                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            style={{ padding: '12px', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"VT323", monospace' }}
                                        >
                                            ELIMINAR PERFIL
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            // Confirmación de eliminación
                            <div style={{ textAlign: 'center' }}>
                                <h2 className="hacker-font" style={{ color: '#ff4444', marginBottom: '15px', fontSize: '1.8rem' }}>⚠️ ¿Estás seguro?</h2>
                                <p style={{ color: '#ccc', marginBottom: '25px', fontFamily: 'monospace' }}>
                                    Esta acción eliminará permanentemente el perfil de <strong>{editingProfile.name}</strong> y todo su historial.
                                </p>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={handleDeleteProfile}
                                        disabled={loading}
                                        style={{ flex: 1, padding: '12px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: '"VT323", monospace', opacity: loading ? 0.7 : 1 }}
                                    >
                                        {loading ? 'ELIMINANDO...' : 'SÍ, ELIMINAR'}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        style={{ flex: 1, padding: '12px', background: 'transparent', color: '#ccc', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"VT323", monospace' }}
                                    >
                                        CANCELAR
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileSelector;