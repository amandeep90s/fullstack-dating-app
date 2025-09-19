import type { UserProfile } from '@/types';
import { cn } from '@/utils/helpers';
import { useEffect, useState } from 'react';

interface MatchNotificationProps {
  match: UserProfile;
  onClose: () => void;
  onStartChat: () => void;
}

export default function MatchNotification({ match, onClose, onStartChat }: MatchNotificationProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(onClose, 5000);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  function handleClose() {
    setIsVisible(false);
    setTimeout(onClose, 300); // Match the duration of the fade-out transition
  }

  function handleStartChat() {
    onStartChat();
    handleClose();
  }

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 transition-all duration-300',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div
        className={cn(
          'boder-gray-200 max-w-sm rounded-2xl border bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800'
        )}
      >
        <div className={cn('flex items-start space-x-4')}>
          <div className={cn('relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full')}>
            <img
              src={match.avatar_url}
              alt={match.full_name}
              className={cn('h-full w-full object-cover')}
            />
          </div>

          <div className={cn('min-w-0 flex-1')}>
            <div className={cn('mb-2 flex items-center justify-between')}>
              <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-white')}>
                It&apos;s a Match! 🎉
              </h3>
              <button
                className={cn('text-gray-400 hover:text-gray-600 dark:hover:text-gray-300')}
                aria-label="Close"
                type="button"
                onClick={handleClose}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p className={cn('mb-3 text-sm text-gray-600 dark:text-gray-400')}>
              You and <span className={cn('font-semibold')}>{match.full_name}</span> liked each
              other!
            </p>

            <div className={cn('flex space-x-2')}>
              <button
                className={cn(
                  'flex-1 rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-4 py-2 text-sm font-semibold text-white',
                  'transition-all duration-200 hover:from-pink-600 hover:to-red-600'
                )}
                onClick={handleStartChat}
              >
                Start Chat
              </button>
              <button
                className={cn(
                  'flex-1 rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-all',
                  'duration-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                )}
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
