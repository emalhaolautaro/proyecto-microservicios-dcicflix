import React, { useState } from 'react';
import IntroAnimation from './components/ui/IntroAnimation';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import './index.css';

const AppContent = () => {
  const { isLoggedIn } = useAuth();
  const { currentProfile } = useProfile();

  const [showIntro, setShowIntro] = useState(() => {
    return !localStorage.getItem('currentProfile');
  });

  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />;
  }

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  if (!currentProfile) {
    return <ProfilePage />;
  }

  return <DashboardPage />;
};

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;