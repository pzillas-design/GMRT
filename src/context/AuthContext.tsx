'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: true,
    checkAuth: async () => false,
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

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
