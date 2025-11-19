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
          <span className="badge bg-light text-primary fw-bold">ATTIVO</span>
        </div>

        <div className="fs-1 fw-bolder mb-3" style={{ lineHeight: 1.1 }}>
          {formattedAvailable}
        </div>

        <hr className="border-white opacity-25" />

        <div className="mb-3 text-start text-nowrap overflow-hidden">
            <span className="opacity-75 small me-2">IBAN:</span> 
            <span className="fw-semibold" style={{ fontSize: '0.95rem' }}>{iban}</span>
        </div>
        
        <div className="d-flex justify-content-between mt-2">
            <span className="text-sm opacity-75">Saldo Contabile:</span>
            <span className="fw-semibold">{formattedLedger}</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;