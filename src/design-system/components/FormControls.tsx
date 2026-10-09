import React from 'react';
import { colors, spacing, borderRadius, motion, typography } from '../tokens';

// ═══════════════════════════════════════════════════════════
// BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  disabled,
  className = '',
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    fontWeight: typography.fontWeight.medium,
    borderRadius: borderRadius.md,
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: `all ${motion.duration.fast} ${motion.easing.default}`,
    opacity: disabled || loading ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    ...style,
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      height: '2rem',
      padding: `${spacing[1]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
    },
    md: {
      height: '2.5rem',
      padding: `${spacing[2]} ${spacing[4]}`,
      fontSize: typography.fontSize.sm,
    },
    lg: {
      height: '3rem',
      padding: `${spacing[3]} ${spacing[6]}`,
      fontSize: typography.fontSize.base,
    },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.primary[600],
      color: '#FFFFFF',
    },
    secondary: {
      backgroundColor: colors.slate[600],
      color: '#FFFFFF',
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary[600],
      border: `1px solid ${colors.primary[600]}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.slate[700],
    },
    danger: {
      backgroundColor: colors.error[600],
      color: '#FFFFFF',
    },
  };

  return (
    <button
      className={className}
      style={{ ...baseStyles, ...sizeStyles[size], ...variantStyles[variant] }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          style={{ marginRight: children ? spacing[2] : 0 }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeOpacity="0.25"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════
// INPUT COMPONENT
// ═══════════════════════════════════════════════════════════

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  style,
  ...props
}) => {
  const wrapperStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
    width: '100%',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.slate[700],
  };

  const inputWrapperStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      height: '2rem',
      padding: `${spacing[1]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
    },
    md: {
      height: '2.5rem',
      padding: `${spacing[2]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
    },
    lg: {
      height: '3rem',
      padding: `${spacing[3]} ${spacing[4]}`,
      fontSize: typography.fontSize.base,
    },
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    borderRadius: borderRadius.md,
    border: `1px solid ${error ? colors.error[500] : colors.slate[300]}`,
    backgroundColor: '#FFFFFF',
    transition: `all ${motion.duration.fast} ${motion.easing.default}`,
    outline: 'none',
    ...sizeStyles[size],
    paddingLeft: icon && iconPosition === 'left' ? '2.5rem' : sizeStyles[size].padding,
    paddingRight: icon && iconPosition === 'right' ? '2.5rem' : sizeStyles[size].padding,
    ...style,
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    left: iconPosition === 'left' ? spacing[3] : 'auto',
    right: iconPosition === 'right' ? spacing[3] : 'auto',
    color: colors.slate[400],
    pointerEvents: 'none',
  };

  const helperStyles: React.CSSProperties = {
    fontSize: typography.fontSize.xs,
    color: error ? colors.error[600] : colors.slate[500],
  };

  return (
    <div className={className} style={wrapperStyles}>
      {label && <label style={labelStyles}>{label}</label>}
      <div style={inputWrapperStyles}>
        {icon && <div style={iconStyles}>{icon}</div>}
        <input
          style={inputStyles}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <span style={helperStyles}>{error || helperText}</span>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SELECT COMPONENT
// ═══════════════════════════════════════════════════════════

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  size = 'md',
  placeholder,
  className = '',
  style,
  ...props
}) => {
  const wrapperStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
    width: '100%',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.slate[700],
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      height: '2rem',
      padding: `${spacing[1]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
    },
    md: {
      height: '2.5rem',
      padding: `${spacing[2]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
    },
    lg: {
      height: '3rem',
      padding: `${spacing[3]} ${spacing[4]}`,
      fontSize: typography.fontSize.base,
    },
  };

  const selectStyles: React.CSSProperties = {
    width: '100%',
    borderRadius: borderRadius.md,
    border: `1px solid ${error ? colors.error[500] : colors.slate[300]}`,
    backgroundColor: '#FFFFFF',
    transition: `all ${motion.duration.fast} ${motion.easing.default}`,
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748B' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    paddingRight: '2.5rem',
    ...sizeStyles[size],
    ...style,
  };

  const helperStyles: React.CSSProperties = {
    fontSize: typography.fontSize.xs,
    color: error ? colors.error[600] : colors.slate[500],
  };

  return (
    <div className={className} style={wrapperStyles}>
      {label && <label style={labelStyles}>{label}</label>}
      <select style={selectStyles} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <span style={helperStyles}>{error || helperText}</span>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TEXTAREA COMPONENT
// ═══════════════════════════════════════════════════════════

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  className = '',
  style,
  ...props
}) => {
  const wrapperStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
    width: '100%',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.slate[700],
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      minHeight: '4rem',
      padding: spacing[2],
      fontSize: typography.fontSize.sm,
    },
    md: {
      minHeight: '6rem',
      padding: spacing[3],
      fontSize: typography.fontSize.sm,
    },
    lg: {
      minHeight: '8rem',
      padding: spacing[4],
      fontSize: typography.fontSize.base,
    },
  };

  const textareaStyles: React.CSSProperties = {
    width: '100%',
    borderRadius: borderRadius.md,
    border: `1px solid ${error ? colors.error[500] : colors.slate[300]}`,
    backgroundColor: '#FFFFFF',
    transition: `all ${motion.duration.fast} ${motion.easing.default}`,
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    ...sizeStyles[size],
    ...style,
  };

  const helperStyles: React.CSSProperties = {
    fontSize: typography.fontSize.xs,
    color: error ? colors.error[600] : colors.slate[500],
  };

  return (
    <div className={className} style={wrapperStyles}>
      {label && <label style={labelStyles}>{label}</label>}
      <textarea style={textareaStyles} {...props} />
      {(error || helperText) && (
        <span style={helperStyles}>{error || helperText}</span>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// CHECKBOX COMPONENT
// ═══════════════════════════════════════════════════════════

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  className = '',
  style,
  ...props
}) => {
  const wrapperStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing[2],
    cursor: 'pointer',
  };

  const checkboxStyles: React.CSSProperties = {
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: borderRadius.sm,
    border: `2px solid ${error ? colors.error[500] : colors.slate[300]}`,
    cursor: 'pointer',
    accentColor: colors.primary[600],
    marginTop: '0.125rem',
    ...style,
  };

  const labelStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    color: colors.slate[700],
    userSelect: 'none',
  };

  const errorStyles: React.CSSProperties = {
    fontSize: typography.fontSize.xs,
    color: colors.error[600],
    marginTop: spacing[1],
  };

  return (
    <div className={className}>
      <label style={wrapperStyles}>
        <input type="checkbox" style={checkboxStyles} {...props} />
        {label && <span style={labelStyles}>{label}</span>}
      </label>
      {error && <div style={errorStyles}>{error}</div>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// RADIO COMPONENT
// ═══════════════════════════════════════════════════════════

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  className = '',
  style,
  ...props
}) => {
  const wrapperStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    cursor: 'pointer',
  };

  const radioStyles: React.CSSProperties = {
    width: '1.25rem',
    height: '1.25rem',
    cursor: 'pointer',
    accentColor: colors.primary[600],
    ...style,
  };

  const labelStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    color: colors.slate[700],
    userSelect: 'none',
  };

  return (
    <label className={className} style={wrapperStyles}>
      <input type="radio" style={radioStyles} {...props} />
      {label && <span style={labelStyles}>{label}</span>}
    </label>
  );
};
