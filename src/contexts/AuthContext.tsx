import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

/**
 * Mock auth provider — swap internals with real Supabase calls when ready.
 * 
 * To integrate Supabase:
 * 1. Install @supabase/supabase-js
 * 2. Create a supabase client with your keys
 * 3. Replace signIn/signUp/signOut/resetPassword with supabase.auth.* calls
 * 4. Replace the useEffect with supabase.auth.onAuthStateChange
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('apex_auth_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    if (u) localStorage.setItem('apex_auth_user', JSON.stringify(u));
    else localStorage.removeItem('apex_auth_user');
    setUser(u);
  };

  const signIn = useCallback(async (email: string, _password: string) => {
    // Mock: accept any credentials
    if (!email) return { error: 'Email is required' };
    persist({ id: crypto.randomUUID(), email, name: email.split('@')[0] });
    return {};
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    if (!email) return { error: 'Email is required' };
    if (!password || password.length < 6) return { error: 'Password must be at least 6 characters' };
    persist({ id: crypto.randomUUID(), email, name: name || email.split('@')[0] });
    return {};
  }, []);

  const signOut = useCallback(async () => {
    persist(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!email) return { error: 'Email is required' };
    // Mock: always succeed
    return {};
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!password || password.length < 6) return { error: 'Password must be at least 6 characters' };
    return {};
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
