/**
 * Centralized style constants to reduce duplication and ensure consistency
 */

import { cn } from '../helpers/helpers';

// Gradient patterns used throughout the app
export const GRADIENTS = {
  primary: 'from-pink-500 to-red-500',
  primaryHover: 'from-pink-600 to-red-600',
  secondary: 'from-pink-500 to-purple-600',
  secondaryHover: 'from-pink-600 to-purple-700',
  background: {
    light: 'from-pink-50 to-red-50',
    dark: 'from-gray-900 to-gray-800',
    slate: 'from-slate-50 to-pink-50 dark:from-slate-900 dark:to-slate-800',
  },
} as const;

// Button style variations
export const BUTTON_STYLES = {
  primary: cn(
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white',
    'bg-gradient-to-r transition-all duration-200 shadow-md hover:shadow-lg',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    `bg-gradient-to-r ${GRADIENTS.primary} hover:${GRADIENTS.primaryHover}`,
    'focus:ring-pink-500'
  ),
  secondary: cn(
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold',
    'border-2 border-pink-500 text-pink-500 transition-all duration-200',
    'hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2',
    'dark:text-pink-400 dark:border-pink-400 dark:hover:bg-pink-400 dark:hover:text-white'
  ),
  large: cn(
    'inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-semibold text-white',
    'transform transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    `bg-gradient-to-r ${GRADIENTS.secondary} hover:${GRADIENTS.secondaryHover}`,
    'focus:ring-pink-500'
  ),
} as const;

// Card styles
export const CARD_STYLES = {
  base: cn(
    'rounded-lg bg-white shadow-sm border border-gray-200',
    'dark:bg-gray-800 dark:border-gray-700'
  ),
  elevated: cn(
    'rounded-lg bg-white shadow-lg border border-gray-200',
    'dark:bg-gray-800 dark:border-gray-700'
  ),
  interactive: cn(
    'rounded-lg bg-white shadow-sm border border-gray-200 transition-all duration-200',
    'hover:shadow-md hover:border-gray-300 cursor-pointer',
    'dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
  ),
} as const;

// Input field styles
export const INPUT_STYLES = {
  base: cn(
    'block w-full rounded-md border px-3 py-2 shadow-sm transition-colors',
    'placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500 focus:outline-none',
    'dark:bg-gray-800 dark:text-white dark:border-gray-600'
  ),
  error: cn(
    'block w-full rounded-md border px-3 py-2 shadow-sm transition-colors',
    'placeholder-gray-400 focus:border-red-500 focus:ring-red-500 focus:outline-none',
    'border-red-500 dark:bg-gray-800 dark:text-white dark:border-red-500'
  ),
} as const;

// Background patterns
export const BACKGROUND_STYLES = {
  gradient: cn(`bg-gradient-to-br ${GRADIENTS.background.light} dark:${GRADIENTS.background.dark}`),
  slateGradient: cn(`bg-gradient-to-br ${GRADIENTS.background.slate}`),
  fullHeight: cn('min-h-screen flex items-center justify-center'),
} as const;

// Text styles for consistency
export const TEXT_STYLES = {
  heading: cn('text-gray-900 dark:text-white font-bold'),
  subheading: cn('text-gray-600 dark:text-gray-400'),
  body: cn('text-gray-700 dark:text-gray-300'),
  muted: cn('text-gray-500 dark:text-gray-500'),
  error: cn('text-red-600 dark:text-red-400'),
  success: cn('text-green-600 dark:text-green-400'),
} as const;

// Common layout patterns
export const LAYOUT_STYLES = {
  container: cn('container mx-auto px-6'),
  centerContent: cn('flex items-center justify-center'),
  flexCol: cn('flex flex-col'),
  flexRow: cn('flex flex-row items-center'),
  spaceBetween: cn('flex items-center justify-between'),
} as const;
