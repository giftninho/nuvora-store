import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthPanel from '../components/AuthPanel';
import { requestPasswordReset, validateEmail } from '../services/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setError('');
    setNotice('');
    setIsSubmitting(true);
    try {
      await requestPasswordReset(email);
      setNotice('If an account exists for that email, a password reset link is on its way.');
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPanel title="Reset your password" description="We’ll email you a secure link to choose a new password.">
      {error && <p className="auth-message auth-message-error" role="alert">{error}</p>}
      {notice && <p className="auth-message auth-message-success" role="status">{notice}</p>}
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="reset-email">Email</label>
          <input
            className="form-input"
            id="reset-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending link…' : 'Send Reset Link'}
        </button>
      </form>
      <p className="auth-alternate"><Link to="/login">Return to sign in</Link></p>
    </AuthPanel>
  );
}