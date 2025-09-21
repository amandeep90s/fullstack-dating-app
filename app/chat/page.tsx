'use client';

import { FullPageLoader, withAuth } from '@/components';
import { getUserMatches } from '@/lib/actions/matches';
import { cn, formatTime } from '@/lib/helpers/helpers';
import type { ChatData } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function ChatPage() {
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const userMatches = await getUserMatches();
        const chatData: ChatData[] = userMatches.map((match) => ({
          id: match.id,
          user: match,
          lastMessage: 'Start your conversation!',
          lastMessageTime: match.created_at,
          unreadCount: 0,
        }));
        setChats(chatData);
      } catch (error) {
        console.error('Error loading matches:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  if (loading) {
    return <FullPageLoader text="Loading messages..." />;
  }

  return (
    <div
      className={cn(
        'min-h-full bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800'
      )}
    >
      <div className={cn('container mx-auto px-4 py-8')}>
        <header className={cn('mb-8 text-center')}>
          <h1 className={cn('mb-4 text-2xl font-bold text-gray-900 dark:text-white')}>Messages</h1>
          <p className={cn('mb-6 text-gray-600 dark:text-gray-400')}>
            {chats.length} conversation{chats.length !== 1 ? 's' : ''}
          </p>
        </header>

        {chats.length === 0 ? (
          <div className={cn('mx-auto max-w-md p-8 text-center')}>
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
              <span className="text-4xl">💬</span>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Start swiping to find matches and begin conversations!
            </p>
            <Link
              href="/matches"
              className="rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-pink-600 hover:to-red-600"
            >
              Start Swiping
            </Link>
          </div>
        ) : (
          <div className={cn('mx-auto max-w-2xl')}>
            <div className={cn('overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800')}>
              {chats.map((chat, key) => (
                <Link
                  href={`/chat/${chat.id}`}
                  key={key}
                  className={cn(
                    'block transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center border-b border-gray-200 p-6 last:border-b-0 dark:border-gray-700'
                    )}
                  >
                    <div
                      className={cn(
                        'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full'
                      )}
                    >
                      <Image
                        src={chat.user.avatar_url}
                        alt={chat.user.full_name}
                        className={cn('h-full w-full object-cover')}
                        height={64}
                        width={64}
                      />
                      {chat.unreadCount > 0 && (
                        <div
                          className={cn(
                            'absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'
                          )}
                        >
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>

                    <div className={cn('ml-4 min-w-0 flex-1')}>
                      <div className={cn('mb-1 flex items-center justify-between')}>
                        <h3
                          className={cn(
                            'truncate text-lg font-semibold text-gray-900 dark:text-white'
                          )}
                        >
                          {chat.user.full_name}
                        </h3>
                        <span
                          className={cn('flex-shrink-0 text-sm text-gray-500 dark:text-gray-400')}
                        >
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>
                      <p className={cn('truncate text-sm text-gray-600 dark:text-gray-400')}>
                        {chat.lastMessage}
                      </p>
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

export default withAuth(ChatPage, {
  loadingText: 'Loading chats...',
});
