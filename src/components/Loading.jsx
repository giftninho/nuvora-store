import React from 'react';

export default function Loading({ message = 'Loading products...' }) {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}
