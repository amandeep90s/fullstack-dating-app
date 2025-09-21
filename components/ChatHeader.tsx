'use client';

import { calculateAge, cn } from '@/lib/helpers/helpers';
import type { UserProfile } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BackIcon, VideoIcon } from './icons';

interface ChatHeaderProps {
  user: UserProfile;
  onVideoCall: () => void;
}

export default function ChatHeader({ user, onVideoCall }: ChatHeaderProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        'border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800'
      )}
    >
      <div className={cn('flex items-center justify-between')}>
        <div className={cn('flex items-center space-x-4')}>
          <button
            onClick={() => router.back()}
            className={cn(
              'rounded-full p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            <BackIcon className={cn('h-6 w-6 text-gray-600 dark:text-gray-400')} />
          </button>

          <div className={cn('flex items-center space-x-3')}>
            <div className={cn('relative h-12 w-12')}>
              <div className={cn('h-full w-full overflow-hidden rounded-full')}>
                <Image
                  src={user.avatar_url}
                  alt={user.full_name}
                  className={cn('h-full w-full object-cover')}
                  height={48}
                  width={48}
                />
              </div>
              <div
                className={cn(
                  'absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-800'
                )}
              ></div>
            </div>

            <div>
              <h2 className={cn('text-lg font-semibold text-gray-900 dark:text-white')}>
                {user.full_name}, {calculateAge(user.birthdate)}
              </h2>
              <p className={cn('text-sm text-gray-500 dark:text-gray-400')}>@{user.username}</p>
            </div>
          </div>
        </div>
        <div className={cn('flex items-center space-x-2')}>
          <button
            onClick={onVideoCall}
            className={cn(
              'rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-white shadow-lg transition-all duration-200',
              'hover:from-blue-600 hover:to-purple-600 hover:shadow-xl'
            )}
            title="Start Video Call"
          >
            <VideoIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
