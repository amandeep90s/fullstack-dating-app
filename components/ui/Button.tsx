import { BUTTON_STYLES } from '@/lib/constants/styles';
import { cn } from '@/lib/helpers/helpers';
import Link from 'next/link';
import { forwardRef, memo } from 'react';

interface BaseButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: keyof typeof BUTTON_STYLES;
  size?: 'sm' | 'md' | 'lg';
}

interface ButtonProps extends BaseButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

interface LinkButtonProps extends BaseButtonProps {
  href: string;
  replace?: boolean;
}

type CombinedButtonProps = ButtonProps | LinkButtonProps;

function isLinkButton(props: CombinedButtonProps): props is LinkButtonProps {
  return 'href' in props;
}

/**
 * Unified Button component that handles both button and link variants
 * with consistent styling and loading states
 */
export const Button = memo(
  forwardRef<HTMLButtonElement | HTMLAnchorElement, CombinedButtonProps>((props, ref) => {
    const {
      children,
      className,
      disabled = false,
      loading = false,
      variant = 'primary',
      size = 'md',
      ...rest
    } = props;

    const baseStyles = BUTTON_STYLES[variant];
    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-lg',
    };

    const combinedClassName = cn(
      baseStyles,
      sizeStyles[size],
      {
        'opacity-50 cursor-not-allowed': disabled || loading,
      },
      className
    );

    const content = (
      <>
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
        )}
        {children}
      </>
    );

    if (isLinkButton(props)) {
      const { href, replace } = props;
      const linkProps = {
        href,
        className: combinedClassName,
        ref: ref as React.Ref<HTMLAnchorElement>,
        ...(replace !== undefined ? { replace } : {}),
      };

      return <Link {...linkProps}>{content}</Link>;
    }

    const { onClick, type = 'button' } = props;
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={combinedClassName}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...rest}
      >
        {content}
      </button>
    );
  })
);

Button.displayName = 'Button';
