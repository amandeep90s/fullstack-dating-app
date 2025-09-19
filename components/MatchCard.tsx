import { calculateAge } from '@/lib/helpers/calculate-age';
import type { UserProfile } from '@/types';
import { cn } from '@/utils/helpers';
import Image from 'next/image';
import { memo } from 'react';

interface MatchCardProps {
  user: UserProfile;
}

const MatchCard = memo(function MatchCard({ user }: MatchCardProps) {
  const userAge = calculateAge(user.birthdate);

  return (
    <div className={cn('relative mx-auto w-full max-w-sm')}>
      <div className={cn('card-swipe aspect-[3/4] overflow-hidden')}>
        <div className={cn('relative h-full w-full')}>
          <Image
            src={user.avatar_url}
            alt={user.full_name}
            fill
            className={cn('object-cover transition-opacity duration-300')}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
                  {user.full_name}, {userAge}
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
});

export default MatchCard;
