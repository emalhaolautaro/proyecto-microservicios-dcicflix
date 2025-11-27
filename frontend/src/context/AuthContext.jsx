import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('authToken'));
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
    const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail'));
    const [userProfiles, setUserProfiles] = useState(() => {
        const saved = localStorage.getItem('userProfiles');
        return saved ? JSON.parse(saved) : [];
    });

    const login = (token, email, profiles) => {
        setAuthToken(token);
        setUserEmail(email);

        // Asegurar que los perfiles tengan el email asociado (para recomendaciones)
        const profilesWithEmail = profiles.map((p, idx) => ({
            id: p._id || `profile_${idx}`,
            name: p.name,
            avatar: p.avatar,
            isKid: p.isKid,
            userEmail: email
        }));

        setUserProfiles(profilesWithEmail);
        setIsLoggedIn(true);

        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userProfiles', JSON.stringify(profilesWithEmail));
    };

    const logout = () => {
        setIsLoggedIn(false);
        setAuthToken(null);
        setUserEmail(null);
        setUserProfiles([]);

        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userProfiles');
        localStorage.removeItem('currentProfile'); // También limpiamos el perfil activo
    };

    const updateProfiles = (newProfiles) => {
        const profilesWithEmail = newProfiles.map((p, idx) => ({
            id: p._id || `profile_${idx}`,
            name: p.name,
            avatar: p.avatar,
            isKid: p.isKid,
            userEmail: userEmail
        }));
        setUserProfiles(profilesWithEmail);
        localStorage.setItem('userProfiles', JSON.stringify(profilesWithEmail));
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, authToken, userEmail, userProfiles, login, logout, updateProfiles }}>
            {children}
        </AuthContext.Provider>
    );
};
