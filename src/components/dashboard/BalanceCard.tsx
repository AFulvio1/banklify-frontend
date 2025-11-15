import React from 'react';
import type { BalanceDTO } from '../../types/Models';

type BalanceCardProps = BalanceDTO; 

const formatCurrency = (amount: string): string => {
    const value = parseFloat(amount);
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
};

const BalanceCard: React.FC<BalanceCardProps> = ({ iban, availableBalance, ledgerBalance }) => {
  
  const formattedAvailable = formatCurrency(availableBalance);
  const formattedLedger = formatCurrency(ledgerBalance);
  
  return (
    <div className="card text-white bg-primary shadow-lg border-0 rounded-4">
      <div className="card-body p-4">
        
        <div className="d-flex justify-content-between align-items-start mb-4">
          <h3 className="card-subtitle mb-0 fs-5 opacity-75">Saldo Disponibile</h3>
          <span className="badge bg-light text-success fw-bold">ATTIVO</span>
        </div>

        <div className="display-4 fw-bolder mb-3">
          {formattedAvailable}
        </div>

        <hr className="border-white opacity-25" />

        <p className="card-text mb-1">IBAN: <span className="fw-semibold">{iban}</span></p>
        
        <div className="d-flex justify-content-between mt-2">
            <span className="text-sm opacity-75">Saldo Contabile:</span>
            <span className="fw-semibold">{formattedLedger}</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;