'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FullPageLoader } from './FullPageLoader';

interface WithAuthOptions {
  redirectTo?: string;
  loadingText?: string;
}

/**
 * Higher-Order Component that protects pages by ensuring user authentication.
 * Redirects unauthenticated users to the specified redirect URL (defaults to '/auth').
 * Shows a loading screen while checking authentication status.
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = '/auth', loadingText = 'Checking authentication...' } = options;

  const AuthenticatedComponent = (props: P) => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    // Redirect to auth page if user is not authenticated
    useEffect(() => {
      if (!authLoading && !user) {
        router.push(redirectTo);
      }
    }, [user, authLoading, router]);

    // Show loading screen while checking auth status
    if (authLoading) {
      return <FullPageLoader text={loadingText} />;
    }

    // Don't render anything if user is not authenticated (will redirect)
    if (!user) {
      return null;
    }

    // Render the wrapped component if user is authenticated
    return <WrappedComponent {...props} />;
  };

  // Set display name for better debugging
  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
}

/**
 * Hook for authentication protection that can be used directly in components.
 * Returns authentication state and handles redirection.
 */
export function useAuthProtection(redirectTo: string = '/auth') {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(redirectTo);
    }
  }, [user, authLoading, router, redirectTo]);

  return {
    user,
    authLoading,
    isAuthenticated: !!user && !authLoading,
  };
}
