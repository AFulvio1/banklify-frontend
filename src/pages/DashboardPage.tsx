import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import type { BalanceDTO, TransactionDTO } from '../types/Financial';
import Spinner from '../components/common/Spinner'; 
import ErrorMessage from '../components/common/ErrorMessage'; 
import BalanceCard from '../components/dashboard/BalanceCard';
import TransactionList from '../components/dashboard/TransactionList';

const TEST_IBAN = 'IT60X0542811101000000123456'; 

const DashboardPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    
    const [balance, setBalance] = useState<BalanceDTO | null>(null);
    const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!isAuthenticated) return; // Non procedere senza autenticazione

        setLoading(true);
        setError(null);

        try {
            const balanceResponse = await axiosInstance.get<BalanceDTO>(`/accounts/${TEST_IBAN}/balance`);
            setBalance(balanceResponse.data);

            const transactionsResponse = await axiosInstance.get<TransactionDTO[]>(`/accounts/${TEST_IBAN}/movimenti?limit=10`);
            setTransactions(transactionsResponse.data);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err) || "Impossibile caricare i dati del conto.");
            }
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return <div className="p-4"><Spinner /> <p>Caricamento dati conto...</p></div>;
    }

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-3xl font-bold">La tua Dashboard</h2>
            
            {error && <ErrorMessage message={error} />}

            {balance && (
                <BalanceCard 
                    availableBalance={balance.availableBalance}
                    ledgerBalance={balance.ledgerBalance}
                />
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Ultimi Movimenti</h3>
                {transactions.length > 0 ? (
                    <TransactionList transactions={transactions} />
                ) : (
                    <p className="text-gray-500">Nessuna transazione recente.</p>
                )}
            </div>
            
        </div>
    );
};

export default DashboardPage;