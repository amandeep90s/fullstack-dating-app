'use client';

import { uploadProfilePhoto } from '@/lib/actions/profile';
import { cn } from '@/utils/helpers';
import React, { useRef, useState } from 'react';

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

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      // 1MB limit
      setError('File size exceeds 1MB limit.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadProfilePhoto(file);
      if (result.success && result.url) {
        onPhotoUploaded(result.url);
      } else {
        setError(result.error ?? 'Failed to upload photo');
      }
    } catch (error) {
      setError('Failed to change photo');
    } finally {
      setUploading(false);
    }
  }

  function handleClick() {
    fileInputRef.current?.click();
  }

  return (
    <div className={cn('absolute right-0 bottom-0')}>
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
          'absolute right-0 bottom-0 rounded-full bg-pink-500 p-2 text-white transition-colors hover:bg-pink-600',
          'duration-200 disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        {uploading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
