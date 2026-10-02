import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, loading, signOut } = useAuth();
  const [logoutError, setLogoutError] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setLogoutError('');
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      setLogoutError(error.message);
    } finally {
      setIsSigningOut(false);
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email;

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Nuvora Store</span>
          </div>
          <span className="brand-tagline">Simple finds. Beautifully delivered.</span>
        </NavLink>

        <nav>
          <ul className="navbar-nav">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Cart</span>
                <span className="cart-badge">{cartCount}</span>
              </NavLink>
            </li>
            {!loading && !user && (
              <li>
                <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Login</span>
                </NavLink>
              </li>
            )}
            {!loading && user && (
              <>
                <li className="nav-user" title={user.email || ''}>
                  <span className="nav-user-indicator" aria-hidden="true">✓</span>
                  <span className="nav-user-name">Welcome, {displayName}</span>
                </li>
                <li>
                  <button className="nav-link nav-logout" type="button" onClick={handleSignOut} disabled={isSigningOut}>
                    {isSigningOut ? 'Signing out…' : 'Log out'}
                  </button>
                </li>
              </>
            )}
          </ul>
          {logoutError && <p className="nav-auth-error" role="alert">{logoutError}</p>}
        </nav>
      </div>
    </header>
  );
}
