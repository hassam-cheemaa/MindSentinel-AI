import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const user = token ? { isAuthenticated: true } : null;

    // If we wanted to decode JWT to get username, we'd do it here.
    // For simplicity, we just track if token exists.
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
            setToken(res.data.access);
            return true;
        } catch (error) {
            console.error('Login error', error);
            return false;
        }
    };

    const register = async (username, password, email) => {
        try {
            await axios.post('http://127.0.0.1:8000/api/register/', { username, password, email });
            return await login(username, password);
        } catch (error) {
            console.error('Register error', error);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
