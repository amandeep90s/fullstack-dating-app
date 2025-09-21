/**
 * Enhanced error handling utilities and custom error types
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'AUTH_ERROR', 401, originalError);
    this.name = 'AuthError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'DATABASE_ERROR', 500, originalError);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public validationErrors?: Record<string, string>,
    originalError?: Error
  ) {
    super(message, 'VALIDATION_ERROR', 400, originalError);
    this.name = 'ValidationError';
  }
}

/**
 * Utility function to handle and transform errors consistently
 */
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Supabase auth errors
    if (error.message.includes('auth')) {
      return new AuthError(error.message, error);
    }

    // Database/API errors
    if (error.message.includes('failed to fetch') || error.message.includes('network')) {
      return new DatabaseError('Network error occurred', error);
    }

    return new AppError(error.message, 'UNKNOWN_ERROR', 500, error);
  }

  return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR', 500);
}

/**
 * Utility to safely execute async operations with error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    const handledError = handleError(error);
    console.error(`Operation failed: ${handledError.message}`, handledError);
    return { data: fallback ?? null, error: handledError };
  }
}

/**
 * Retry utility for transient failures
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (i === maxRetries) {
        throw handleError(lastError);
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  throw handleError(lastError!);
}
