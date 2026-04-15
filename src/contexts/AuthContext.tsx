import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useAccount, useDisconnect } from 'wagmi';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  wallet_address?: string;
  auth_method?: 'email' | 'wallet';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ error?: string; needsEmailConfirmation?: boolean; message?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  linkWalletEmail: (
    email: string,
    password: string
  ) => Promise<{ error?: string; needsEmailConfirmation?: boolean; message?: string }>;
  updateProfileName: (name: string) => Promise<{ error?: string }>;
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
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const mapUser = useCallback((u: SupabaseUser | null): User | null => {
    if (!u) return null;
    return {
      id: u.id,
      email: u.email ?? '',
      name: (u.user_metadata?.name as string | undefined) ?? (u.user_metadata?.full_name as string | undefined),
      avatar_url: u.user_metadata?.avatar_url as string | undefined,
      auth_method: 'email',
    };
  }, []);

  const mapWalletUser = useCallback((walletAddr?: string): User | null => {
    if (!walletAddr) return null;
    return {
      id: `wallet:${walletAddr.toLowerCase()}`,
      email: '',
      name: 'Wallet User',
      wallet_address: walletAddr,
      auth_method: 'wallet',
    };
  }, []);

  const ensureWalletProfile = useCallback(async (walletAddr?: string) => {
    if (!walletAddr) return;
    const { error } = await supabase.from('wallet_profiles').upsert(
      {
        wallet_address: walletAddr.toLowerCase(),
        display_name: 'Wallet User',
        updated_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: 'wallet_address' }
    );
    if (error) {
      // Keep non-fatal for auth UX; DB bootstrap can be fixed independently.
      console.warn('wallet_profiles upsert failed:', error.message);
    }
  }, []);

  const linkWalletToAuthUser = useCallback(async (walletAddr: string, authUserId: string) => {
    const { error } = await supabase.from('wallet_profiles').upsert(
      {
        wallet_address: walletAddr.toLowerCase(),
        linked_auth_user_id: authUserId,
        updated_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: 'wallet_address' }
    );
    if (error) {
      console.warn('wallet_profiles link upsert failed:', error.message);
    }
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const sessionUser = mapUser(data.session?.user ?? null);
      setUser(sessionUser ?? mapWalletUser(isConnected ? address : undefined));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = mapUser(session?.user ?? null);
      setUser(sessionUser ?? mapWalletUser(isConnected ? address : undefined));
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [address, isConnected, mapUser, mapWalletUser]);

  useEffect(() => {
    const syncWallet = async () => {
      if (!isConnected || !address) {
        return;
      }
      // If no Supabase session is active, allow wallet-only access path.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setUser(mapWalletUser(address));
      } else {
        await linkWalletToAuthUser(address, session.user.id);
      }
      await ensureWalletProfile(address);
    };
    syncWallet().finally(() => setLoading(false));
  }, [address, ensureWalletProfile, isConnected, linkWalletToAuthUser, mapWalletUser]);

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
    const emailRedirectTo = `${window.location.origin}/login`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          name: name || email.split('@')[0],
        },
      },
    });
    if (error) return { error: error.message };

    // Supabase returns a null session when email confirmation is required.
    const needsEmailConfirmation = !data.session;
    if (needsEmailConfirmation) {
      return {
        needsEmailConfirmation: true,
        message: 'Account created. Check your email and confirm before signing in.',
      };
    }
    return { message: 'Account created. You are now signed in.' };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    if (isConnected) disconnect();
  }, [disconnect, isConnected]);

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

  const updateProfileName = useCallback(async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return { error: 'Display name cannot be empty' };
    const { error } = await supabase.auth.updateUser({
      data: { name: trimmed },
    });
    if (error) return { error: error.message };
    if (isConnected && address) {
      const { error: profileError } = await supabase.from('wallet_profiles').upsert(
        {
          wallet_address: address.toLowerCase(),
          display_name: trimmed,
          updated_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'wallet_address' }
      );
      if (profileError) {
        console.warn('wallet_profiles display_name upsert failed:', profileError.message);
      }
    }
    return {};
  }, [address, isConnected]);

  const linkWalletEmail = useCallback(async (email: string, password: string) => {
    if (!isConnected || !address) return { error: 'Connect wallet first.' };
    if (!email) return { error: 'Email is required' };
    if (!password || password.length < 6) return { error: 'Password must be at least 6 characters' };

    const emailRedirectTo = `${window.location.origin}/login`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          wallet_address: address.toLowerCase(),
          linked_via: 'wallet',
        },
      },
    });
    if (error) return { error: error.message };

    if (data.user?.id) {
      await linkWalletToAuthUser(address, data.user.id);
    }

    return {
      needsEmailConfirmation: !data.session,
      message: !data.session
        ? 'Email added. Confirm from your inbox, then sign in with email.'
        : 'Email linked successfully.',
    };
  }, [address, isConnected, linkWalletToAuthUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        linkWalletEmail,
        updateProfileName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
