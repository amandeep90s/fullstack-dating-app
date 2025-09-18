'use client';

import { FullPageLoader } from '@/components';
import { getCurrentUserProfile } from '@/lib/actions/profile';
import { calculateAge } from '@/lib/helpers/calculate-age';
import { cn } from '@/utils/helpers';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  birthdate: string;
  bio: string;
  avatar_url: string;
  preferences: UserPreferences;
  location_lat?: number;
  location_lng?: number;
  last_active: boolean;
  is_verified: boolean;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  age_range: {
    min: number;
    max: number;
  };
  distance: number;
  gender_preferences: ('male' | 'female' | 'other')[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const profileData = await getCurrentUserProfile();
        if (profileData) {
          setProfile(profileData);
        } else {
          setError('Failed to load profile.');
        }
      } catch (error) {
        console.error(error);

        setError('An error occurred while fetching the profile.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return <FullPageLoader text="Loading your profile..." />;
  }

  if (error || !profile) {
    return (
      <div
        className={cn(
          'min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800',
          'flex items-center justify-center'
        )}
      >
        <div className={cn('mx-auto max-w-md p-8 text-center')}>
          <div
            className={cn(
              'flex h-24 w-24 items-center rounded-full bg-gradient-to-r from-red-500 to-pink-500',
              'mx-auto mb-6 justify-center'
            )}
          >
            <span className={cn('text-4xl')}>❌</span>
          </div>
          <h2 className={cn('mb-4 text-2xl font-bold text-gray-900 dark:text-white')}>
            Profile not found
          </h2>
          <p className={cn('mb-6 text-gray-600 dark:text-gray-400')}>
            {error || 'Unable to load your profile. Please try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={cn(
              'bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-semibold text-white',
              'rounded-full transition-all duration-200 hover:from-pink-600 hover:to-red-600'
            )}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800'
      )}
    >
      <div className={cn('container mx-auto px-4 py-8')}>
        <header className={cn('mb-8 text-center')}>
          <h1 className={cn('mb-2 text-3xl font-bold text-gray-900 dark:text-white')}>
            My Profile
          </h1>
          <p className={cn('text-gray-600 dark:text-gray-400')}>
            Manage your profile and preferences
          </p>
        </header>

        <div className={cn('mx-auto max-w-4xl')}>
          <div className={cn('grid grid-cols-1 gap-8 lg:grid-cols-3')}>
            <div className={cn('lg:col-span-2')}>
              <div className={cn('rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800')}>
                <div className={cn('mb-8 flex items-center space-x-6')}>
                  <div className={cn('relative')}>
                    <div className={cn('h-24 w-24 overflow-hidden rounded-full')}>
                      <img
                        src={profile.avatar_url || '/default-avatar.png'}
                        alt={profile.full_name}
                        className={cn('h-full w-full object-cover')}
                      />
                    </div>
                  </div>

                  <div className={cn('flex-1')}>
                    <h2 className={cn('mb-1 text-2xl font-bold text-gray-900 dark:text-white')}>
                      {profile.full_name}, {calculateAge(profile.birthdate)}
                    </h2>
                    <p className={cn('mb-2 text-gray-600 dark:text-gray-400')}>
                      @{profile.username}
                    </p>
                    <p className={cn('text-sm text-gray-500 dark:text-gray-500')}>
                      Member since {new Date(profile.created_at).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>

                <div className={cn('space-y-6')}>
                  <div>
                    <h3 className={cn('mb-3 text-lg font-semibold text-gray-900 dark:text-white')}>
                      About Me
                    </h3>
                    <p className={cn('leading-relaxed text-gray-600 dark:text-white')}>
                      {profile.bio || 'No bio added yet.'}
                    </p>
                  </div>

                  <div>
                    <h3 className={cn('mb-3 text-lg font-semibold text-gray-900 dark:text-white')}>
                      Basic Information
                    </h3>
                    <div className={cn('grid grid-cols-2 gap-4')}>
                      <div>
                        <label
                          className={cn(
                            'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                          )}
                          htmlFor="gender"
                        >
                          Gender
                        </label>
                        <p className={cn('text-gray-900 capitalize dark:text-white')} id="gender">
                          {profile.gender}
                        </p>
                      </div>
                      <div>
                        <label
                          className={cn(
                            'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                          )}
                          htmlFor="birthday"
                        >
                          Birthday
                        </label>
                        <p className={cn('text-gray-900 capitalize dark:text-white')} id="birthday">
                          {new Date(profile.birthdate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={cn('mb-3 text-lg font-semibold text-gray-900 dark:text-white')}>
                      Dating Preferences
                    </h3>

                    <div className={cn('grid grid-cols-2 gap-4')}>
                      <div>
                        <label
                          className={cn(
                            'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                          )}
                          htmlFor="age-range"
                        >
                          Age Range
                        </label>
                        <p className={cn('text-gray-900 dark:text-white')} id="age-range">
                          {profile.preferences.age_range.min} - {profile.preferences.age_range.max}{' '}
                          years
                        </p>
                      </div>
                      <div>
                        <label
                          className={cn(
                            'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                          )}
                          htmlFor="distance"
                        >
                          Distance
                        </label>
                        <p className={cn('text-gray-900 capitalize dark:text-white')} id="distance">
                          Up to {profile.preferences.distance} km
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={cn('space-y-6')}>
              <div className={cn('rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800')}>
                <h3 className={cn('mb-4 text-lg font-semibold text-gray-900 dark:text-white')}>
                  Quick Actions
                </h3>

                <div className={cn('space-y-3')}>
                  <Link
                    className={cn(
                      'flex items-center justify-between rounded-lg p-3 hover:bg-gray-50',
                      'transition-colors duration-200 dark:hover:bg-gray-700'
                    )}
                    href="/profile/edit"
                  >
                    <div className={cn('flex items-center space-x-3')}>
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full bg-blue-500'
                        )}
                      >
                        <svg
                          className={cn('h-4 w-4 text-white')}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </div>
                      <span className={cn('text-gray-900 dark:text-white')}>Edit Profile</span>
                    </div>
                    <svg
                      className={cn('h-5 w-5 text-gray-400')}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className={cn('rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800')}>
                <h3 className={cn('mb-4 text-lg font-semibold text-gray-900 dark:text-white')}>
                  Account
                </h3>
                <div className={cn('space-y-3')}>
                  <div
                    className={cn(
                      'flex flex-col justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700'
                    )}
                  >
                    <span className={cn('text-gray-900 dark:text-white')}>Username</span>
                    <span
                      className={cn(
                        'overflow-hidden text-ellipsis text-gray-500 dark:text-gray-400'
                      )}
                    >
                      @{profile.username}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
