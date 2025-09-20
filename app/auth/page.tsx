'use client';

import { FullPageLoader } from '@/components';
import { useAuth } from '@/contexts/auth-context';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Show loading screen while checking auth status
  if (authLoading) {
    return <FullPageLoader />;
  }

  function validateForm() {
    const errors: { name?: string; email?: string; password?: string } = {};

    if (isSignUp && !name.trim()) {
      errors.name = 'Name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function resetForm() {
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
    setValidationErrors({});
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (error) throw error;
        if (data.user && !data.session) {
          setError('Please check your email for a confirmation link.');
          resetForm();
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        'flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 to-red-100',
        'dark:from-gray-900 dark:to-gray-800'
      )}
    >
      <div className={cn('w-full max-w-md space-y-8 p-8')}>
        <div className={cn('text-center')}>
          <h1 className={cn('mb-2 text-4xl font-bold text-gray-900 dark:text-white')}>
            StreamMatch
          </h1>

          <p className={cn('text-gray-600 dark:text-gray-400')}>
            {isSignUp ? 'Create Your Account' : 'Sign in to your account'}
          </p>
        </div>

        <form className={cn('space-y-6')} onSubmit={handleAuth}>
          {isSignUp && (
            <div>
              <label
                htmlFor="name"
                className={cn('block text-sm font-medium text-gray-700 dark:text-gray-300')}
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className={cn(
                  'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm',
                  'placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500 focus:outline-none',
                  'dark:bg-gray-800 dark:text-white',
                  validationErrors.name
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                )}
                disabled={loading}
                autoComplete="name"
              />
              {validationErrors.name && (
                <p className={cn('mt-1 text-sm text-red-600 dark:text-red-400')}>
                  {validationErrors.name}
                </p>
              )}
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className={cn('block text-sm font-medium text-gray-700 dark:text-gray-300')}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={cn(
                'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm',
                'placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500 focus:outline-none',
                'dark:bg-gray-800 dark:text-white',
                validationErrors.email
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              )}
              disabled={loading}
              autoComplete="email"
            />
            {validationErrors.email && (
              <p className={cn('mt-1 text-sm text-red-600 dark:text-red-400')}>
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className={cn('block text-sm font-medium text-gray-700 dark:text-gray-300')}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={cn(
                'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm',
                'placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500 focus:outline-none',
                'dark:bg-gray-800 dark:text-white',
                validationErrors.password
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              )}
              disabled={loading}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
            {validationErrors.password && (
              <p className={cn('mt-1 text-sm text-red-600 dark:text-red-400')}>
                {validationErrors.password}
              </p>
            )}
          </div>

          {error && (
            <div className={cn('text-center text-sm text-red-600 dark:text-red-400')}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 shadow-sm',
              'min-h-[44px] cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 text-sm font-medium text-white',
              'hover:from-pink-600 hover:to-red-600 focus:ring-2 focus:ring-offset-2 focus:outline-none',
              'transition-colors focus:ring-pink-500 disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className={cn('text-center')}>
          <button
            type="button"
            onClick={() => {
              setIsSignUp((prev) => !prev);
              resetForm();
            }}
            className={cn(
              'cursor-pointer text-sm text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300',
              'focus:underline focus:outline-none'
            )}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
