'use client';

import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/utils/helpers';
import Link from 'next/link';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav
      className={cn(
        'relative z-50 border-b border-gray-200/50 bg-slate-900 dark:border-gray-700/50'
      )}
    >
      <div className={cn('container mx-auto px-6')}>
        <div className={cn('flex h-16 items-center justify-between')}>
          <Link href="/" className={cn('flex items-center space-x-3')}>
            <span
              className={cn(
                'bg-gradient-to-r from-gray-900 to-gray-700 text-xl font-bold',
                'bg-clip-text text-transparent dark:from-white dark:to-gray-200'
              )}
            >
              StreamMatch
            </span>
          </Link>

          {/* Only show navigation is user is authenticated */}
          {user && (
            <div className={cn('hidden items-center space-x-8 md:flex')}>
              <Link
                href="/matches"
                className={cn(
                  'text-gray-700 hover:text-pink-600 dark:text-gray-300',
                  'font-medium transition-colors duration-200 dark:hover:text-pink-400'
                )}
              >
                Discover
              </Link>
              <Link
                href="/matches/list"
                className={cn(
                  'text-gray-700 hover:text-pink-600 dark:text-gray-300',
                  'font-medium transition-colors duration-200 dark:hover:text-pink-400'
                )}
              >
                Matches
              </Link>
              <Link
                href="/chat"
                className={cn(
                  'text-gray-700 hover:text-pink-600 dark:text-gray-300',
                  'font-medium transition-colors duration-200 dark:hover:text-pink-400'
                )}
              >
                Messages
              </Link>
              <Link
                href="/profile"
                className={cn(
                  'text-gray-700 hover:text-pink-600 dark:text-gray-300',
                  'font-medium transition-colors duration-200 dark:hover:text-pink-400'
                )}
              >
                Profile
              </Link>
            </div>
          )}

          {user ? (
            <button
              type="button"
              onClick={signOut}
              className={cn(
                'cursor-pointer rounded-lg bg-gradient-to-r from-pink-500 to-red-500 px-4 py-2 text-sm font-medium text-white',
                'shadow-md transition-all duration-200 hover:from-pink-600 hover:to-red-600 hover:shadow-lg'
              )}
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth"
              className={cn(
                'cursor-pointer rounded-lg bg-gradient-to-r from-pink-500 to-red-500 px-4 py-2 text-sm font-medium text-white',
                'shadow-md transition-all duration-200 hover:from-pink-600 hover:to-red-600 hover:shadow-lg'
              )}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
