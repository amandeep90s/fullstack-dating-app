'use client';

import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/helpers/helpers';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useCallback, useState } from 'react';

// Shared utility function for checking active state
const useIsActive = () => {
  const pathname = usePathname();

  return (path: string) => {
    if (path === '/matches' && pathname === '/matches') {
      return true;
    }
    if (path === '/matches/list' && pathname === '/matches/list') {
      return true;
    }
    if (path === '/chat' && pathname.startsWith('/chat')) {
      return true;
    }
    if (path === '/profile' && pathname.startsWith('/profile')) {
      return true;
    }
    return false;
  };
};

// Shared navigation items configuration
const navigationItems = [
  { href: '/matches', label: 'Discover' },
  { href: '/matches/list', label: 'Matches' },
  { href: '/chat', label: 'Messages' },
  { href: '/profile', label: 'Profile' },
] as const;

const Logo = memo(function Logo() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <Link href="/" className={cn('flex items-center space-x-3')}>
      <span
        className={cn(
          'text-xl font-bold transition-colors duration-200',
          isHomePage
            ? 'bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-200'
        )}
      >
        StreamMatch
      </span>
    </Link>
  );
});

const NavigationLinks = memo(function NavigationLinks() {
  const isActive = useIsActive();

  const getLinkClassName = (path: string) => {
    return cn(
      'font-medium transition-colors duration-200 relative',
      isActive(path)
        ? 'text-pink-500 dark:text-pink-400'
        : 'text-gray-700 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400'
    );
  };

  return (
    <div className={cn('hidden items-center space-x-8 md:flex')}>
      {navigationItems.map(({ href, label }) => (
        <Link key={href} href={href} className={getLinkClassName(href)}>
          <span className={cn('relative')}>
            {label}
            {isActive(href) && (
              <span
                className={cn(
                  'absolute right-0 -bottom-1 left-0 h-0.5 bg-pink-500 dark:bg-pink-400'
                )}
              />
            )}
          </span>
        </Link>
      ))}
    </div>
  );
});

const MobileNavigationLinks = memo(function MobileNavigationLinks({
  onClose,
}: {
  onClose: () => void;
}) {
  const isActive = useIsActive();

  const getMobileLinkClassName = (path: string) => {
    return cn(
      'block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md',
      isActive(path)
        ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400'
        : 'text-gray-700 hover:bg-gray-100 hover:text-pink-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-pink-400'
    );
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className={cn('space-y-1 px-2 pt-2 pb-3')}>
      {navigationItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={getMobileLinkClassName(href)}
          onClick={handleLinkClick}
        >
          {label}
        </Link>
      ))}
    </div>
  );
});

export const Navbar = memo(function Navbar() {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

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

          {/* Desktop Navigation */}
          {user && <NavigationLinks />}

          {/* Mobile menu button */}
          {user && (
            <button
              type="button"
              className={cn(
                'inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-pink-500 focus:outline-none focus:ring-inset md:hidden dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200'
              )}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className={cn('sr-only')}>Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className={cn('block h-6 w-6')}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              ) : (
                <svg
                  className={cn('block h-6 w-6')}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className={cn(buttonClassName, 'hidden md:inline-flex')}
            >
              Sign Out
            </button>
          ) : (
            <Link href="/auth" className={cn(buttonClassName, 'hidden md:inline-flex')}>
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu */}
        {user && isMobileMenuOpen && (
          <div
            className={cn('animate-in slide-in-from-top-2 duration-300 md:hidden')}
            id="mobile-menu"
          >
            <div className={cn('border-t border-gray-200/50 dark:border-gray-700/50')}>
              <MobileNavigationLinks onClose={closeMobileMenu} />
              <div className={cn('border-t border-gray-200/30 px-2 py-3 dark:border-gray-700/30')}>
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleSignOut();
                      closeMobileMenu();
                    }}
                    className={cn(buttonClassName, 'w-full justify-center')}
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    className={cn(buttonClassName, 'block w-full text-center')}
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});
