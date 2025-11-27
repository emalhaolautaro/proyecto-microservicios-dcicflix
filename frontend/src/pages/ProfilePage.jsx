import React from 'react';
import ProfileSelector from '../components/auth/ProfileSelector';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';

const ProfilePage = () => {
    const { userProfiles, authToken, userEmail, logout } = useAuth();
    const { selectProfile } = useProfile();

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={logout}
                style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'transparent', border: '1px solid #333',
                    color: '#666', cursor: 'pointer', padding: '5px 10px', zIndex: 10
                }}
            >
                Cerrar Sesión Global
            </button>

            <ProfileSelector
                profiles={userProfiles}
                onSelectProfile={selectProfile}
                token={authToken}
                userEmail={userEmail}
            />
        </div>
    );
};

export default ProfilePage;
