'use client';

import { FullPageLoader, withAuth } from '@/components';
import ChatHeader from '@/components/ChatHeader';
import StreamChatInterface from '@/components/StreamChatInterface';
import { useAuth } from '@/contexts/auth-context';
import { getUserMatches } from '@/lib/actions/matches';
import { cn } from '@/lib/helpers/helpers';
import type { UserProfile } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function ChatConversationPage() {
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const userId = params['userId'] as string;

  const chatInterfaceRef = useRef<{ handleVideoCall: () => void }>(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        const userMatches = await getUserMatches();
        const matchedUser = userMatches.find((match) => match.id === userId);

        if (matchedUser) {
          setOtherUser(matchedUser);
        } else {
          router.push('/chat');
        }
      } catch (error) {
        console.error('Error fetching user matches:', error);
        router.push('/chat');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadUserData();
    }

    loadUserData();
  }, [userId, router, user]);

  if (loading) {
    return <FullPageLoader text="Loading chat..." />;
  }

  if (!otherUser) {
    return (
      <div
        className={cn(
          'flex min-h-full items-center justify-center bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800'
        )}
      >
        <div className={cn('mx-auto max-w-md p-8 text-center')}>
          <div
            className={cn(
              'mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500'
            )}
          >
            <span className={cn('text-4xl')}>❌</span>
          </div>
          <h2 className={cn('mb-4 text-2xl font-bold text-gray-900 dark:text-white')}>
            User not found
          </h2>
          <p className={cn('mb-6 text-gray-600 dark:text-gray-400')}>
            The user you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to
            chat with them.
          </p>

          <button
            onClick={() => router.push('/chat')}
            className={cn(
              'rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-pink-600 hover:to-red-600'
            )}
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-full bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800'
      )}
    >
      <div className={cn('mx-auto flex h-full max-w-4xl flex-col')}>
        <ChatHeader
          user={otherUser}
          onVideoCall={() => {
            chatInterfaceRef.current?.handleVideoCall();
          }}
        />

        <div className={cn('min-h-0 flex-1')}>
          <StreamChatInterface otherUser={otherUser} ref={chatInterfaceRef} />
        </div>
      </div>
    </div>
  );
}

export default withAuth(ChatConversationPage, {
  loadingText: 'Loading chat...',
});
