import { z } from 'zod';

/**
 * Zod schema for sign-in form validation
 */
export const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

/**
 * Zod schema for sign-up form validation
 */
export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be less than 100 characters'),
});

/**
 * Type inference for sign-in form data
 */
export type SignInFormData = z.infer<typeof signInSchema>;

/**
 * Type inference for sign-up form data
 */
export type SignUpFormData = z.infer<typeof signUpSchema>;
