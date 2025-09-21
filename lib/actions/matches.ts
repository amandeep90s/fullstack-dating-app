'use server';

import { createClient } from '@/lib/supabase/server';
import { AuthError, DatabaseError, safeAsync, withRetry } from '@/lib/utils/errors';
import type { MatchResult, UserProfile } from '@/types';

/**
 * Gets potential matches for the current user with preference filtering
 */
export async function getPotentialMatches(): Promise<UserProfile[]> {
  const { data, error } = await safeAsync(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new AuthError('Not authenticated.');
    }

    // Get user preferences first
    const { data: userPrefs, error: prefsError } = await supabase
      .from('users')
      .select('preferences')
      .eq('id', user.id)
      .single();

    if (prefsError) {
      throw new DatabaseError('Failed to get user preferences');
    }

    // Get potential matches excluding current user
    const { data: potentialMatches, error: matchesError } = await supabase
      .from('users')
      .select('*')
      .neq('id', user.id)
      .limit(50);

    if (matchesError) {
      throw new DatabaseError('Failed to fetch potential matches');
    }

    const currentUserPrefs = userPrefs.preferences;
    const genderPreference = currentUserPrefs?.gender_preference || [];

    // Filter and transform matches
    const filteredMatches = (potentialMatches || [])
      .filter((match) => {
        if (!genderPreference || genderPreference.length === 0) {
          return true;
        }
        return genderPreference.includes(match.gender);
      })
      .map(
        (match): UserProfile => ({
          id: match.id,
          full_name: match.full_name,
          username: match.username,
          email: '',
          gender: match.gender,
          birthdate: match.birthdate,
          bio: match.bio,
          avatar_url: match.avatar_url,
          preferences: match.preferences,
          last_active: new Date().toISOString(),
          is_verified: true,
          is_online: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      );

    return filteredMatches;
  });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Like a user and check for mutual match
 */
export async function likeUser(toUserId: string): Promise<MatchResult> {
  return withRetry(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new AuthError('Not authenticated.');
    }

    // Check if user has already liked this person
    const { data: existingUserLike, error: checkUserLikeError } = await supabase
      .from('likes')
      .select('*')
      .eq('from_user_id', user.id)
      .eq('to_user_id', toUserId)
      .single();

    if (checkUserLikeError && checkUserLikeError.code !== 'PGRST116') {
      throw new DatabaseError('Failed to check existing like');
    }

    if (existingUserLike) {
      return {
        success: true,
        isMatch: false,
        alreadyLiked: true,
        message: 'You have already liked this user',
      };
    }

    // Insert the new like
    const { error: likeError } = await supabase.from('likes').insert({
      from_user_id: user.id,
      to_user_id: toUserId,
    });

    if (likeError) {
      throw new DatabaseError('Failed to create like');
    }

    // Check for mutual like
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('*')
      .eq('from_user_id', toUserId)
      .eq('to_user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new DatabaseError('Failed to check for match');
    }

    if (existingLike) {
      // It's a match! Get the matched user data
      const { data: matchedUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', toUserId)
        .single();

      if (userError) {
        throw new DatabaseError('Failed to fetch matched user');
      }

      // Create match record if it doesn't exist
      const { error: matchError } = await supabase.from('matches').upsert({
        user1_id: user.id < toUserId ? user.id : toUserId,
        user2_id: user.id < toUserId ? toUserId : user.id,
        is_active: true,
      });

      if (matchError) {
        console.error('Failed to create match record:', matchError);
        // Don't throw here as the like was successful
      }

      return {
        success: true,
        isMatch: true,
        matchedUser: matchedUser as UserProfile,
      };
    }

    return { success: true, isMatch: false };
  });
}

/**
 * Get all matches for the current user
 */
export async function getUserMatches(): Promise<UserProfile[]> {
  const { data, error } = await safeAsync(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new AuthError('Not authenticated.');
    }

    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .eq('is_active', true);

    if (matchesError) {
      throw new DatabaseError('Failed to fetch matches');
    }

    const matchedUsers: UserProfile[] = [];

    // Use Promise.allSettled for better error handling
    const userPromises = (matches || []).map(async (match) => {
      const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;

      const { data: otherUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', otherUserId)
        .single();

      if (userError) {
        console.error(`Failed to fetch user ${otherUserId}:`, userError);
        return null;
      }

      return {
        id: otherUser.id,
        full_name: otherUser.full_name,
        username: otherUser.username,
        email: otherUser.email,
        gender: otherUser.gender,
        birthdate: otherUser.birthdate,
        bio: otherUser.bio,
        avatar_url: otherUser.avatar_url,
        preferences: otherUser.preferences,
        last_active: new Date().toISOString(),
        is_verified: true,
        is_online: false,
        created_at: match.created_at,
        updated_at: match.created_at,
      } as UserProfile;
    });

    const results = await Promise.allSettled(userPromises);
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        matchedUsers.push(result.value);
      }
    });

    return matchedUsers;
  });

  if (error) {
    throw error;
  }

  return data || [];
}
