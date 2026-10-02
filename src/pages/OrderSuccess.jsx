import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatNaira } from '../utils/currency';
import { retryOrderConfirmationEmail } from '../services/orders';

export default function OrderSuccess() {
  const location = useLocation();
  const orderData = location.state;
  const [emailStatus, setEmailStatus] = useState(orderData?.emailStatus || 'pending');
  const [isRetryingEmail, setIsRetryingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleRetryEmail = async () => {
    if (!orderData?.emailDeliveryToken || isRetryingEmail) return;
    setIsRetryingEmail(true);
    setEmailError('');
    try {
      setEmailStatus(await retryOrderConfirmationEmail(
        orderData.orderId,
        orderData.emailDeliveryToken,
      ));
    } catch (error) {
      setEmailStatus('failed');
      setEmailError(error.message);
    } finally {
      setIsRetryingEmail(false);
    }
  };

  // If the page is accessed directly (no state), show a graceful fallback.
  if (!orderData || !orderData.orderId) {
    return (
      <div className="order-success-page" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
        <div className="card-placeholder" style={{ padding: '3.5rem 2rem' }}>
          <h1 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            No Order Found
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            It looks like you arrived here without completing a checkout.
            If you recently placed an order, the confirmation was shown after submission.
          </p>
          <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
      <div className="card-placeholder" style={{ padding: '3.5rem 2rem' }}>
        {/* Checkmark icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#dcfce7',
          color: '#16a34a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <span className="phase-tag" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
          Order Successful
        </span>

        <h1 className="page-title" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
          Thank you for your order, {orderData.customerName}!
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
          Your order <strong>#{orderData.orderId}</strong> has been received.
        </p>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>
          Order total: <strong>{formatNaira(Number(orderData.total))}</strong>
        </p>

        <p className={`order-email-status order-email-status--${emailStatus}`} role={emailStatus === 'failed' ? 'alert' : 'status'}>
          {emailStatus === 'sent' && <>A confirmation email has been sent to <strong>{orderData.email}</strong>.</>}
          {emailStatus === 'sending' && 'Your order is saved. The confirmation email is being processed.'}
          {emailStatus === 'failed' && (
            <>
              Your order is saved, but we could not send the confirmation email to <strong>{orderData.email}</strong>.
              {emailError && <span className="order-email-error"> {emailError}</span>}
            </>
          )}
          {emailStatus === 'pending' && 'Your order is saved. Confirmation email status is not available yet.'}
        </p>

        {emailStatus === 'failed' && orderData.emailDeliveryToken && (
          <button
            className="btn btn-outline order-email-retry"
            type="button"
            onClick={handleRetryEmail}
            disabled={isRetryingEmail}
          >
            {isRetryingEmail ? 'Sending confirmation…' : 'Retry confirmation email'}
          </button>
        )}

        <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
