import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSession(data.session);
      setUser(data.user);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setSession(null);
      setUser(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to sign out.');
      return false;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Note: User will need to confirm email before they can sign in
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to sign up.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signOut,
    signUp,
    isAuthenticated: !!session,
  };
};
