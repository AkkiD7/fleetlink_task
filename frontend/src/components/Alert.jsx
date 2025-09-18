import React from 'react';

const Alert = ({ type, message }) => {
  const baseClasses = 'p-4 rounded-md text-sm font-medium';
  const typeClasses = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  if (!message) return null;

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      {message}
    </div>
  );
};

export default Alert;