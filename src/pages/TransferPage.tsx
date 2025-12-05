import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client'; 
import toast from 'react-hot-toast'; 
import { useAuth } from '../context/AuthContext';
import type { TransferDTO } from '../types/Models';
import BanklifyLogoHorizontal from '../assets/logo-banklify-horizontal.png';

const TransferPage: React.FC = () => {
    const navigate = useNavigate();
    const { userIban } = useAuth();
    
    const [formData, setFormData] = useState<TransferDTO>({
        senderIban: userIban || '',
        receiverIban: '',
        receiverName: '',
        amount: '',
        description: '',
    });
    
    const [loading, setLoading] = useState<boolean>(false);
    const [availableBalance, setAvailableBalance] = useState<number | null>(null);
    const [balanceLoading, setBalanceLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBalance = async () => {
            if (userIban) {
                setBalanceLoading(true);
                try {
                    const response = await client.get(`/accounts/${userIban}/balance`);
                    const balanceValue = parseFloat(response.data.availableBalance);
                    
                    if (!isNaN(balanceValue)) {
                        setAvailableBalance(balanceValue);
                    } else {
                        console.error("Il saldo ricevuto non è valido:", response.data.availableBalance);
                        toast.error("Errore nel formato del saldo.");
                    }
                } catch (err) {
                    console.debug("Impossibile recuperare il saldo", err);
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

        const amountNumber = parseFloat(formData.amount);
        
        if (isNaN(amountNumber) || amountNumber <= 0) {
            toast.error("L'importo deve essere un numero positivo valido.");
            setLoading(false);
            return;
        }

        if (availableBalance !== null && amountNumber > availableBalance) {
            toast.error(`Fondi insufficienti. Il tuo saldo disponibile è € ${new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2 }).format(availableBalance)}`);
            setLoading(false);
            return;
        }
        
        if (!formData.senderIban) {
             toast.error("Errore critico: IBAN mittente non trovato.");
             setLoading(false);
             return;
        }

        try {
            const payload: TransferDTO = {
                ...formData,
                amount: amountNumber.toFixed(2), 
            };

            const response = await client.post('/transactions/transfer', payload);

            toast.success(response.data.message || "Bonifico eseguito con successo!");
            
            setFormData({ ...formData, receiverIban: '', amount: '', description: '' });

            if (availableBalance !== null) {
                setAvailableBalance(parseFloat((availableBalance - amountNumber).toFixed(2))); 
            }

            setTimeout(() => navigate('/dashboard'), 2000); 

        } catch (err) {
            console.debug("Errore Bonifico:", err);
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
        <div className="vh-100 vw-100 bg-light d-flex flex-column align-items-center justify-content-center m-0 overflow-hidden p-3">

            <div className="mb-3 text-center flex-shrink-0">
                <img 
                    src={BanklifyLogoHorizontal} 
                    alt="Banklify Logo" 
                    className="img-fluid" 
                    style={{ maxHeight: '60px' }}
                />
            </div>

            <div className="card shadow-lg border-0 w-100 rounded-4 d-flex flex-column" style={{ maxWidth: '600px', maxHeight: '85vh' }}>
                
                <div className="py-3 text-center text-white fw-bold fs-5 rounded-top-4 flex-shrink-0" style={{ backgroundColor: '#0d2e5b' }}>
                    Nuovo Bonifico
                </div>
                
                <div className="card-body p-4 overflow-y-auto">

                    <div className="bg-light rounded-3 p-3 mb-4 border border-light-subtle">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small fw-medium">CONTO DI ADDEBITO</span>
                            <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill px-3">Mio Conto</span>
                        </div>
                        
                        <div className="font-monospace fw-medium mb-3 text-break small text-dark">
                            {formData.senderIban || 'Caricamento IBAN...'}
                        </div>
                        
                        <div className="d-flex align-items-baseline justify-content-between border-top pt-2 mt-2">
                            <span className="small text-muted">Saldo Disponibile</span>
                            {availableBalance !== null ? (
                                <span className="fw-bold text-success fs-5">
                                    € {new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2 }).format(availableBalance)}
                                </span>
                            ) : (
                                <span className="small text-muted fst-italic">Caricamento...</span>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                        
                        <div className="row g-2 mb-3">
                            <div className="col-12">
                                <label htmlFor="receiverName" className="form-label fw-medium small">Intestatario</label>
                                <input
                                    type="text"
                                    id="receiverName"
                                    name="receiverName"
                                    value={formData.receiverName}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                    placeholder="Mario Rossi"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="receiverIban" className="form-label fw-medium small">IBAN Destinatario</label>
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
                        </div>

                        <div className="mb-3">
                            <label htmlFor="amount" className="form-label fw-medium small">Importo (€)</label>
                            <div className="input-group">
                                <span className="input-group-text">€</span>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    min="0.01"
                                    step="0.01"
                                    className="form-control fw-bold"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="description" className="form-label fw-medium small">Causale</label>
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
                            className="btn btn-success btn-lg w-100 fw-bold shadow-sm"
                        >
                            {loading ? 'Elaborazione...' : 'Conferma Bonifico'}
                        </button>
                    </form>
                </div>

                <div className="card-footer text-center py-3 bg-light border-0 flex-shrink-0">
                    <button 
                        type="button" 
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-link text-decoration-none text-muted small"
                    >
                        Annulla e torna alla Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransferPage;