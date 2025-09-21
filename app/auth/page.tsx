'use client';

import { FormInput, FullPageLoader } from '@/components';
import { useAuth } from '@/contexts/auth-context';
import { BACKGROUND_STYLES, BUTTON_STYLES, TEXT_STYLES } from '@/lib/constants/styles';
import { cn } from '@/lib/helpers/helpers';
import type { SignInFormData, SignUpFormData } from '@/lib/schemas/auth';
import { signInSchema, signUpSchema } from '@/lib/schemas/auth';
import { createClient } from '@/lib/supabase/client';
import { handleError } from '@/lib/utils/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user, loading: authLoading, clearError } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  // Separate forms for sign in and sign up
  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '' },
  });

  useEffect(() => {
    if (user && !authLoading) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirectTo');
      router.push(redirectTo || '/');
    }
  }, [user, authLoading, router]);

  // Clear errors when switching modes
  useEffect(() => {
    setError(null);
    clearError();
    if (isSignUp) {
      signUpForm.reset({ name: '', email: '', password: '' });
    } else {
      signInForm.reset({ email: '', password: '' });
    }
  }, [isSignUp, signInForm, signUpForm, clearError]);

  const toggleMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
  }, []);

  const onSignInSubmit = useCallback(
    async (data: SignInFormData) => {
      setLoading(true);
      setError(null);

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;
      } catch (error) {
        const handledError = handleError(error);
        setError(handledError.message);
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  const onSignUpSubmit = useCallback(
    async (data: SignUpFormData) => {
      setLoading(true);
      setError(null);

      try {
        const { data: result, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: { full_name: data.name },
          },
        });

        if (error) throw error;

        if (result.user && !result.session) {
          setError('Please check your email for a confirmation link.');
          signUpForm.reset();
          return;
        }
      } catch (error) {
        const handledError = handleError(error);
        setError(handledError.message);
      } finally {
        setLoading(false);
      }
    },
    [supabase, signUpForm]
  );

  if (authLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className={cn(BACKGROUND_STYLES.gradient, BACKGROUND_STYLES.fullHeight)}>
      <div className={cn('w-full max-w-md space-y-8 p-8')}>
        <div className={cn('text-center')}>
          <h1 className={cn('mb-2 text-4xl font-bold', TEXT_STYLES.heading)}>StreamMatch</h1>
          <p className={cn(TEXT_STYLES.subheading)}>
            {isSignUp ? 'Create Your Account' : 'Sign in to your account'}
          </p>
        </div>

        {isSignUp ? (
          <form className={cn('space-y-6')} onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}>
            <FormInput
              type="text"
              label="Name"
              placeholder="Enter your name"
              disabled={loading}
              required
              autoComplete="name"
              error={signUpForm.formState.errors.name}
              {...signUpForm.register('name')}
            />

            <FormInput
              type="email"
              label="Email"
              placeholder="Enter your email"
              disabled={loading}
              required
              autoComplete="email"
              error={signUpForm.formState.errors.email}
              {...signUpForm.register('email')}
            />

            <FormInput
              type="password"
              label="Password"
              placeholder="Enter your password"
              disabled={loading}
              required
              autoComplete="new-password"
              error={signUpForm.formState.errors.password}
              {...signUpForm.register('password')}
            />

            {error && <div className={cn('text-center text-sm', TEXT_STYLES.error)}>{error}</div>}

            <button
              type="submit"
              disabled={loading || !signUpForm.formState.isValid}
              className={cn(BUTTON_STYLES.primary, 'min-h-[44px] w-full')}
            >
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form className={cn('space-y-6')} onSubmit={signInForm.handleSubmit(onSignInSubmit)}>
            <FormInput
              type="email"
              label="Email"
              placeholder="Enter your email"
              disabled={loading}
              required
              autoComplete="email"
              error={signInForm.formState.errors.email}
              {...signInForm.register('email')}
            />

            <FormInput
              type="password"
              label="Password"
              placeholder="Enter your password"
              disabled={loading}
              required
              autoComplete="current-password"
              error={signInForm.formState.errors.password}
              {...signInForm.register('password')}
            />

            {error && <div className={cn('text-center text-sm', TEXT_STYLES.error)}>{error}</div>}

            <button
              type="submit"
              disabled={loading || !signInForm.formState.isValid}
              className={cn(BUTTON_STYLES.primary, 'min-h-[44px] w-full')}
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
        )}

        <div className={cn('text-center')}>
          <button
            type="button"
            onClick={toggleMode}
            className={cn(
              'text-sm text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300',
              'cursor-pointer transition-colors focus:underline focus:outline-none'
            )}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
