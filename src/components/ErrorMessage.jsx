import React from 'react';

export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="error-container" role="alert">
      <div className="error-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 className="error-title">{title}</h3>
      {message && <p className="error-description">{message}</p>}
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-outline" style={{ marginTop: '1rem' }}>
          Try Again
        </button>
      )}
    </div>
  );
}
