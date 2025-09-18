import { UserProfile } from '@/app/profile/page';
import { calculateAge } from '@/lib/helpers/calculate-age';
import { cn } from '@/utils/helpers';
import Image from 'next/image';

interface MatchCardProps {
  user: UserProfile;
}

export default function MatchCard({ user }: MatchCardProps) {
  return (
    <div className={cn('relative mx-auto w-full max-w-sm')}>
      <div className={cn('card-swipe aspect-[3/4] overflow-hidden')}>
        <div className={cn('relative h-full w-full')}>
          <Image
            src={user.avatar_url}
            alt={user.full_name}
            fill
            className={cn('object-cover transition-opacity duration-300')}
            priority
          />

          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'
            )}
          />

          <div className={cn('absolute right-0 bottom-0 left-0 p-6 text-white')}>
            <div className={cn('flex items-end justify-between')}>
              <div>
                <h2 className={cn('mb-1 text-2xl font-bold')}>
                  {user.full_name}, {calculateAge(user.birthdate)}
                </h2>
                <p className={cn('mb-2 text-sm opacity-90')}>@{user.username}</p>
                <p className={cn('text-sm leading-relaxed')}>{user.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
