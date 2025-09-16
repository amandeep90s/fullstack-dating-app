"use client";

import { FullPageLoader } from "@/components/loading";
import { getCurrentUserProfile } from "@/lib/actions/profile";
import { calculateAge } from "@/lib/helpers/calculate-age";
import { cn } from "@/utils/helpers";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  gender: "male" | "female" | "other";
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
  gender_preferences: ("male" | "female" | "other")[];
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
          setError("Failed to load profile.");
        }
      } catch (error) {
        console.error(error);

        setError("An error occurred while fetching the profile.");
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
          "min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800",
          "flex items-center justify-center"
        )}
      >
        <div className={cn("text-center max-w-md mx-auto p-8")}>
          <div
            className={cn(
              "w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center",
              "justify-center mx-auto mb-6"
            )}
          >
            <span className={cn("text-4xl")}>❌</span>
          </div>
          <h2
            className={cn(
              "text-2xl font-bold text-gray-900 dark:text-white mb-4"
            )}
          >
            Profile not found
          </h2>
          <p className={cn("text-gray-600 dark:text-gray-400 mb-6")}>
            {error || "Unable to load your profile. Please try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={cn(
              "bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6",
              "rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200"
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
        "min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800"
      )}
    >
      <div className={cn("container mx-auto px-4 py-8")}>
        <header className={cn("text-center mb-8")}>
          <h1
            className={cn(
              "text-3xl font-bold text-gray-900 dark:text-white mb-2"
            )}
          >
            My Profile
          </h1>
          <p className={cn("text-gray-600 dark:text-gray-400")}>
            Manage your profile and preferences
          </p>
        </header>

        <div className={cn("max-w-4xl mx-auto")}>
          <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-8")}>
            <div className={cn("lg:col-span-2")}>
              <div
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
                )}
              >
                <div className={cn("flex items-center space-x-6 mb-8")}>
                  <div className={cn("relative")}>
                    <div
                      className={cn("w-24 h-24 rounded-full overflow-hidden")}
                    >
                      <img
                        src={profile.avatar_url || "/default-avatar.png"}
                        alt={profile.full_name}
                        className={cn("w-full h-full object-cover")}
                      />
                    </div>
                  </div>

                  <div className={cn("flex-1")}>
                    <h2
                      className={cn(
                        "text-2xl font-bold text-gray-900 dark:text-white mb-1"
                      )}
                    >
                      {profile.full_name}, {calculateAge(profile.birthdate)}
                    </h2>
                    <p className={cn("text-gray-600 dark:text-gray-400 mb-2")}>
                      @{profile.username}
                    </p>
                    <p
                      className={cn("text-sm text-gray-500 dark:text-gray-500")}
                    >
                      Member since{" "}
                      {new Date(profile.created_at).toLocaleDateString("en-US")}
                    </p>
                  </div>
                </div>

                <div className={cn("space-y-6")}>
                  <div>
                    <h3
                      className={cn(
                        "text-lg font-semibold text-gray-900 dark:text-white mb-3"
                      )}
                    >
                      About Me
                    </h3>
                    <p
                      className={cn(
                        "text-gray-600 dark:text-white leading-relaxed"
                      )}
                    >
                      {profile.bio || "No bio added yet."}
                    </p>
                  </div>

                  <div>
                    <h3
                      className={cn(
                        "text-lg font-semibold text-gray-900 dark:text-white mb-3"
                      )}
                    >
                      Basic Information
                    </h3>
                    <div className={cn("grid grid-cols-2 gap-4")}>
                      <div>
                        <label
                          className={cn(
                            "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          )}
                          htmlFor="gender"
                        >
                          Gender
                        </label>
                        <p
                          className={cn(
                            "text-gray-900 dark:text-white capitalize"
                          )}
                          id="gender"
                        >
                          {profile.gender}
                        </p>
                      </div>
                      <div>
                        <label
                          className={cn(
                            "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          )}
                          htmlFor="birthday"
                        >
                          Birthday
                        </label>
                        <p
                          className={cn(
                            "text-gray-900 dark:text-white capitalize"
                          )}
                          id="birthday"
                        >
                          {new Date(profile.birthdate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3
                      className={cn(
                        "text-lg font-semibold text-gray-900 dark:text-white mb-3"
                      )}
                    >
                      Dating Preferences
                    </h3>

                    <div className={cn("grid grid-cols-2 gap-4")}>
                      <div>
                        <label
                          className={cn(
                            "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          )}
                          htmlFor="age-range"
                        >
                          Age Range
                        </label>
                        <p
                          className={cn("text-gray-900 dark:text-white")}
                          id="age-range"
                        >
                          {profile.preferences.age_range.min} -{" "}
                          {profile.preferences.age_range.max} years
                        </p>
                      </div>
                      <div>
                        <label
                          className={cn(
                            "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          )}
                          htmlFor="distance"
                        >
                          Distance
                        </label>
                        <p
                          className={cn(
                            "text-gray-900 dark:text-white capitalize"
                          )}
                          id="distance"
                        >
                          Up to {profile.preferences.distance} km
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={cn("space-y-6")}>
              <div
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                )}
              >
                <h3
                  className={cn(
                    "text-lg font-semibold text-gray-900 dark:text-white mb-4"
                  )}
                >
                  Quick Actions
                </h3>

                <div className={cn("space-y-3")}>
                  <Link
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg hover:bg-gray-50",
                      "dark:hover:bg-gray-700 transition-colors duration-200"
                    )}
                    href="/profile/edit"
                  >
                    <div className={cn("flex items-center space-x-3")}>
                      <div
                        className={cn(
                          "w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                        )}
                      >
                        <svg
                          className={cn("w-4 h-4 text-white")}
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
                      <span className={cn("text-gray-900 dark:text-white")}>
                        Edit Profile
                      </span>
                    </div>
                    <svg
                      className={cn("w-5 h-5 text-gray-400")}
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
              <div
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                )}
              >
                <h3
                  className={cn(
                    "text-lg font-semibold text-gray-900 dark:text-white mb-4"
                  )}
                >
                  Account
                </h3>
                <div className={cn("space-y-3")}>
                  <div
                    className={cn(
                      "flex flex-col justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                    )}
                  >
                    <span className={cn("text-gray-900 dark:text-white")}>
                      Username
                    </span>
                    <span
                      className={cn(
                        "text-gray-500 overflow-hidden text-ellipsis dark:text-gray-400"
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
