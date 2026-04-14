import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapUser = useCallback((u: SupabaseUser | null): User | null => {
    if (!u) return null;
    return {
      id: u.id,
      email: u.email ?? '',
      name: (u.user_metadata?.name as string | undefined) ?? (u.user_metadata?.full_name as string | undefined),
      avatar_url: u.user_metadata?.avatar_url as string | undefined,
    };
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(mapUser(data.session?.user ?? null));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUser(session?.user ?? null));
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [mapUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!email) return { error: 'Email is required' };
    if (!password) return { error: 'Password is required' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    if (!email) return { error: 'Email is required' };
    if (!password || password.length < 6) return { error: 'Password must be at least 6 characters' };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!email) return { error: 'Email is required' };
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return { error: error.message };
    return {};
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!password || password.length < 6) return { error: 'Password must be at least 6 characters' };
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: error.message };
    return {};
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
