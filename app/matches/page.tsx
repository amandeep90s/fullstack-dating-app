'use client';

import { UserProfile } from '@/app/profile/page';
import { FullPageLoader } from '@/components';
import MatchButtons from '@/components/MatchButtons';
import MatchCard from '@/components/MatchCard';
import MatchNotification from '@/components/MatchNotification';
import { getPotentialMatches } from '@/lib/actions/matches';
import { cn } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MatchesPage() {
  const [potentialMatches, setPotentialMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showMatchNotification, setShowMatchNotification] = useState<boolean>(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchPotentialMatches() {
      try {
        const potentialMatches = await getPotentialMatches();
        setPotentialMatches(potentialMatches);
      } catch (error) {
        console.error('Error fetching potential matches:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPotentialMatches();
  }, []);

  async function handleLike() {
    //
  }

  async function handlePass() {
    //
  }

  function handleCloseMatchNotification() {
    //
  }

  function handleStartChat() {
    //
  }

  if (loading) {
    return <FullPageLoader text="Finding your matches..." />;
  }

  if (currentIndex >= potentialMatches.length) {
    return <h1>Loading...</h1>;
  }

  const currentPotentialMatch = potentialMatches[currentIndex];

  return (
    <div
      className={cn(
        'h-full overflow-y-auto bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800'
      )}
    >
      <div className={cn('container mx-auto px-4 py-8')}>
        <header className={cn('mb-8')}>
          <div className={cn('mb-4 flex items-center justify-between')}>
            <button
              type="button"
              onClick={() => router.back()}
              className={cn(
                'rounded-full p-2 transition-colors duration-200 hover:bg-white/20 dark:hover:bg-gray-700/50'
              )}
              title="Go Back"
            >
              <svg
                className="h-6 w-6 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className={cn('flex-1')} />
          </div>

          <div className={cn('text-center')}>
            <h1 className={cn('mb-2 text-3xl font-bold text-gray-900 dark:text-white')}>
              Discover Matches
            </h1>
            <p className={cn('text-gray-600 dark:text-gray-400')}>
              {currentIndex + 1} of {potentialMatches.length} profile
            </p>
          </div>
        </header>

        <div className={cn('mx-auto max-w-md')}>
          <MatchCard user={currentPotentialMatch} />
          <div className={cn('mt-8')}>
            <MatchButtons />
          </div>
        </div>

        {showMatchNotification && matchedUser && <MatchNotification />}
      </div>
    </div>
  );
}
