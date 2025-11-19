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

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.eventTimestamp);
    const dateB = new Date(b.eventTimestamp);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="table-responsive">
      <table className="table table-hover table-striped align-middle">
        <thead>
          <tr className="table-light">
            <th scope="col" style={{ width: '150px' }}>Data</th>
            <th scope="col">Descrizione</th>
            <th scope="col" className="text-end" style={{ width: '120px' }}>Importo</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((t) => {
            const amountValue = parseFloat(t.amount);
            const isDebit = amountValue < 0;
            const amountColor = isDebit ? 'text-danger fw-bold' : 'text-success fw-bold';
            
            const dateObj = new Date(t.eventTimestamp); 
            const isValidDate = !isNaN(dateObj.getTime());

            const formattedDateTime = isValidDate 
                ? dateObj.toLocaleDateString('it-IT', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) 
                : 'Data non valida';

            return (
              <tr key={t.transactionId || `${t.eventTimestamp}-${t.amount}`}>
                <td className="text-muted text-nowrap">
                  {formattedDateTime}
                </td>
                <td>
                  <span className="fw-medium">{t.description}</span>
                </td>
                <td className={`text-end ${amountColor}`}>
                  {formatCurrency(t.amount)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {transactions.length === 0 && (
        <div className="text-center p-4 text-muted">
            Nessuna transazione trovata.
        </div>
      )}
    </div>
  );
};

export default TransactionList;