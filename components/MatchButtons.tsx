import { cn } from '@/utils/helpers';

interface MatchButtonsProps {
  onLike: () => void;
  onDislike: () => void;
}

export default function MatchButtons({ onLike, onDislike }: MatchButtonsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-8')}>
      <button
        onClick={onDislike}
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-300',
          'cursor-pointer bg-white shadow-lg transition-all duration-200 hover:border-red-500',
          'hover:shadow-xl dark:border-gray-600 dark:bg-gray-800 dark:hover:border-red-500'
        )}
        aria-label="Dislike"
      >
        <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button
        onClick={onLike}
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-300',
          'cursor-pointer bg-white shadow-lg transition-all duration-200 hover:border-green-500',
          'hover:shadow-xl dark:border-gray-600 dark:bg-gray-800 dark:hover:border-green-500'
        )}
        aria-label="Like"
      >
        <svg className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
