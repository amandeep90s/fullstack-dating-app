'use client';

import { FullPageLoader, PhotoUpload, withAuth } from '@/components';
import { getCurrentUserProfile, updateUserProfile } from '@/lib/actions/profile';
import { cn } from '@/lib/helpers/helpers';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    gender: 'male' as 'male' | 'female' | 'other',
    birthdate: '',
    avatar_url: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await getCurrentUserProfile();
        if (profileData) {
          setFormData({
            full_name: profileData.full_name || '',
            username: profileData.username || '',
            bio: profileData.bio || '',
            gender: profileData.gender || 'male',
            birthdate: profileData.birthdate || '',
            avatar_url: profileData.avatar_url || '',
          });
        }
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleFormSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        router.push('/profile');
      } else {
        setError(result.error ?? 'Failed to update profile');
      }
    } catch {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  if (loading) {
    return <FullPageLoader text="Loading profile..." />;
  }

  return (
    <div
      className={cn(
        'bg-gradient-to-br from-pink-50 to-red-50',
        'dark:from-gray-900 dark:to-gray-800'
      )}
    >
      <div className={cn('container mx-auto px-4 py-8')}>
        <header className={cn('mb-8 text-center')}>
          <h1 className={cn('mb-2 text-3xl font-bold text-gray-900 dark:text-white')}>
            Edit Profile
          </h1>
          <p className={cn('text-gray-600 dark:text-gray-400')}>Update your profile information</p>
        </header>

        <div className={cn('mx-auto max-w-2xl')}>
          <form
            className={cn('rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800')}
            onSubmit={handleFormSubmit}
          >
            <div className={cn('mb-8')}>
              <label
                htmlFor="profile-picture"
                className={cn('mb-4 block text-sm font-medium text-gray-700 dark:text-gray-300')}
              >
                Profile Picture
              </label>
              <div className={cn('flex items-center space-x-6')}>
                <div className={cn('relative')}>
                  <div className={cn('h-24 w-24 overflow-hidden rounded-full')}>
                    <Image
                      src={formData.avatar_url || '/default-avatar.png'}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      height={96}
                      width={96}
                      priority
                    />
                  </div>
                  <PhotoUpload
                    onPhotoUploaded={(url) => {
                      setFormData((prev) => ({ ...prev, avatar_url: url }));
                    }}
                  />
                </div>

                <div>
                  <p className={cn('mb-2 text-sm text-gray-600 dark:text-gray-400')}>
                    Upload a new profile picture
                  </p>
                  <p className={cn('mb-2 text-sm text-gray-600 dark:text-gray-400')}>
                    JPG, JPEG or PNG. Max 1MB.
                  </p>
                </div>
              </div>
            </div>

            <div className={cn('mb-6 grid grid-cols-1 gap-6 md:grid-cols-2')}>
              {/* Full name field */}
              <div>
                <label
                  htmlFor="full_name"
                  className={cn('mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300')}
                >
                  Full Name <span className={cn('text-red-600 dark:text-red-400')}>*</span>
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  className={cn(
                    'w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none dark:border-gray-600',
                    'focus:border-transparent focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white'
                  )}
                />
              </div>

              {/* Username field */}
              <div>
                <label
                  htmlFor="username"
                  className={cn('mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300')}
                >
                  Username <span className={cn('text-red-600 dark:text-red-400')}>*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-pink-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div className={cn('mb-6 grid grid-cols-1 gap-6 md:grid-cols-2')}>
              {/* Gender field */}
              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Gender <span className={cn('text-red-600 dark:text-red-400')}>*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className={cn(
                    'w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none dark:border-gray-600',
                    'focus:border-transparent focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white'
                  )}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Birthdate field */}
              <div>
                <label
                  htmlFor="birthdate"
                  className={cn('mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300')}
                >
                  Birthday <span className={cn('text-red-600 dark:text-red-400')}>*</span>
                </label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  required
                  className={cn(
                    'w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none dark:border-gray-600',
                    'focus:border-transparent focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white'
                  )}
                />
              </div>
            </div>

            {/* Bio field */}
            <div className={cn('mb-8')}>
              <label
                htmlFor="bio"
                className={cn('mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300')}
              >
                About Me <span className={cn('text-red-600 dark:text-red-400')}>*</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                rows={4}
                maxLength={500}
                className={cn(
                  'w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none dark:border-gray-600',
                  'resize-none focus:border-transparent focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white'
                )}
                placeholder="Tell others about yourself..."
              />
              <p className={cn('mt-1 text-xs text-gray-500 dark:text-gray-400')}>
                {formData.bio.length}/500 characters
              </p>
            </div>

            {error && (
              <div
                className={cn('mb-6 rounded-lg border border-red-400 bg-red-100 p-4 text-red-700')}
              >
                {error}
              </div>
            )}

            <div
              className={cn(
                'flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700'
              )}
            >
              <button
                type="button"
                onClick={() => router.back()}
                className={cn(
                  'px-6 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
                  'transition-colors duration-200'
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={cn(
                  'bg-gradient-to-r from-pink-500 to-red-500 px-6 py-2 font-semibold text-white',
                  'rounded-lg hover:from-pink-600 hover:to-red-600 focus:outline-none',
                  'focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50',
                  'transition-all duration-200 disabled:cursor-not-allowed'
                )}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuth(EditProfilePage, {
  loadingText: 'Loading profile...',
});
