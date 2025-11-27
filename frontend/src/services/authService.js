export const loginUser = async (email, password) => {
    const response = await fetch('http://localhost:8002/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en login');
    }
    return response.json();
};

export const registerUser = async (email, password, profileName) => {
    const response = await fetch('http://localhost:8002/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, profileName })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en registro');
    }
    return response.json();
};

export const createProfile = async (token, name, avatar, isKid) => {
    const response = await fetch('http://localhost:8002/profiles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}` // Si el backend lo soportara en header
        },
        body: JSON.stringify({ token, name, avatar, isKid })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error creando perfil');
    }
    return response.json();
};

export const updateProfile = async (token, profileId, name, isKid) => {
    const response = await fetch(`http://localhost:8002/profiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, name, isKid })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || 'Error actualizando perfil');
    }
    return response.json();
};

export const deleteProfile = async (token, profileId) => {
    const response = await fetch(`http://localhost:8002/profiles/${profileId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || 'Error eliminando perfil');
    }
    return response.json();
};
