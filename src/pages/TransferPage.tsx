import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import type { TransferDTO, BackendErrorResponse } from '../types/Models';
import { isAxiosError } from '../utils/errorUtils';
import ErrorMessage from '../components/common/ErrorMessage'; 
import BanklifyLogoHorizontal from '../assets/logo-banklify-horizontal.png';

const TransferPage: React.FC = () => {
    const navigate = useNavigate();
    const { userIban } = useAuth();
    
    const [formData, setFormData] = useState<TransferDTO>({
        senderIban: userIban || '',
        receiverIban: '',
        amount: '',
        description: '',
    });
    
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [availableBalance, setAvailableBalance] = useState<number | null>(null);
    const [balanceLoading, setBalanceLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBalance = async () => {
            if (userIban) {
                setBalanceLoading(true);
                try {
                    const response = await axiosInstance.get(`/accounts/${userIban}/balance`);
                    const balanceValue = parseFloat(response.data.availableBalance);
                    if (!isNaN(balanceValue)) {
                        setAvailableBalance(balanceValue);
                    } else {
                        console.error("Il saldo ricevuto dall'API non è un numero valido:", response.data.availableBalance);
                        setError("Errore nel recupero del saldo. Il formato non è corretto.");
                    }
                } catch (err) {
                    console.error("Impossibile recuperare il saldo", err);
                    setError("Errore durante il recupero del saldo del conto.");
                } finally {
                    setBalanceLoading(false);
                }
            } else {
                setBalanceLoading(false);
            }
        };
        fetchBalance();
    }, [userIban]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const amountNumber = parseFloat(formData.amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            setError("L'importo deve essere un numero positivo valido.");
            setLoading(false);
            return;
        }

        if (availableBalance !== null && amountNumber > availableBalance) {
            setError(`Fondi insufficienti. Il tuo saldo disponibile è € ${new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2 }).format(availableBalance)}`);
            setLoading(false);
            return;
        }
        
        if (!formData.senderIban) {
             setError("Errore di sessione: IBAN mittente non trovato.");
             setLoading(false);
             return;
        }

        try {
            const payload: TransferDTO = {
                ...formData,
                amount: amountNumber.toFixed(2), 
            };

            const response = await axiosInstance.post('/transactions/transfer', payload);

            setSuccessMessage(response.data.message || "Bonifico eseguito con successo!");
            setFormData({ ...formData, receiverIban: '', amount: '', description: '' });

            if (availableBalance !== null) {
                setAvailableBalance(parseFloat((availableBalance - amountNumber).toFixed(2))); 
            }

            setTimeout(() => navigate('/dashboard'), 3000); 

        } catch (err: unknown) {
            console.error("Errore Bonifico:", err);
            
            if (isAxiosError(err) && err.response) {
                const errorData = err.response.data as BackendErrorResponse;
                setError(errorData.error || `Errore HTTP ${err.response.status}.`); 
            } else {
                setError("Si è verificato un errore di rete. Riprova.");
            }
        } finally {
            setLoading(false);
        }
    };

    const isFormInvalid = 
        loading || 
        balanceLoading ||
        !formData.receiverIban || 
        !formData.amount || 
        !formData.description ||
        parseFloat(formData.amount) <= 0 ||
        isNaN(parseFloat(formData.amount));

    return (
        <div className="container py-5">
            <div className="card shadow-lg mx-auto" style={{ maxWidth: '600px' }}>
                <div className="card-header bg-primary text-white">
                    <h2 className="card-title mb-0 fs-4">Esegui un Nuovo Bonifico</h2>
                </div>
                <div className="card-body p-4">
                    
                    <div className="text-center mb-2">
                        <img 
                            src={BanklifyLogoHorizontal} 
                            alt="Banklify Logo" 
                            className="img-fluid" 
                            style={{ maxHeight: '100px' }}
                        />
                    </div>

                    {availableBalance !== null && (
                        <div className="alert alert-info text-center py-2 mb-3">
                            Disponibilità attuale: <strong>€ {new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2 }).format(availableBalance)}</strong>
                        </div>
                    )}

                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}
                    {error && <ErrorMessage message={error} />}

                    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                        
                        <div className="mb-3">
                            <label htmlFor="senderIban" className="form-label fw-semibold">IBAN Mittente</label>
                            <input
                                type="text"
                                id="senderIban"
                                value={formData.senderIban}
                                readOnly 
                                className="form-control bg-light"
                                placeholder="Caricamento IBAN..."
                            />
                            <div className="form-text">I fondi saranno prelevati da questo conto.</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="receiverIban" className="form-label fw-semibold">IBAN Destinatario</label>
                            <input
                                type="text"
                                id="receiverIban"
                                name="receiverIban"
                                value={formData.receiverIban}
                                onChange={handleChange}
                                required
                                minLength={15}
                                className="form-control"
                                placeholder="ITxx xxxxx xxxxx xxxxxxxxxxxx"
                            />
                            <div className="invalid-feedback">Inserisci un IBAN destinatario valido.</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="amount" className="form-label fw-semibold">Importo (€)</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                min="0.01"
                                step="0.01"
                                className="form-control"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="description" className="form-label fw-semibold">Causale</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={2}
                                className="form-control"
                                placeholder="Motivo del bonifico"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isFormInvalid}
                            className="btn btn-success btn-lg w-100"
                        >
                            {loading ? 'Elaborazione in corso...' : 'Conferma Bonifico'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TransferPage;