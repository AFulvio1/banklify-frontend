import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Usiamo l'istanza base di axios per il login/register
import type { AuthContextType, LoginCredentials, LoginResponse, RegisterRequest, BackendErrorResponse } from '../types/Financial';
import { isAxiosError } from '../utils/errorUtils'; // Utilità per gestire gli errori Axios

const API_BASE_URL = '/api/v1/auth'; // Base URL del tuo controller SpringBoot
const TOKEN_KEY = 'bank_jwt_token';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface ExtendedAuthContextType extends AuthContextType {
  register: (request: RegisterRequest) => Promise<void>;
}

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
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, credentials);
      const newToken = response.data.token;
      
      setToken(newToken);
      localStorage.setItem(TOKEN_KEY, newToken);
      
      navigate('/dashboard', { replace: true });

    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        const errorData = err.response.data as BackendErrorResponse;
        throw new Error(errorData.error || "Credenziali non valide.");
      }
      throw new Error("Errore di rete o del server durante il login.");
    }
  };

  const register = async (request: RegisterRequest) => {
    try {
      await axios.post(`${API_BASE_URL}/register`, request);
      
      await login({ email: request.email, password: request.password });

    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        const errorData = err.response.data as BackendErrorResponse;
        throw new Error(errorData.error || "Errore durante la registrazione.");
      }
      throw new Error("Errore di rete o del server durante la registrazione.");
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    navigate('/login', { replace: true }); 
  };

  const contextValue: ExtendedAuthContextType = {
    isAuthenticated: !!token,
    token,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};