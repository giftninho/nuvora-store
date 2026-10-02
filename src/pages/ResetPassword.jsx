import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPanel from '../components/AuthPanel';
import { useAuth } from '../context/AuthContext';
import { updatePassword, validatePassword } from '../services/auth';

export default function ResetPassword() {
  const { user, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await updatePassword(password);
      setIsComplete(true);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AuthPanel title="Checking your reset link" description="Please wait while we verify the secure link from your email.">
        <div className="loading-container" role="status"><div className="spinner" />Checking your reset link…</div>
      </AuthPanel>
    );
  }

  if (!user) {
    return (
      <AuthPanel title="Choose a new password" description="Use the password reset link sent to your email to open this page.">
        <p className="auth-message auth-message-error" role="alert">
          This reset link is missing or has expired. Request a new link to continue.
        </p>
        <Link className="btn btn-primary btn-block" to="/forgot-password">Request a new reset link</Link>
      </AuthPanel>
    );
  }

  if (isComplete) {
    return (
      <AuthPanel title="Password updated" description="Your new password is ready to use.">
        <p className="auth-message auth-message-success" role="status">Your password has been changed successfully.</p>
        <button className="btn btn-primary btn-block" onClick={() => navigate('/', { replace: true })}>
          Continue to the store
        </button>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel title="Choose a new password" description="Make sure your new password is at least 8 characters.">
      {error && <p className="auth-message auth-message-error" role="alert">{error}</p>}
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="new-password">New password</label>
          <input
            className="form-input"
            id="new-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="confirm-new-password">Confirm new password</label>
          <input
            className="form-input"
            id="confirm-new-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating password…' : 'Update Password'}
        </button>
      </form>
    </AuthPanel>
  );
}