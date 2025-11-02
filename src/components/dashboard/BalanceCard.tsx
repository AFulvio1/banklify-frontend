import React from 'react';
import type { BalanceDTO } from '../../types/Financial';

type BalanceCardProps = Omit<BalanceDTO, 'iban'>;

const BalanceCard: React.FC<BalanceCardProps> = ({ availableBalance, ledgerBalance }) => {
  
  const formatCurrency = (amount: string): string => {
      const value = parseFloat(amount);
      return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
  };
  
  const formattedAvailable = formatCurrency(availableBalance);
  const formattedLedger = formatCurrency(ledgerBalance);
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Situazione Conto</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
          <span className="text-sm font-medium text-blue-800">Saldo Disponibile</span>
          <span className="text-2xl font-bold text-blue-900">{formattedAvailable}</span>
        </div>
        
        <div className="flex justify-between items-center p-2 border-t pt-3">
          <span className="text-sm text-gray-600">Saldo Contabile</span>
          <span className="text-lg font-medium text-gray-800">{formattedLedger}</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;