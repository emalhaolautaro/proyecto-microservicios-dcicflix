import React, { createContext, useState, useContext, useEffect } from 'react';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const [currentProfile, setCurrentProfile] = useState(() => {
        const saved = localStorage.getItem('currentProfile');
        return saved ? JSON.parse(saved) : null;
    });

    const selectProfile = (profile) => {
        setCurrentProfile(profile);
        if (profile) {
            localStorage.setItem('currentProfile', JSON.stringify(profile));
        } else {
            localStorage.removeItem('currentProfile');
        }
    };

    const clearProfile = () => {
        setCurrentProfile(null);
        localStorage.removeItem('currentProfile');
    };

    return (
        <ProfileContext.Provider value={{ currentProfile, selectProfile, clearProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};
