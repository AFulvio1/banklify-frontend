import React, { useState } from 'react';
import type { TransactionDTO } from '../../types/Models';

interface TransactionListProps {
  transactions: TransactionDTO[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 5;
const ROW_HEIGHT = '60px';

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

const PaginatorButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}> = ({ onClick, disabled, active, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  const primaryColor = 'var(--bs-primary)';
  
  const getBackgroundColor = () => {
    if (active) return primaryColor;
    if (isHovered && !disabled) return 'rgba(17, 52, 106, 0.1)';
    return 'transparent';
  };

  const getColor = () => {
    if (active) return 'white';
    if (isHovered && !disabled) return primaryColor; 
    return primaryColor;
  };

  const getBorder = () => {
    if (active) return 'none';
    if (isHovered && !disabled) return `1px solid ${primaryColor}`;
    return '1px solid transparent';
  };

  const style = {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: getBorder(),
    backgroundColor: getBackgroundColor(),
    color: getColor(),
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  };

  return (
    <button
      className="btn shadow-none p-0"
      onClick={onClick}
      disabled={disabled}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
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
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
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
                <td className="text-nowrap ps-4" style={{ width: '220px' }}>
                  <div className="d-flex align-items-baseline">
                    <span className="fw-bold fs-6" style={{ color: 'var(--bs-primary)' }}>{formattedDate}</span>
                    <span className="ms-2 fs-6 text-muted">{formattedTime}</span>
                  </div>
                </td>

                <td>
                  <div className="d-flex align-items-center justify-content-center text-truncate">
                    <span className="fw-bold me-2 fs-6" style={{ color: 'var(--bs-primary)' }}>
                      {t.counterpartyName || "Sconosciuto"}
                    </span>
                    <span className="text-muted me-2">-</span>
                    <span className="text-muted text-truncate" style={{ maxWidth: '350px' }}>
                      {t.description}
                    </span>
                  </div>
                </td>

                <td className="text-end pe-4" style={{ width: '150px' }}>
                    <span className={`fw-bold ${amountColor}`} style={{ fontSize: '1.15rem' }}>
                        {formatCurrency(t.amount)}
                    </span>
                </td>
              </tr>
            );
          })}

          {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, index) => (
            <tr key={`empty-${index}`} style={{ height: ROW_HEIGHT }}>
              <td colSpan={3}>&nbsp;</td>
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
        <div className="border-top py-2 d-flex align-items-center justify-content-center bg-light rounded-bottom">
          <nav aria-label="Navigazione transazioni">
            <ul className="pagination mb-0 gap-2 align-items-center">
              
              <li className="page-item">
                <PaginatorButton 
                  onClick={handlePrev} 
                  disabled={currentPage === 1}
                >
                  <ChevronLeft />
                </PaginatorButton>
              </li>

              {Array.from({ length: totalLoadedPages }, (_, i) => i + 1).map(pageNum => (
                <li key={pageNum} className="page-item">
                  <PaginatorButton 
                    onClick={() => handlePageClick(pageNum)} 
                    active={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginatorButton>
                </li>
              ))}

              <li className="page-item">
                <PaginatorButton 
                  onClick={handleNext} 
                  disabled={(isLoading && currentPage === totalLoadedPages) || (!hasMore && currentPage === totalLoadedPages)}
                >
                  {isLoading && currentPage === totalLoadedPages ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <ChevronRight />
                  )}
                </PaginatorButton>
              </li>

            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TransactionList;