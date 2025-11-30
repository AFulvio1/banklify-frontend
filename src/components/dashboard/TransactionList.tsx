import React, { useState } from 'react';
import type { TransactionDTO } from '../../types/Models';

interface TransactionListProps {
  transactions: TransactionDTO[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 5;

const ROW_HEIGHT = '56px';

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
  </svg>
);

const formatCurrency = (amount: string): string => {
  const value = parseFloat(amount);
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
};

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onLoadMore, 
  hasMore, 
  isLoading 
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.eventTimestamp); 
    const dateB = new Date(b.eventTimestamp);
    return dateB.getTime() - dateA.getTime();
  });

  const totalLoadedPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  
  const currentTransactions = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem);
  
  const emptyRows = ITEMS_PER_PAGE - currentTransactions.length;

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalLoadedPages) {
      setCurrentPage(prev => prev + 1);
    } else if (hasMore) {
      onLoadMore();
    }
  };

  const handlePageClick = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  return (
    <div className="table-responsive shadow-sm rounded bg-white">
      <table className="table table-hover align-middle mb-0">
        <tbody>
          {currentTransactions.map((t) => {
            const amountValue = parseFloat(t.amount);
            const isDebit = amountValue < 0;
            const amountColor = isDebit ? 'text-danger' : 'text-success';
            
            const dateObj = new Date(t.eventTimestamp); 
            const isValidDate = !isNaN(dateObj.getTime());

            const formattedDate = isValidDate 
                ? dateObj.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
                : '--/--/----';
            
            const formattedTime = isValidDate
                ? dateObj.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
                : '--:--';

            return (
              <tr key={t.transactionId || `${t.eventTimestamp}-${t.amount}-${Math.random()}`} style={{ height: ROW_HEIGHT }}>
                <td className="text-nowrap" style={{ width: '120px' }}>
                  <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{formattedDate}</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>{formattedTime}</div>
                </td>

                <td>
                  <div className="d-flex align-items-center justify-content-center text-truncate">
                    <span className="fw-bold text-dark me-2">
                      {t.counterpartyName || "Sconosciuto"}
                    </span>
                    
                    <span className="text-muted me-2">-</span>
                    
                    <span className="text-muted text-truncate" style={{ maxWidth: '400px' }}>
                      {t.description}
                    </span>
                  </div>
                </td>

                <td className="text-end" style={{ width: '140px' }}>
                    <span className={`fw-bold ${amountColor}`} style={{ fontSize: '1.1rem' }}>
                        {formatCurrency(t.amount)}
                    </span>
                </td>
              </tr>
            );
          })}

          {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, index) => (
            <tr key={`empty-${index}`} style={{ height: ROW_HEIGHT }}>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          ))}

        </tbody>
      </table>
      
      {transactions.length === 0 && !isLoading && (
        <div className="text-center p-5 text-muted bg-white">
            Nessuna transazione trovata
        </div>
      )}

      {transactions.length > 0 && (
        <div className="border-top d-flex align-items-center justify-content-center" style={{ height: ROW_HEIGHT }}>
          <nav aria-label="Navigazione transazioni">
            <ul className="pagination justify-content-center mb-0">
              
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={handlePrev} 
                  aria-label="Precedente"
                  style={{ color: 'var(--bs-primary)' }}
                >
                  <ChevronLeft />
                </button>
              </li>

              {Array.from({ length: totalLoadedPages }, (_, i) => i + 1).map(pageNum => (
                <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageClick(pageNum)}
                    style={{
                      backgroundColor: currentPage === pageNum ? 'var(--bs-primary)' : 'white',
                      borderColor: currentPage === pageNum ? 'var(--bs-primary)' : '#dee2e6',
                      color: currentPage === pageNum ? 'white' : 'var(--bs-primary)'
                    }}
                  >
                    {pageNum}
                  </button>
                </li>
              ))}

              <li className={`page-item ${(!hasMore && currentPage === totalLoadedPages) ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={handleNext} 
                  disabled={isLoading && currentPage === totalLoadedPages}
                  aria-label="Successivo"
                  style={{ color: 'var(--bs-primary)' }}
                >
                  {isLoading && currentPage === totalLoadedPages ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <ChevronRight />
                  )}
                </button>
              </li>

            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TransactionList;