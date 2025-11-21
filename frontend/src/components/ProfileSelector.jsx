import React from 'react';

// Eliminamos MOCK_PROFILES, ahora recibimos "profiles" como prop
const ProfileSelector = ({ profiles, onSelectProfile }) => {
  return (
    <div className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#000',
      color: 'white'
    }}>
      <h1 className="hacker-font" style={{ fontSize: '3rem', marginBottom: '2rem', color: '#ccc' }}>
        ¿Quién está hackeando hoy?
      </h1>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {profiles.map((profile) => (
          <div 
            key={profile._id} // Usamos _id de Mongo
            onClick={() => onSelectProfile(profile)}
            className="profile-card"
            style={{ cursor: 'pointer', textAlign: 'center' }}
          >
            <div style={{
              width: '150px', height: '150px', borderRadius: '10px', overflow: 'hidden',
              border: '3px solid transparent', marginBottom: '1rem',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00f3ff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <img 
                src={profile.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=Default"} 
                alt={profile.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#222' }} 
              />
            </div>
            <span className="hacker-font" style={{ fontSize: '1.5rem', color: '#888' }}>{profile.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSelector;