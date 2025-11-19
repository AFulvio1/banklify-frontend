import React from 'react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="alert alert-danger text-center" role="alert">
      <strong>Errore:</strong> {message}
    </div>
  );
};

export default ErrorMessage;