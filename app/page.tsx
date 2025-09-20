import { cn } from '@/utils/helpers';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'StreamMatch - Modern Dating App',
  description:
    'Connect with like-minded people in your area. Join StreamMatch today and find meaningful connections.',
};

export default function Home() {
  return (
    <div
      className={cn(
        'grid grid-rows-[20px_1fr_20px] items-center justify-items-center font-sans',
        'min-h-screen gap-16 p-8 pb-20 sm:p-20'
      )}
    >
      <main className={cn('row-start-2 flex flex-col items-center gap-[32px] sm:items-start')}>
        <Image
          className={cn('dark:invert')}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
          sizes="180px"
        />
        <ol className={cn('list-inside list-decimal text-center font-mono text-sm/6 sm:text-left')}>
          <li className={cn('mb-2 tracking-[-.01em]')}>
            Get started by editing{' '}
            <code
              className={cn(
                'rounded bg-black/[.05] px-1 py-0.5 font-mono font-semibold dark:bg-white/[.06]'
              )}
            >
              app/page.tsx
            </code>
            .
          </li>
          <li className={cn('tracking-[-.01em]')}>Save and see your changes instantly.</li>
        </ol>

        <div className={cn('flex flex-col items-center gap-4 sm:flex-row')}>
          <a
            className={cn(
              'flex rounded-full border border-solid border-transparent transition-colors',
              'bg-foreground text-background items-center justify-center gap-2',
              'text-sm font-medium hover:bg-[#383838] dark:hover:bg-[#ccc]',
              'h-10 px-4 sm:h-12 sm:w-auto sm:px-5 sm:text-base'
            )}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={cn('dark:invert')}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className={cn(
              'rounded-full border border-solid border-black/[.08] dark:border-white/[.145]',
              'flex items-center justify-center transition-colors hover:bg-[#f2f2f2]',
              'text-sm font-medium hover:border-transparent sm:text-base dark:hover:bg-[#1a1a1a]',
              'h-10 w-full px-4 sm:h-12 sm:w-auto sm:px-5 md:w-[158px]'
            )}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={cn('row-start-3 flex flex-wrap items-center justify-center gap-[24px]')}>
        <a
          className={cn('flex items-center gap-2 hover:underline hover:underline-offset-4')}
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className={cn('flex items-center gap-2 hover:underline hover:underline-offset-4')}
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          className={cn('flex items-center gap-2 hover:underline hover:underline-offset-4')}
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
