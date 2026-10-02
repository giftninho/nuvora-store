import React from 'react';

export default function AuthPanel({ title, description, children }) {
  return (
    <section className="auth-panel">
      <div className="page-header auth-page-header">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{description}</p>
      </div>
      <div className="card-placeholder auth-card">{children}</div>
    </section>
  );
}