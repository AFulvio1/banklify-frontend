import React from 'react';
import type { TransactionDTO } from '../../types/Financial';

interface TransactionListProps {
  transactions: TransactionDTO[];
}

const formatCurrency = (amount: string): string => {
    const value = parseFloat(amount);
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo / Descrizione</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Importo</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((t) => {
            const isDebit = parseFloat(t.amount) < 0;
            const amountColor = isDebit ? 'text-red-600' : 'text-green-600';
            
            return (
              <tr key={t.transactionId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(t.timestamp).toLocaleDateString('it-IT')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {t.description}
                  <p className="text-xs text-gray-400 mt-0.5">{t.transactionType}</p>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${amountColor}`}>
                  {formatCurrency(t.amount)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;