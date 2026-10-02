import { getSupabaseClient } from '../lib/supabase';

export function validateEmail(email) {
  if (!email?.trim()) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Enter a valid email address.';
  }
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Use a password with at least 8 characters.';
  return '';
}

export function getFriendlyAuthError(error, fallback = 'We could not complete that request. Please try again.') {
  const message = String(error?.message || '').toLowerCase();

  if (message.includes('supabase is not configured')) {
    return 'Authentication is not configured yet. Check the Supabase settings and try again.';
  }
  if (message.includes('invalid login credentials')) {
    return 'Email or password is incorrect.';
  }
  if (message.includes('email not confirmed')) {
    return 'Please confirm your email using the link we sent before signing in.';
  }
  if (message.includes('already registered') || message.includes('user already exists')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (message.includes('password should be at least') || message.includes('weak_password')) {
    return 'Choose a stronger password with at least 8 characters.';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'We could not reach the authentication service. Check your connection and try again.';
  }
  return fallback;
}

async function unwrapAuthResult(request, fallback) {
  const result = await request;
  if (result.error) throw new Error(getFriendlyAuthError(result.error, fallback));
  return result.data;
}

export async function signUpWithEmail({ fullName, email, password }) {
  const supabase = getSupabaseClient();
  const data = await unwrapAuthResult(
    supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    }),
    'We could not create your account. Please try again.'
  );

  return { ...data, confirmationRequired: !data.session };
}

export async function signInWithEmail({ email, password }) {
  const supabase = getSupabaseClient();
  return unwrapAuthResult(
    supabase.auth.signInWithPassword({ email: email.trim(), password }),
    'We could not sign you in. Please try again.'
  );
}

export async function requestPasswordReset(email) {
  const supabase = getSupabaseClient();
  return unwrapAuthResult(
    supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    }),
    'We could not send a password reset link. Please try again.'
  );
}

export async function updatePassword(password) {
  const supabase = getSupabaseClient();
  return unwrapAuthResult(
    supabase.auth.updateUser({ password }),
    'We could not update your password. Please try again.'
  );
}