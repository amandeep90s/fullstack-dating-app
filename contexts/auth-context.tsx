'use client';

import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setUser(session?.user ?? null);
        setError(null);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          setUser(session?.user ?? null);
          if (event === 'SIGNED_OUT') {
            setError(null);
          }
        });
        return () => {
          subscription.unsubscribe();
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to initialize authentication';
        console.error('Auth initialization error:', error);
        setError(errorMessage);
        setUser(null);
        // Return a no-op unsubscribe function to satisfy return type
        return () => {};
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, []);

  async function signOut() {
    try {
      await supabase.auth.signOut();

      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
