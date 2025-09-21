import { z } from 'zod';

export const profileEditSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),

  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

  bio: z.string().max(500, 'Bio must be less than 500 characters'),

  gender: z.enum(['male', 'female', 'other'], {
    message: 'Gender is required',
  }),

  birthdate: z
    .string()
    .min(1, 'Birth date is required')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }

      return age >= 18;
    }, 'You must be at least 18 years old'),

  avatar_url: z.string().url('Invalid avatar URL').or(z.literal('')),
});

export type ProfileEditFormData = z.infer<typeof profileEditSchema>;
