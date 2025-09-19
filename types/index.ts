/**
 * Shared type definitions for the dating app
 * This centralizes all types for better consistency and maintenance
 */

// Database types
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
  last_active: boolean | string;
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
  gender_preference: ('male' | 'female' | 'other')[];
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

// Form validation types
export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface FormState<T = Record<string, unknown>> {
  data: T;
  errors: ValidationErrors;
  isSubmitting: boolean;
  isValid: boolean;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Match-related types
export interface MatchResult {
  success: boolean;
  isMatch: boolean;
  matchedUser?: UserProfile;
  error?: string;
}

// Auth context types
export interface AuthContextValue {
  user: import('@supabase/supabase-js').User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
