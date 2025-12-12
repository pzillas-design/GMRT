'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    checkAuth: () => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: true,
    checkAuth: async () => false,
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/check');
            if (res.ok) {
                const data = await res.json();
                setIsAuthenticated(data.authenticated);
                return data.authenticated;
            } else {
                setIsAuthenticated(false);
                return false;
            }
        } catch (error) {
            setIsAuthenticated(false);
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
