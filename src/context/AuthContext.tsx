// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { AuthContextType, LoginCredentials, LoginResponse } from '../types/Financial';

const TOKEN_KEY = 'bank_jwt_token';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post<LoginResponse>('/api/v1/auth/login', credentials);
      const newToken = response.data.token;
      
      setToken(newToken);
      localStorage.setItem(TOKEN_KEY, newToken);
      
      navigate('/dashboard', { replace: true });

    } catch (error) {
      console.error('Login fallito:', error);
      throw new Error("Credenziali non valide o errore di rete."); 
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    navigate('/login', { replace: true }); 
  };

  const contextValue: AuthContextType = {
    isAuthenticated: !!token,
    token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};