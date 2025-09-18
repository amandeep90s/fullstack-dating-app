import { UserProfile } from '@/app/profile/page';
import { cn } from '@/utils/helpers';

interface MatchCardProps {
  user: UserProfile;
}

export default function MatchCard({ user }: MatchCardProps) {
  return <div className={cn('relative mx-auto w-full max-w-sm')}>MatchCard</div>;
}
