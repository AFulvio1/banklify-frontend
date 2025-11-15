import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { AuthContextType, LoginCredentials, LoginResponse, RegisterRequest, BackendErrorResponse } from '../types/Financial';
import { isAxiosError } from '../utils/errorUtils'; // Utilità per gestire gli errori Axios

const API_BASE_URL = '/api/v1/auth';
const TOKEN_KEY = 'bank_jwt_token';
const IBAN_KEY = 'user_iban';

export interface ExtendedAuthContextType extends AuthContextType {
    userIban: string | null;
    register: (request: RegisterRequest) => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<ExtendedAuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const [token, setToken] = useState<string | null>(
        localStorage.getItem(TOKEN_KEY)
    );
    const [userIban, setUserIban] = useState<string | null>(
        localStorage.getItem(IBAN_KEY)
    );
    
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, credentials);
            const { token: newToken, iban: userPrimaryIban } = response.data;
            
            if (!userPrimaryIban) {
                console.error("Login riuscito ma IBAN mancante nella risposta.");
                throw new Error("Dati del conto primario mancanti. Riprovare.");
            }

            setToken(newToken);
            setUserIban(userPrimaryIban);
            localStorage.setItem(TOKEN_KEY, newToken);
            localStorage.setItem(IBAN_KEY, userPrimaryIban);
            
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
        setUserIban(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(IBAN_KEY);
        navigate('/login', { replace: true }); 
    };

    const contextValue: ExtendedAuthContextType = useMemo(() => ({
        isAuthenticated: !!token && isLoaded,
        token,
        userIban,
        login,
        logout,
        register,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [token, userIban, isLoaded, navigate]);
    
    if (!isLoaded) {
        return <div>Caricamento sessione...</div>; 
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};