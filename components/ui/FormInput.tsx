import { INPUT_STYLES, TEXT_STYLES } from '@/lib/constants/styles';
import { cn } from '@/lib/helpers/helpers';
import { forwardRef } from 'react';
import type { FieldError } from 'react-hook-form';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | undefined;
  helperText?: string;
}

/**
 * Form input component optimized for React Hook Form
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className, id, required, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);
    const inputVariant = hasError ? 'error' : 'base';

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className={cn('block text-sm font-medium', TEXT_STYLES.body)}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(INPUT_STYLES[inputVariant], className)}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />

        {error && (
          <p id={`${inputId}-error`} className={cn('text-sm', TEXT_STYLES.error)} role="alert">
            {error.message}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className={cn('text-sm', TEXT_STYLES.muted)}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
