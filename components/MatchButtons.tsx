import { cn } from '@/lib/helpers/helpers';
import { memo, useCallback } from 'react';
import { HeartIcon, XMarkIcon } from './icons';

interface MatchButtonsProps {
  onLike: () => void;
  onDislike: () => void;
}

const MatchButtons = memo(function MatchButtons({ onLike, onDislike }: MatchButtonsProps) {
  const handleDislike = useCallback(() => {
    onDislike();
  }, [onDislike]);

  const handleLike = useCallback(() => {
    onLike();
  }, [onLike]);

  return (
    <div className={cn('flex items-center justify-center gap-8')}>
      <button
        onClick={handleDislike}
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-300',
          'cursor-pointer bg-white shadow-lg transition-all duration-200 hover:border-red-500',
          'hover:shadow-xl dark:border-gray-600 dark:bg-gray-800 dark:hover:border-red-500',
          'focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none'
        )}
        aria-label="Dislike"
        type="button"
      >
        <XMarkIcon className={cn('h-8 w-8 text-red-500')} />
      </button>
      <button
        onClick={handleLike}
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-300',
          'cursor-pointer bg-white shadow-lg transition-all duration-200 hover:border-green-500',
          'hover:shadow-xl dark:border-gray-600 dark:bg-gray-800 dark:hover:border-green-500',
          'focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none'
        )}
        aria-label="Like"
        type="button"
      >
        <HeartIcon className={cn('h-8 w-8 text-green-500')} />
      </button>
    </div>
  );
});

export default MatchButtons;
