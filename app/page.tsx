'use client';

import { Button, FullPageLoader } from '@/components';
import { useAuth } from '@/contexts/auth-context';
import { BACKGROUND_STYLES, LAYOUT_STYLES, TEXT_STYLES } from '@/lib/constants/styles';
import { cn } from '@/lib/helpers/helpers';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageLoader text="StreamMatch" />;
  }

  return (
    <div className={cn(BACKGROUND_STYLES.slateGradient, BACKGROUND_STYLES.fullHeight)}>
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0"></div>
        <div className={cn('relative', LAYOUT_STYLES.container, 'py-20 lg:py-32')}>
          <div className="mx-auto max-w-4xl text-center">
            <h1 className={cn('mb-6 text-5xl font-bold lg:text-7xl', TEXT_STYLES.heading)}>
              Find Your Perfect
              <span
                className={cn(
                  'block bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent'
                )}
              >
                StreamMatch
              </span>
            </h1>

            <p className={cn('mb-8 text-xl leading-relaxed lg:text-2xl', TEXT_STYLES.subheading)}>
              Connect with like-minded people through live streaming, meaningful conversations, and
              authentic connections.
            </p>

            {user ? (
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button href="/matches" variant="large">
                  Start Discovering
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
                <Button href="/profile" variant="secondary" size="lg">
                  View Profile
                </Button>
              </div>
            ) : (
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button href="/auth" variant="large">
                  Get Started
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
                <Button href="/matches" variant="secondary" size="lg">
                  Explore
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
