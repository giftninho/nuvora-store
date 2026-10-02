import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { getFriendlyAuthError } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [client, setClient] = useState(null);

  useEffect(() => {
    let subscription;

    try {
      const supabase = getSupabaseClient();
      setClient(supabase);
      const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
        setLoading(false);
      });
      subscription = data.subscription;
    } catch (error) {
      setAuthError(getFriendlyAuthError(error, 'Authentication is unavailable right now.'));
      setLoading(false);
    }

    return () => subscription?.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    if (!client) throw new Error('Authentication is unavailable right now.');
    const { error } = await client.auth.signOut();
    if (error) {
      throw new Error(getFriendlyAuthError(error, 'We could not sign you out. Please try again.'));
    }
  }, [client]);

  return (
    <AuthContext.Provider value={{ session, user, loading, authError, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}