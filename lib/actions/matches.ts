'use server';

import type { UserProfile } from '@/app/profile/page';
import { cache } from '@/lib/cache';
import { createClient } from '@/lib/supabase/server';

export async function getPotentialMatches(limit = 50, offset = 0): Promise<UserProfile[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated.');
  }

  // Check cache first
  const cacheKey = cache.userKey(user.id, `matches:${limit}:${offset}`);
  const cachedMatches = cache.get<UserProfile[]>(cacheKey);

  if (cachedMatches) {
    return cachedMatches;
  }

  // First, get user preferences
  const { data: userPrefs, error: prefsError } = await supabase
    .from('users')
    .select('preferences')
    .eq('id', user.id)
    .single();

  if (prefsError) {
    throw new Error('Failed to get user preferences');
  }

  const currentUserPrefs = userPrefs.preferences as any;
  const genderPreference = currentUserPrefs?.gender_preference || [];

  // Build query with database-level filtering
  let query = supabase
    .from('users')
    .select('id, full_name, username, gender, birthdate, bio, avatar_url, preferences')
    .neq('id', user.id)
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  // Apply gender filter at database level if preferences exist
  if (genderPreference && genderPreference.length > 0) {
    query = query.in('gender', genderPreference);
  }

  const { data: potentialMatches, error } = await query;

  if (error) {
    throw new Error('Failed to fetch potential matches');
  }

  // Transform to expected format
  const filteredMatches: UserProfile[] = (potentialMatches || []).map((match) => ({
    id: match.id,
    full_name: match.full_name,
    username: match.username,
    email: '',
    gender: match.gender,
    birthdate: match.birthdate,
    bio: match.bio,
    avatar_url: match.avatar_url,
    preferences: match.preferences,
    last_active: false,
    is_verified: true,
    is_online: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  // Cache the results for 5 minutes
  cache.set(cacheKey, filteredMatches, 5 * 60 * 1000);

  return filteredMatches;
}
