'use client';

import { withAuth } from '@/components';

function ChatConversationPage() {
  return <div>Chat Conversation Page</div>;
}

export default withAuth(ChatConversationPage, {
  loadingText: 'Loading chat...',
});
