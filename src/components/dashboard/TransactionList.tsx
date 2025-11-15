import React from 'react';
import type { TransactionDTO } from '../../types/Models';

interface TransactionListProps {
  transactions: TransactionDTO[];
}

const formatCurrency = (amount: string): string => {
    const value = parseFloat(amount);
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {

  return (
    <div className="table-responsive">
      <table className="table table-hover table-striped">
        <thead>
          <tr className="table-light">
            <th scope="col">Data</th>
            <th scope="col">Descrizione</th>
            <th scope="col" className="text-end">Importo</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const amountValue = parseFloat(t.amount);
            const isDebit = amountValue < 0;
            const amountColor = isDebit ? 'text-danger fw-bold' : 'text-success fw-bold';
            
            return (
              <tr key={t.transactionId}>
                <td className="text-muted">
                  {new Date(t.timestamp).toLocaleDateString('it-IT')}
                </td>
                <td>
                  {t.description}
                  <p className="text-sm text-secondary mb-0 mt-1">{t.transactionType.replace('_', ' ')}</p>
                </td>
                <td className={`text-end ${amountColor}`}>
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