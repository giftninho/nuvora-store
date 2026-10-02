import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthPanel from '../components/AuthPanel';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { signIn, signInWithGoogle, validateEmail } from '../services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await signIn({ email, password });
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (authError) {
      setError(authError.message);
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPanel
      title="Welcome to Nuvora Store"
      description="Sign in to manage your orders and speed up checkout."
    >
      {location.state?.message && <p className="auth-message auth-message-success" role="status">{location.state.message}</p>}
      {error && <p className="auth-message auth-message-error" role="alert">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email</label>
          <input
            className="form-input"
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="login-password">Password</label>
          <input
            className="form-input"
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="auth-inline-link">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <div className="auth-divider"><span>or</span></div>
      <GoogleSignInButton onClick={handleGoogleSignIn} disabled={isSubmitting} />

      <p className="auth-alternate">
        New to Nuvora Store? <Link to="/signup">Create an account</Link>
      </p>
    </AuthPanel>
  );
}