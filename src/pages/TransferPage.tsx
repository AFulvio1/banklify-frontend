import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import type { TransferDTO, BackendErrorResponse } from '../types/Financial';
import ErrorMessage from '../components/common/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from '../utils/errorUtils'; // Importa la nuova funzione

const DEFAULT_SENDER_IBAN = 'IT60X0542811101000000123456';

const TransferPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<TransferDTO>({
        senderIban: DEFAULT_SENDER_IBAN,
        receiverIban: '',
        amount: '',
        description: '',
    });
    
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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

        try {
            const payload: TransferDTO = {
                ...formData,
                amount: amountNumber.toFixed(2),
            };

            const response = await axiosInstance.post('/transactions/transfer', payload);

            setSuccessMessage(response.data.message || "Bonifico eseguito con successo!");
            
            setFormData({ ...formData, receiverIban: '', amount: '', description: '' });

            setTimeout(() => navigate('/dashboard'), 3000); 

        } catch (err: unknown) {
            console.error("Errore Bonifico:", err);
        
            if (isAxiosError(err) && err.response) {
                const responseData = err.response.data as BackendErrorResponse;
                const backendError = responseData.error; 
                if (backendError) {
                    setError(backendError); 
                } else {
                    setError("Si è verificato un errore del server senza messaggio specifico.");
                }
            } else {
                setError(err instanceof Error ? err.message : "Errore di rete sconosciuto.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-center">Nuovo Bonifico</h2>
            
            {successMessage && (
                <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                    {successMessage}
                </div>
            )}
            
            {error && <ErrorMessage message={error} />}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                <label className="block">
                    <span className="text-gray-700">IBAN Mittente</span>
                    <input
                        type="text"
                        name="senderIban"
                        value={formData.senderIban}
                        readOnly // L'IBAN mittente dovrebbe essere fisso e non modificabile
                        className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm p-2"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">IBAN Destinatario</span>
                    <input
                        type="text"
                        name="receiverIban"
                        value={formData.receiverIban}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        placeholder="IT..."
                        minLength={15}
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Importo (€)</span>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="0.01"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Causale</span>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {loading ? 'Elaborazione...' : 'Conferma Bonifico'}
                </button>
            </form>
        </div>
    );
};

export default TransferPage;