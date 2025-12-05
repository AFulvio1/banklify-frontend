import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client'; // Usa il nuovo client centralizzato
import { useAuth } from '../context/AuthContext';
import type { BalanceDTO, TransactionDTO } from '../types/Models';
import Spinner from '../components/common/Spinner'; 
import BalanceCard from '../components/dashboard/BalanceCard';
import TransactionList from '../components/dashboard/TransactionList';
import BanklifyLogoHorizontal from '../assets/logo-banklify-horizontal.png';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userIban, userFirstName, logout } = useAuth(); 
    
    const [balance, setBalance] = useState<BalanceDTO | null>(null);
    const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [showDropdown, setShowDropdown] = useState(false);

    const fetchData = useCallback(async () => {
        if (!isAuthenticated || !userIban) {
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const balanceResponse = await client.get<BalanceDTO>(`/accounts/${userIban}/balance`);
            setBalance(balanceResponse.data);

            const transactionsResponse = await client.get<TransactionDTO[]>(`/transactions/${userIban}/movements`, {
                params: {
                    page: 0,
                    limit: 10
                }
            });
            const initialTransactions = transactionsResponse.data;
            setTransactions(initialTransactions);
            setPage(0);
            setHasMore(initialTransactions.length >= 10);
            
        } catch (err) {
            console.debug("Errore caricamento dashboard:", err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, userIban]);

    const handleLoadMore = async () => {
        if (!userIban) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        
        try {
            const response = await client.get<TransactionDTO[]>(`/transactions/${userIban}/movements`, {
                params: {
                    page: nextPage,
                    limit: 10
                }
            });
            const newTransactions = response.data;
            if (newTransactions.length < 10) {
                setHasMore(false);
            }
            setTransactions(prev => [...prev, ...newTransactions]);
            setPage(nextPage);
        } catch (err) {
            console.debug("Errore caricamento altre transazioni:", err);
        } finally {
            setLoadingMore(false);
        }
    };

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
    
    if (!balance) {
         return (
            <div className="container mt-5">
                <div className="card shadow-sm p-4 mx-auto text-center" style={{ maxWidth: '500px' }}>
                    <div className="mb-3 text-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                    </div>
                    <h4>Dati non disponibili</h4>
                    <p className="text-muted">Impossibile recuperare le informazioni del conto.</p>
                    <div className="d-grid gap-2 col-8 mx-auto mt-3">
                        <button 
                            onClick={() => window.location.reload()} 
                            className="btn btn-primary"
                        >
                            Riprova
                        </button>
                        <button 
                            onClick={logout} 
                            className="btn btn-outline-secondary"
                        >
                            Torna al Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid bg-light min-vh-100 p-4">
            <header className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                
                <div className="d-flex align-items-center">
                    <img 
                        src={BanklifyLogoHorizontal} 
                        alt="Banklify Logo" 
                        className="img-fluid"
                        style={{ maxHeight: '80px' }} 
                    />
                </div>

                <div className="position-relative">
                    <button 
                        className="btn d-flex align-items-center gap-2 border-0 bg-transparent"
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{ color: '#0d2e5b' }}
                    >
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center border" style={{ width: '40px', height: '40px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                            </svg>
                        </div>
                        
                        <div className="d-none d-md-block text-start">
                            <div className="small text-muted" style={{ lineHeight: '1' }}>Benvenuto,</div>
                            <div className="fw-bold fs-5" style={{ lineHeight: '1.2' }}>{userFirstName || 'Utente'}</div>
                        </div>

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`ms-2 transition-transform ${showDropdown ? 'rotate-180' : ''}`} viewBox="0 0 16 16" style={{ transition: 'transform 0.2s' }}>
                            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </button>

                    {showDropdown && (
                        <div className="position-absolute end-0 mt-2 bg-white shadow-lg rounded-3 border overflow-hidden" style={{ minWidth: '220px', zIndex: 1000 }}>
                            <button 
                                className="dropdown-item p-3 d-flex align-items-center gap-2 w-100 text-start border-0 bg-white hover-bg-light"
                                onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1h8Zm-1 0c0 .568-.18 1.035-.55 1.414C11.68 14.797 10.379 15 8 15c-2.379 0-3.679-.203-4.45-.586C3.18 14.035 3 13.568 3 13c0-2.21 3.582-4 8-4s8 1.79 8 4Z"/>
                                </svg>
                                Informazioni Utente
                            </button>
                            <div className="dropdown-divider m-0"></div>
                            <button 
                                onClick={() => { logout(); setShowDropdown(false); }} 
                                className="dropdown-item p-3 d-flex align-items-center gap-2 w-100 text-start border-0 bg-white text-danger hover-bg-light"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                                </svg>
                                Esci
                            </button>
                        </div>
                    )}
                </div>
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
                            <h3 className="card-title fs-5 fw-bold mb-3" style={{ color: 'var(--bs-primary)' }}>Operazioni Rapide</h3>
                            <button 
                                onClick={() => navigate('/transfer')} 
                                className="btn btn-primary btn-lg"
                            >
                                Nuovo Bonifico
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card shadow-lg p-4">
                        <h3 className="card-title fs-4 fw-bold mb-4" style={{ color: 'var(--bs-primary)' }}>Ultime Transazioni</h3>
                        <TransactionList 
                            transactions={transactions} 
                            onLoadMore={handleLoadMore}
                            hasMore={hasMore}
                            isLoading={loadingMore}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;