import { cn } from '@/lib/helpers/helpers';
import { useEffect, useState } from 'react';

interface AlreadyLikedNotificationProps {
  onClose: () => void;
}

export default function AlreadyLikedNotification({ onClose }: AlreadyLikedNotificationProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Show the notification immediately
    setIsVisible(true);

    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  function handleClose() {
    setIsVisible(false);
    setTimeout(onClose, 300); // Match the duration of the fade-out transition
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
          'max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800'
        )}
      >
        <div className={cn('flex items-start space-x-4')}>
          <div
            className={cn(
              'flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30'
            )}
          >
            <span className={cn('text-3xl')}>💛</span>
          </div>

          <div className={cn('min-w-0 flex-1')}>
            <div className={cn('mb-2 flex items-center justify-between')}>
              <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-white')}>
                Already Liked!
              </h3>
              <button
                className={cn('text-gray-400 hover:text-gray-600 dark:hover:text-gray-300')}
                aria-label="Close"
                type="button"
                onClick={handleClose}
              >
                <svg className={cn('h-5 w-5')} fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p className={cn('mb-3 text-sm text-gray-600 dark:text-gray-400')}>
              You have already liked this user. If they like you back, you&apos;ll get a match!
            </p>

            <div className={cn('flex justify-end')}>
              <button
                className={cn(
                  'rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-white transition-all',
                  'duration-200 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700'
                )}
                onClick={handleClose}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
