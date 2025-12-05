import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

interface ApiErrorResponse {
  error?: string;
  message?: string;
  timestamp?: string;
  status?: number;
  path?: string;
}

const API_BASE_URL = 'http://localhost:8080/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as ApiErrorResponse | undefined;
    
    let displayMessage = data?.error || data?.message;

    if (!displayMessage) {
        switch (status) {
            case 400: 
                displayMessage = "Richiesta non valida. Controlla i dati."; 
                break;
            case 401: 
                displayMessage = "Credenziali non valide o sessione scaduta."; 
                localStorage.removeItem('token');
                break;
            case 403: 
                displayMessage = "Accesso negato."; 
                break;
            case 404: 
                displayMessage = "Risorsa non trovata."; 
                break;
            case 500: 
                displayMessage = "Errore interno del server."; 
                break;
            default: 
                displayMessage = error.message === "Network Error" 
                    ? "Impossibile contattare il server. Verifica la connessione." 
                    : "Si è verificato un errore imprevisto.";
        }
    }

    if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    toast.error(displayMessage);

    return Promise.reject(new Error(displayMessage));
  }
);

export default client;