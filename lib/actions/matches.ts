'use server';

import { cache } from '@/lib/cache';
import { createClient } from '@/lib/supabase/server';
import type { UserProfile } from '@/types';

/**
 * Get authenticated user or throw error
 */
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated.');
  }

  return { user, supabase };
}

/**
 * Transform database user to UserProfile format
 */
function transformToUserProfile(dbUser: any, overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: dbUser.id,
    full_name: dbUser.full_name,
    username: dbUser.username,
    email: dbUser.email || '',
    gender: dbUser.gender,
    birthdate: dbUser.birthdate,
    bio: dbUser.bio,
    avatar_url: dbUser.avatar_url,
    preferences: dbUser.preferences,
    location_lat: dbUser.location_lat ?? undefined,
    location_lng: dbUser.location_lng ?? undefined,
    last_active: dbUser.last_active ?? false,
    is_verified: dbUser.is_verified ?? true,
    is_online: dbUser.is_online ?? false,
    created_at: dbUser.created_at || new Date().toISOString(),
    updated_at: dbUser.updated_at || new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Get user preferences for the authenticated user
 */
async function getUserPreferences(supabase: any, userId: string) {
  const { data: userPrefs, error: prefsError } = await supabase
    .from('users')
    .select('preferences')
    .eq('id', userId)
    .single();

  if (prefsError) {
    throw new Error('Failed to get user preferences');
  }

  const currentUserPrefs = userPrefs.preferences as any;
  return currentUserPrefs?.gender_preference || [];
}

/**
 * Get potential matches for the user
 * @param limit The maximum number of matches to return
 * @param offset The number of matches to skip
 * @returns An array of user profiles that match the criteria
 */
export async function getPotentialMatches(limit = 50, offset = 0): Promise<UserProfile[]> {
  const { user, supabase } = await getAuthenticatedUser();

  // Check cache first
  const cacheKey = cache.userKey(user.id, `matches:${limit}:${offset}`);
  const cachedMatches = cache.get<UserProfile[]>(cacheKey);

  if (cachedMatches) {
    return cachedMatches;
  }

  // Get user preferences
  const genderPreference = await getUserPreferences(supabase, user.id);

  // Build query with database-level filtering
  let query = supabase
    .from('users')
    .select('id, full_name, username, gender, birthdate, bio, avatar_url, preferences')
    .neq('id', user.id)
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  // Apply gender filter at database level if preferences exist
  if (genderPreference.length > 0) {
    query = query.in('gender', genderPreference);
  }

  const { data: potentialMatches, error } = await query;

  if (error) {
    throw new Error('Failed to fetch potential matches');
  }

  // Transform to expected format
  const filteredMatches: UserProfile[] = (potentialMatches || []).map((match) =>
    transformToUserProfile(match, { email: '' })
  );

  // Cache the results for 5 minutes
  cache.set(cacheKey, filteredMatches, 5 * 60 * 1000);

  return filteredMatches;
}

/**
 * Like a user and check for a match
 * @param targetUserId The ID of the user to like
 * @returns An object containing the success status, match status, and matched user profile if applicable
 */
export async function likeUser(targetUserId: string): Promise<{
  success: boolean;
  isMatch: boolean;
  matchedUser?: UserProfile;
}> {
  const { user, supabase } = await getAuthenticatedUser();

  // Insert the like
  const { error: likeError } = await supabase.from('likes').insert({
    from_user_id: user.id,
    to_user_id: targetUserId,
  });

  if (likeError) {
    throw new Error('Failed to like user');
  }

  // Check if the target user has already liked this user (mutual like = match)
  const { data: existingLike, error: checkError } = await supabase
    .from('likes')
    .select('*')
    .eq('from_user_id', targetUserId)
    .eq('to_user_id', user.id)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    throw new Error('Failed to check for existing like');
  }

  // If mutual like exists, it's a match
  if (existingLike) {
    const { data: matchedUser, error: matchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (matchError) {
      throw new Error('Failed to fetch matched user details');
    }

    return {
      success: true,
      isMatch: true,
      matchedUser: transformToUserProfile(matchedUser),
    };
  }

  return { success: true, isMatch: false };
}

/**
 * Fetch matches for the authenticated user with optimized single query
 * @returns Array of matched user profiles
 */
export async function fetchUserMatches(): Promise<UserProfile[]> {
  const { user, supabase } = await getAuthenticatedUser();

  // Check cache first
  const cacheKey = cache.userKey(user.id, 'user-matches');
  const cachedMatches = cache.get<UserProfile[]>(cacheKey);

  if (cachedMatches) {
    return cachedMatches;
  }

  // Use a more efficient query with joins to get matches and user details in one go
  const { data: matchesWithUsers, error } = await supabase
    .from('matches')
    .select(
      `
      *,
      user1:users!matches_user1_id_fkey(*),
      user2:users!matches_user2_id_fkey(*)
    `
    )
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .eq('is_active', true);

  if (error) {
    throw new Error('Failed to fetch matches');
  }

  if (!matchesWithUsers) {
    return [];
  }

  // Transform the joined data to get the other user's profile
  const matchedUsers: UserProfile[] = matchesWithUsers.map((match) => {
    const otherUser = match.user1_id === user.id ? match.user2 : match.user1;
    return transformToUserProfile(otherUser, {
      created_at: match.created_at,
      updated_at: match.created_at,
      last_active: new Date().toISOString(),
    });
  });

  // Cache for 3 minutes (shorter than potential matches since this changes more frequently)
  cache.set(cacheKey, matchedUsers, 3 * 60 * 1000);

  return matchedUsers;
}
