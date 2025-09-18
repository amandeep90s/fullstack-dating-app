'use client';

import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/utils/helpers';
import Link from 'next/link';
import { memo, useCallback } from 'react';

const Logo = memo(function Logo() {
  return (
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
  );
});

const NavigationLinks = memo(function NavigationLinks() {
  const linkClassName = cn(
    'text-gray-700 hover:text-pink-600 dark:text-gray-300',
    'font-medium transition-colors duration-200 dark:hover:text-pink-400'
  );

  return (
    <div className={cn('hidden items-center space-x-8 md:flex')}>
      <Link href="/matches" className={linkClassName}>
        Discover
      </Link>
      <Link href="/matches/list" className={linkClassName}>
        Matches
      </Link>
      <Link href="/chat" className={linkClassName}>
        Messages
      </Link>
      <Link href="/profile" className={linkClassName}>
        Profile
      </Link>
    </div>
  );
});

export const Navbar = memo(function Navbar() {
  const { user, signOut } = useAuth();

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  const buttonClassName = cn(
    'cursor-pointer rounded-lg bg-gradient-to-r from-pink-500 to-red-500 px-4 py-2 text-sm font-medium text-white',
    'shadow-md transition-all duration-200 hover:from-pink-600 hover:to-red-600 hover:shadow-lg',
    'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'
  );

  return (
    <nav
      className={cn(
        'relative z-50 border-b border-gray-200/50 bg-slate-900 dark:border-gray-700/50'
      )}
    >
      <div className={cn('container mx-auto px-6')}>
        <div className={cn('flex h-16 items-center justify-between')}>
          <Logo />

          {/* Only show navigation if user is authenticated */}
          {user && <NavigationLinks />}

          {user ? (
            <button type="button" onClick={handleSignOut} className={buttonClassName}>
              Sign Out
            </button>
          ) : (
            <Link href="/auth" className={buttonClassName}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
});
