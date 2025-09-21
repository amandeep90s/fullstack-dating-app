/**
 * Centralized validation utilities with consistent error handling
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const VALIDATION_RULES = {
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 6 characters long',
    minLengthValue: 6,
  },
  name: {
    required: 'Name is required',
    minLength: 'Name must be at least 2 characters long',
    minLengthValue: 2,
  },
} as const;

/**
 * Validate email field
 */
export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return VALIDATION_RULES.email.required;
  }
  if (!VALIDATION_RULES.email.pattern.test(email)) {
    return VALIDATION_RULES.email.invalid;
  }
  return null;
}

/**
 * Validate password field
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return VALIDATION_RULES.password.required;
  }
  if (password.length < VALIDATION_RULES.password.minLengthValue) {
    return VALIDATION_RULES.password.minLength;
  }
  return null;
}

/**
 * Validate name field
 */
export function validateName(name: string): string | null {
  if (!name.trim()) {
    return VALIDATION_RULES.name.required;
  }
  if (name.trim().length < VALIDATION_RULES.name.minLengthValue) {
    return VALIDATION_RULES.name.minLength;
  }
  return null;
}

/**
 * Comprehensive form validation for auth forms
 */
export function validateAuthForm(email: string, password: string, name?: string): ValidationResult {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) errors['email'] = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors['password'] = passwordError;

  if (name !== undefined) {
    const nameError = validateName(name);
    if (nameError) errors['name'] = nameError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Debounced validation for real-time feedback
 */
export function createDebouncedValidator<T extends Record<string, any>>(
  validator: (data: T) => ValidationResult,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout;

  return (data: T, callback: (result: ValidationResult) => void) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const result = validator(data);
      callback(result);
    }, delay);
  };
}
