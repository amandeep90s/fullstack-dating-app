"use client";

import { uploadProfilePhoto } from "@/lib/actions/profile";
import { cn } from "@/utils/helpers";
import React, { useRef, useState } from "react";

type PhotoUploadProps = {
  onPhotoUploaded: (url: string) => void;
};

export function PhotoUpload({ onPhotoUploaded }: PhotoUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      // 1MB limit
      setError("File size exceeds 1MB limit.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadProfilePhoto(file);
      if (result.success && result.url) {
        onPhotoUploaded(result.url);
      } else {
        setError(result.error ?? "Failed to upload photo");
      }
    } catch (error) {
      setError("Failed to change photo");
    } finally {
      setUploading(false);
    }
  }

  function handleClick() {
    fileInputRef.current?.click();
  }

  return (
    <div className={cn("absolute bottom-0 right-0")}>
      <input
        type="file"
        name="profilePhoto"
        id="profilePhoto"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*"
      />

      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        title="Change Photo"
        className={cn(
          "absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors",
          "duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {uploading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
