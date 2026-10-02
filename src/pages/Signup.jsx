import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPanel from '../components/AuthPanel';
import { signUpWithEmail, validateEmail, validatePassword } from '../services/auth';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
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
    setNotice('');
    setIsSubmitting(true);
    try {
      const result = await signUpWithEmail({ fullName, email, password });
      if (result.confirmationRequired) {
        setNotice('Your account is ready. Check your email and confirm your address before signing in.');
      } else {
        navigate('/', { replace: true });
      }
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPanel title="Create your account" description="Sign up to make checkout quicker and manage your orders.">
      {error && <p className="auth-message auth-message-error" role="alert">{error}</p>}
      {notice && <p className="auth-message auth-message-success" role="status">{notice}</p>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="signup-name">Full name</label>
          <input
            className="form-input"
            id="signup-name"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="signup-email">Email</label>
          <input
            className="form-input"
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="signup-password">Password</label>
          <input
            className="form-input"
            id="signup-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
          />
          <p className="auth-hint">Use at least 8 characters.</p>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="signup-confirm-password">Confirm password</label>
          <input
            className="form-input"
            id="signup-confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
      <p className="auth-alternate">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthPanel>
  );
}