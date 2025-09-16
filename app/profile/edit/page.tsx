"use client";

import { FullPageLoader } from "@/components/loading";
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
        "min-h-screen bg-gradient-to-br from-pink-50 to-red-50",
        "dark:from-gray-900 dark:to-gray-800"
      )}
    >
      Edit Profile Page
    </div>
  );
}
