'use client';

import { FullPageLoader, withAuth } from '@/components';
import { getUserMatches } from '@/lib/actions/matches';
import { calculateAge, cn } from '@/lib/helpers/helpers';
import type { UserProfile } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function MatchesListPage() {
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const userMatches = await getUserMatches();
        setMatches(userMatches);
      } catch {
        setError('Failed to load matches.');
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  if (loading) {
    return <FullPageLoader text="Loading your matches..." />;
  }

  return (
    <div
      className={cn(
        'min-h-full bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800'
      )}
    >
      <div className={cn('container mx-auto px-4 py-8')}>
        <header className={cn('mb-8 text-center')}>
          <h1 className={cn('mb-2 text-3xl font-bold text-gray-900 dark:text-white')}>
            Your Matches
          </h1>
          <p className={cn('text-gray-600 dark:text-gray-400')}>
            {matches.length} match{matches.length !== 1 ? 'es' : ''} found
          </p>
        </header>

        {matches.length === 0 ? (
          <div className={cn('mx-auto max-w-md p-8 text-center')}>
            <div
              className={cn(
                'mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500'
              )}
            >
              <span className={cn('text-4xl')}>💕</span>
            </div>
            <h2 className={cn('mb-4 text-2xl font-bold text-gray-900 dark:text-white')}>
              No matches yet
            </h2>
            <p className={cn('mb-6 text-gray-600 dark:text-gray-400')}>
              Start swiping to find your perfect match!
            </p>
            <Link
              href="/matches"
              className={cn(
                'rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-semibold text-white transition-all',
                'duration-200 hover:from-pink-600 hover:to-red-600'
              )}
            >
              Start Swiping
            </Link>
          </div>
        ) : (
          <div className={cn('mx-auto max-w-2xl')}>
            <div className={cn('grid gap-4')}>
              {matches.map((match, index) => (
                <Link
                  href={`/chat/${match.id}`}
                  key={index}
                  className={cn(
                    'rounded-2xl bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl dark:bg-gray-800'
                  )}
                >
                  <div className={cn('flex items-center space-x-4')}>
                    <div
                      className={cn(
                        'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full'
                      )}
                    >
                      <Image
                        src={match.avatar_url}
                        alt={match.full_name}
                        className={cn('h-full w-full object-cover')}
                        height={64}
                        width={64}
                      />
                    </div>

                    <div className={cn('min-w-0 flex-1')}>
                      <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-white')}>
                        {match.full_name}, {calculateAge(match.birthdate)}
                      </h3>
                      <p className={cn('mb-1 text-sm text-gray-600 dark:text-gray-400')}>
                        @{match.username}
                      </p>
                      <p className={cn('line-clamp-2 text-sm text-gray-600 dark:text-gray-400')}>
                        {match.bio}
                      </p>
                    </div>
                    <div className={cn('')}>
                      <div className={cn('h-3 w-3 rounded-full bg-green-500')} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(MatchesListPage, {
  loadingText: 'Loading your matches...',
});
