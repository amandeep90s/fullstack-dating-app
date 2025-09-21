import type { UserProfile } from '@/types';
import type { RefObject } from 'react';

interface StreamChatInterfaceProps {
  otherUser: UserProfile;
  ref: RefObject<{ handleVideoCall: () => void } | null>;
}

export default function StreamChatInterface({ otherUser, ref }: StreamChatInterfaceProps) {
  return <div>StreamChatInterface</div>;
}
