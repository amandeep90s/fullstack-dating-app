'use client';

import { FullPageLoader } from '@/components';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/helpers/helpers';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageLoader text="StreamMatch" />;
  }

  return (
    <div
      className={cn(
        'flex min-h-full items-center justify-center bg-gradient-to-br from-slate-50',
        'to-pink-50 dark:from-slate-900 dark:to-slate-800'
      )}
    >
      {/* Hero Section - Full Page */}
      <section className={cn('relative w-full overflow-hidden')}>
        <div className={cn('absolute inset-0')}></div>
        <div className={cn('relative container mx-auto px-6 py-20 lg:py-32')}>
          <div className={cn('mx-auto max-w-4xl text-center')}>
            <h1 className={cn('mb-6 text-5xl font-bold text-gray-900 lg:text-7xl dark:text-white')}>
              Find Your Perfect
              <span
                className={cn(
                  'block bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent'
                )}
              >
                StreamMatch
              </span>
            </h1>
            <p
              className={cn(
                'mb-8 text-xl leading-relaxed text-gray-600 lg:text-2xl dark:text-gray-300'
              )}
            >
              Connect with like-minded people through live streaming, meaningful conversations, and
              authentic connections.
            </p>

            {user ? (
              <div className={cn('flex flex-col justify-center gap-4 sm:flex-row')}>
                <Link
                  href="/matches"
                  className={cn(
                    'inline-flex transform items-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-pink-600 hover:to-purple-700 hover:shadow-xl'
                  )}
                >
                  Start Discovering
                  <svg
                    className={cn('ml-2 h-5 w-5')}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  href="/profile"
                  className={cn(
                    'inline-flex items-center rounded-full border-2 border-pink-500 px-8 py-4 text-lg font-semibold text-pink-500 transition-all duration-300 hover:bg-pink-500 hover:text-white dark:text-pink-400'
                  )}
                >
                  View Profile
                </Link>
              </div>
            ) : (
              <div className={cn('flex flex-col justify-center gap-4 sm:flex-row')}>
                <Link
                  href="/auth"
                  className={cn(
                    'inline-flex transform items-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-pink-600 hover:to-purple-700 hover:shadow-xl'
                  )}
                >
                  Get Started
                  <svg
                    className={cn('ml-2 h-5 w-5')}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  href="/matches"
                  className={cn(
                    'inline-flex items-center rounded-full border-2 border-pink-500 px-8 py-4 text-lg font-semibold text-pink-500 transition-all duration-300 hover:bg-pink-500 hover:text-white dark:text-pink-400'
                  )}
                >
                  Explore
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
