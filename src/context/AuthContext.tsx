import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import type { LoginCredentials } from '../types/Models';

interface AuthContextType {
  isAuthenticated: boolean;
  userIban: string | null;
  userFirstName: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('token');
    const iban = localStorage.getItem('userIban');
    const name = localStorage.getItem('userFirstName');
    return !!(token && iban && name);
  });

  const [userIban, setUserIban] = useState<string | null>(() => localStorage.getItem('userIban'));
  const [userFirstName, setUserFirstName] = useState<string | null>(() => localStorage.getItem('userFirstName'));

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userIban');
    localStorage.removeItem('userFirstName');
    
    setIsAuthenticated(false);
    setUserIban(null);
    setUserFirstName(null);
    
    navigate('/login');
  }, [navigate]);

  const login = async (credentials: LoginCredentials) => {
    const response = await client.post('/auth/login', credentials);
    
    const { token, iban, firstName } = response.data;
    
    if (token) {
        localStorage.setItem('token', token);
        if (iban) localStorage.setItem('userIban', iban);
        if (firstName) localStorage.setItem('userFirstName', firstName);

        setIsAuthenticated(true);
        setUserIban(iban || null);
        setUserFirstName(firstName || null);
        
        navigate('/dashboard');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userIban, userFirstName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
};