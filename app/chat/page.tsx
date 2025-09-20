'use client';

import { withAuth } from '@/components';
import { getUserMatches } from '@/lib/actions/matches';
import type { ChatData } from '@/types';
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

  return <div>Chat Page</div>;
}

export default withAuth(ChatPage, {
  loadingText: 'Loading chats...',
});
