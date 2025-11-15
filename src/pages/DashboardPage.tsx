import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import type { BalanceDTO, TransactionDTO, BackendErrorResponse } from '../types/Financial';
import { isAxiosError } from '../utils/errorUtils';
import Spinner from '../components/common/Spinner'; 
import ErrorMessage from '../components/common/ErrorMessage'; 
import BalanceCard from '../components/dashboard/BalanceCard';
import TransactionList from '../components/dashboard/TransactionList';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userIban, logout } = useAuth();
    
    const [balance, setBalance] = useState<BalanceDTO | null>(null);
    const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!isAuthenticated || !userIban) {
            setLoading(false);
            setError("IBAN non disponibile o sessione scaduta.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const balanceResponse = await axiosInstance.get<BalanceDTO>(`/accounts/${userIban}/balance`);
            setBalance(balanceResponse.data);

            const transactionsResponse = await axiosInstance.get<TransactionDTO[]>(`/accounts/${userIban}/movimenti?limit=10`);
            setTransactions(transactionsResponse.data);

        } catch (err: unknown) {
            console.error("Errore nel fetching dei dati:", err);
            
            if (isAxiosError(err) && err.response) {
                const errorData = err.response.data as BackendErrorResponse;

                if (err.response.status === 401 || err.response.status === 403) {
                    setError("Sessione scaduta. Effettua nuovamente il login.");
                    logout(); 
                    return;
                }
                
                setError(errorData.error || `Errore HTTP ${err.response.status}: Impossibile connettersi.`);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Errore sconosciuto durante il caricamento.");
            }
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, userIban, logout]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <Spinner /> <p className="ms-2 text-muted">Caricamento dati conto...</p>
            </div>
        );
    }
    
    if (error || !balance) {
         return (
            <div className="container mt-5">
                <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '500px' }}>
                    <ErrorMessage message={error || "Errore nel caricamento dei dati principali."} />
                    <button 
                        onClick={logout} 
                        className="btn btn-danger btn-block mt-3"
                    >
                        Esci e Riprova
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid bg-light min-vh-100 p-4">
            <header className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h1 className="display-6 fw-bold text-dark">Dashboard Banca Digitale</h1>
                <button 
                    onClick={logout} 
                    className="btn btn-outline-secondary"
                >
                    Logout
                </button>
            </header>
            
            <main className="row g-4">
                
                <div className="col-lg-4">
                    <div className="d-flex flex-column gap-4">
                        <BalanceCard 
                            iban={userIban || 'N/A'}
                            availableBalance={balance.availableBalance}
                            ledgerBalance={balance.ledgerBalance}
                        />
                        
                        <div className="card shadow-sm p-3">
                            <h3 className="card-title fs-5 mb-3">Operazioni Rapide</h3>
                            <button 
                                onClick={() => navigate('/transfer')} 
                                className="btn btn-primary btn-lg"
                            >
                                Nuovo Bonifico 💸
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card shadow-lg p-4">
                        <h3 className="card-title fs-4 fw-bold mb-4">Ultime Transazioni</h3>
                        {transactions.length > 0 ? (
                            <TransactionList transactions={transactions} />
                        ) : (
                            <p className="text-center text-muted py-5">Nessuna transazione recente trovata.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;