'use client';

import { createClient } from '@/lib/supabase/client';
import { handleError } from '@/lib/utils/errors';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Memoize the client to avoid recreating it
  const supabase = useMemo(() => createClient(), []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted) {
          setUser(session?.user ?? null);
          setError(null);
        }
      } catch (error) {
        const handledError = handleError(error);
        console.error('Auth initialization error:', handledError);
        if (mounted) {
          setError(handledError.message);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (mounted) {
        setUser(session?.user ?? null);
        if (event === 'SIGNED_OUT') {
          setError(null);
        }
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      router.push('/auth');
    } catch (error) {
      const handledError = handleError(error);
      console.error('Error signing out:', handledError);
      setError(handledError.message);
    }
  }, [supabase, router]);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      error,
      signOut,
      clearError,
    }),
    [user, loading, error, signOut, clearError]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
