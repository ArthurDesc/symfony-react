import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { PrivateRoute } from './components/PrivateRoute';
import { getCurrentUser, logout } from './services/authService';
import { UserResponse } from './services/authService';
import './App.css';

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<UserResponse | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error loading user:', error);
                logout();
                window.location.href = '/login';
            }
        };

        loadUser();
    }, []);

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                        Bienvenue, {user.email}!
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Déconnexion
                    </button>
                </div>
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Vos rôles :</h2>
                    <ul className="list-disc list-inside">
                        {user.roles.map((role: string, index: number) => (
                            <li key={index}>{role}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
