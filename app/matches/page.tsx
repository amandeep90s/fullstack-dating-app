'use client';

import { FullPageLoader, withAuth } from '@/components';
import AlreadyLikedNotification from '@/components/AlreadyLikedNotification';
import MatchButtons from '@/components/MatchButtons';
import MatchCard from '@/components/MatchCard';
import MatchNotification from '@/components/MatchNotification';
import { getPotentialMatches, likeUser } from '@/lib/actions/matches';
import { cn } from '@/lib/helpers/helpers';
import type { UserProfile } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function MatchesPage() {
  const [potentialMatches, setPotentialMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showMatchNotification, setShowMatchNotification] = useState<boolean>(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [showAlreadyLikedNotification, setShowAlreadyLikedNotification] = useState<boolean>(false);

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
    if (currentIndex < potentialMatches.length) {
      const likedUser = potentialMatches[currentIndex];

      if (!likedUser) return;

      try {
        const result = await likeUser(likedUser.id);

        if (result.alreadyLiked) {
          // Show already liked notification
          setShowAlreadyLikedNotification(true);
          return;
        }

        if (result.isMatch && result.matchedUser) {
          setMatchedUser(result.matchedUser);
          setShowMatchNotification(true);
        }

        setCurrentIndex((prev) => prev + 1);
      } catch (error) {
        console.error('Error liking user:', error);
      }
    }
  }

  async function handlePass() {
    if (currentIndex < potentialMatches.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handleCloseMatchNotification() {
    setShowMatchNotification(false);
  }

  function handleCloseAlreadyLikedNotification() {
    setShowAlreadyLikedNotification(false);
  }

  function handleStartChat() {
    //
  }

  if (loading) {
    return <FullPageLoader text="Finding your matches..." />;
  }

  if (currentIndex >= potentialMatches.length) {
    return (
      <div
        className={cn(
          'flex h-full items-center justify-center bg-gradient-to-br from-pink-50 to-red-50',
          'dark:from-gray-900 dark:to-gray-800'
        )}
      >
        <div className={cn('mx-auto max-w-md p-8 text-center')}>
          <div
            className={cn(
              'mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500'
            )}
          >
            <span className="text-4xl">💕</span>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            No more profiles to show
          </h2>
          <p className={cn('mb-6 text-gray-600 dark:text-gray-400')}>
            Check back later for new matches, or try adjusting your preferences!
          </p>
          <button
            onClick={() => setCurrentIndex(0)}
            className={cn(
              'rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-semibold',
              'text-white transition-all duration-200 hover:from-pink-600 hover:to-red-600'
            )}
            type="button"
          >
            Refresh
          </button>
        </div>
        {showMatchNotification && matchedUser && (
          <MatchNotification
            match={matchedUser}
            onClose={handleCloseMatchNotification}
            onStartChat={handleStartChat}
          />
        )}

        {showAlreadyLikedNotification && (
          <AlreadyLikedNotification onClose={handleCloseAlreadyLikedNotification} />
        )}
      </div>
    );
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
          {currentPotentialMatch && <MatchCard user={currentPotentialMatch} />}
          <div className={cn('mt-8')}>
            <MatchButtons onLike={handleLike} onDislike={handlePass} />
          </div>
        </div>

        {showMatchNotification && matchedUser && (
          <MatchNotification
            match={matchedUser}
            onClose={handleCloseMatchNotification}
            onStartChat={handleStartChat}
          />
        )}

        {showAlreadyLikedNotification && (
          <AlreadyLikedNotification onClose={handleCloseAlreadyLikedNotification} />
        )}
      </div>
    </div>
  );
}

export default withAuth(MatchesPage, {
  loadingText: 'Finding your matches...',
});
