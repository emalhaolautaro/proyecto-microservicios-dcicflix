import React from 'react';
import Login from '../components/auth/Login';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { login } = useAuth();

    const handleLoginSuccess = (profiles, token, email) => {
        login(token, email, profiles);
    };

    return <Login onLoginSuccess={handleLoginSuccess} />;
};

export default LoginPage;
