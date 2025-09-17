"use client";

import { FullPageLoader } from "@/components";
import { getCurrentUserProfile } from "@/lib/actions/profile";
import { cn } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    gender: "male" as "male" | "female" | "other",
    birthdate: "",
    avatar_url: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await getCurrentUserProfile();
        if (profileData) {
          setFormData({
            full_name: profileData.full_name || "",
            username: profileData.username || "",
            bio: profileData.bio || "",
            gender: profileData.gender || "male",
            birthdate: profileData.birthdate || "",
            avatar_url: profileData.avatar_url || "",
          });
        }
      } catch (err) {
        setError("Failed to load profile");
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
      // TODO: Implement profile update logic here
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
        "bg-gradient-to-br from-pink-50 to-red-50",
        "dark:from-gray-900 dark:to-gray-800"
      )}
    >
      <div className={cn("container mx-auto px-4 py-8")}>
        <header className={cn("text-center mb-8")}>
          <h1
            className={cn(
              "text-3xl font-bold text-gray-900 dark:text-white mb-2"
            )}
          >
            Edit Profile
          </h1>
          <p className={cn("text-gray-600 dark:text-gray-400")}>
            Update your profile information
          </p>
        </header>

        <div className={cn("max-w-2xl mx-auto")}>
          <form
            className={cn(
              "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            )}
            onSubmit={handleFormSubmit}
          >
            <div className={cn("mb-8")}>
              <label
                htmlFor="profile-picture"
                className={cn(
                  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4"
                )}
              >
                Profile Picture
              </label>
              <div className={cn("flex items-center space-x-6")}>
                <div className={cn("relative")}>
                  <div className={cn("w-24 h-24 rounded-full overflow-hidden")}>
                    <img
                      src={formData.avatar_url || "/default-avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Photo Upload */}
                </div>

                <div>
                  <p
                    className={cn(
                      "text-sm text-gray-600 dark:text-gray-400 mb-2"
                    )}
                  >
                    Upload a new profile picture
                  </p>
                  <p
                    className={cn(
                      "text-sm text-gray-600 dark:text-gray-400 mb-2"
                    )}
                  >
                    JPG, JPEG or PNG. Max 1MB.
                  </p>
                </div>
              </div>
            </div>

            <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6 mb-6")}>
              {/* Full name field */}
              <div>
                <label
                  htmlFor="full_name"
                  className={cn(
                    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  )}
                >
                  Full Name{" "}
                  <span className={cn("text-red-600 dark:text-red-400")}>
                    *
                  </span>
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
                    "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none",
                    "focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  )}
                />
              </div>

              {/* Username field */}
              <div>
                <label
                  htmlFor="username"
                  className={cn(
                    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  )}
                >
                  Username{" "}
                  <span className={cn("text-red-600 dark:text-red-400")}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6 mb-6")}>
              {/* Gender field */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Gender{" "}
                  <span className={cn("text-red-600 dark:text-red-400")}>
                    *
                  </span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className={cn(
                    "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none",
                    "focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                  className={cn(
                    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  )}
                >
                  Birthday{" "}
                  <span className={cn("text-red-600 dark:text-red-400")}>
                    *
                  </span>
                </label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  required
                  className={cn(
                    "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none",
                    "focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  )}
                />
              </div>
            </div>

            {/* Bio field */}
            <div className={cn("mb-8")}>
              <label
                htmlFor="bio"
                className={cn(
                  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                )}
              >
                About Me{" "}
                <span className={cn("text-red-600 dark:text-red-400")}>*</span>
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
                  "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none",
                  "focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                )}
                placeholder="Tell others about yourself..."
              />
              <p
                className={cn("text-xs text-gray-500 dark:text-gray-400 mt-1")}
              >
                {formData.bio.length}/500 characters
              </p>
            </div>

            {error && (
              <div
                className={cn(
                  "mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
                )}
              >
                {error}
              </div>
            )}

            <div
              className={cn(
                "flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700"
              )}
            >
              <button
                type="button"
                onClick={() => router.back()}
                className={cn(
                  "px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                  "transition-colors duration-200"
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={cn(
                  "px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold",
                  "rounded-lg hover:from-pink-600 hover:to-red-600 focus:outline-none",
                  "focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50",
                  "disabled:cursor-not-allowed transition-all duration-200"
                )}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
