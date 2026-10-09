import React from 'react';
import { colors, spacing, borderRadius, typography, motion } from '../tokens';

// ═══════════════════════════════════════════════════════════
// STATUS BADGE COMPONENT
// ═══════════════════════════════════════════════════════════

export type StatusType = 
  | 'success' | 'approved' | 'completed' | 'active' | 'healthy'
  | 'warning' | 'pending' | 'in-progress' | 'review' | 'degraded'
  | 'error' | 'failed' | 'rejected' | 'critical' | 'down'
  | 'info' | 'draft' | 'planned' | 'scheduled'
  | 'neutral' | 'default' | 'inactive' | 'archived';

export interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  icon,
  pulse = false,
}) => {
  const getStatusColors = (status: string): { bg: string; text: string; border: string } => {
    const statusLower = status.toLowerCase();
    
    // Success states
    if (['success', 'approved', 'completed', 'active', 'healthy'].includes(statusLower)) {
      return {
        bg: colors.success[50],
        text: colors.success[700],
        border: colors.success[200],
      };
    }
    
    // Warning states
    if (['warning', 'pending', 'in-progress', 'review', 'degraded'].includes(statusLower)) {
      return {
        bg: colors.warning[50],
        text: colors.warning[700],
        border: colors.warning[200],
      };
    }
    
    // Error states
    if (['error', 'failed', 'rejected', 'critical', 'down'].includes(statusLower)) {
      return {
        bg: colors.error[50],
        text: colors.error[700],
        border: colors.error[200],
      };
    }
    
    // Info states
    if (['info', 'draft', 'planned', 'scheduled'].includes(statusLower)) {
      return {
        bg: colors.info[50],
        text: colors.info[700],
        border: colors.info[200],
      };
    }
    
    // Default/Neutral
    return {
      bg: colors.slate[100],
      text: colors.slate[700],
      border: colors.slate[300],
    };
  };

  const colors_ = getStatusColors(status);
  
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: `${spacing[0.5]} ${spacing[2]}`,
      fontSize: typography.fontSize.xs,
    },
    md: {
      padding: `${spacing[1]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
    },
    lg: {
      padding: `${spacing[1.5]} ${spacing[4]}`,
      fontSize: typography.fontSize.base,
    },
  };

  const badgeStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[1.5],
    borderRadius: borderRadius.full,
    backgroundColor: colors_.bg,
    color: colors_.text,
    border: `1px solid ${colors_.border}`,
    fontWeight: typography.fontWeight.medium,
    whiteSpace: 'nowrap',
    ...sizeStyles[size],
  };

  const dotStyles: React.CSSProperties = {
    width: size === 'sm' ? '0.375rem' : '0.5rem',
    height: size === 'sm' ? '0.375rem' : '0.5rem',
    borderRadius: borderRadius.full,
    backgroundColor: colors_.text,
    animation: pulse ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
  };

  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ');

  return (
    <span style={badgeStyles}>
      {icon ? (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      ) : (
        <span style={dotStyles} />
      )}
      <span>{displayLabel}</span>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </span>
  );
};

// ═══════════════════════════════════════════════════════════
// CARD COMPONENT
// ═══════════════════════════════════════════════════════════

export interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  elevation = 'sm',
  hoverable = false,
  onClick,
  className = '',
  style,
}) => {
  const paddingStyles: Record<string, React.CSSProperties> = {
    none: { padding: 0 },
    sm: { padding: spacing[3] },
    md: { padding: spacing[4] },
    lg: { padding: spacing[6] },
  };

  const elevationStyles: Record<string, { boxShadow: string }> = {
    none: { boxShadow: 'none' },
    sm: { boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    md: { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
    lg: { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
  };

  const cardStyles: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.slate[200]}`,
    transition: `all ${motion.duration.fast} ${motion.easing.default}`,
    cursor: onClick ? 'pointer' : 'default',
    ...paddingStyles[padding],
    ...elevationStyles[elevation],
    ...style,
  };

  const hoverStyles = hoverable
    ? {
        ':hover': {
          boxShadow: elevationStyles.md.boxShadow,
          transform: 'translateY(-2px)',
        },
      }
    : {};

  return (
    <div
      className={className}
      style={cardStyles}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = elevationStyles.md.boxShadow;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = elevationStyles[elevation].boxShadow;
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ALERT COMPONENT
// ═══════════════════════════════════════════════════════════

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  type: AlertType;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  children,
  icon,
  onClose,
  className = '',
}) => {
  const typeStyles: Record<AlertType, { bg: string; border: string; text: string; icon: string }> = {
    info: {
      bg: colors.info[50],
      border: colors.info[200],
      text: colors.info[800],
      icon: colors.info[600],
    },
    success: {
      bg: colors.success[50],
      border: colors.success[200],
      text: colors.success[800],
      icon: colors.success[600],
    },
    warning: {
      bg: colors.warning[50],
      border: colors.warning[200],
      text: colors.warning[800],
      icon: colors.warning[600],
    },
    error: {
      bg: colors.error[50],
      border: colors.error[200],
      text: colors.error[800],
      icon: colors.error[600],
    },
  };

  const styles = typeStyles[type];

  const alertStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: borderRadius.md,
    backgroundColor: styles.bg,
    border: `1px solid ${styles.border}`,
    color: styles.text,
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
  };

  const titleStyles: React.CSSProperties = {
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[1],
    fontSize: typography.fontSize.sm,
  };

  const bodyStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.relaxed,
  };

  const closeButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: styles.text,
    cursor: 'pointer',
    padding: spacing[1],
    borderRadius: borderRadius.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className={className} style={alertStyles} role="alert">
      {icon && (
        <div style={{ color: styles.icon, flexShrink: 0 }}>
          {icon}
        </div>
      )}
      <div style={contentStyles}>
        {title && <div style={titleStyles}>{title}</div>}
        <div style={bodyStyles}>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={closeButtonStyles}
          aria-label="Close alert"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// LOADING SPINNER COMPONENT
// ═══════════════════════════════════════════════════════════

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = colors.primary[600],
  className = '',
}) => {
  const sizeStyles: Record<string, { width: number; height: number; borderWidth: number }> = {
    sm: { width: 16, height: 16, borderWidth: 2 },
    md: { width: 24, height: 24, borderWidth: 3 },
    lg: { width: 32, height: 32, borderWidth: 3 },
  };

  const sizeConfig = sizeStyles[size];

  const spinnerStyles: React.CSSProperties = {
    width: sizeConfig.width,
    height: sizeConfig.height,
    border: `${sizeConfig.borderWidth}px solid ${colors.slate[200]}`,
    borderTopColor: color,
    borderRadius: borderRadius.full,
    animation: 'spin 0.6s linear infinite',
  };

  return (
    <>
      <div className={className} style={spinnerStyles} role="status" aria-label="Loading" />
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// EMPTY STATE COMPONENT
// ═══════════════════════════════════════════════════════════

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[12],
    textAlign: 'center',
  };

  const iconStyles: React.CSSProperties = {
    marginBottom: spacing[4],
    color: colors.slate[400],
  };

  const titleStyles: React.CSSProperties = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.slate[900],
    marginBottom: spacing[2],
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    color: colors.slate[600],
    marginBottom: spacing[6],
    maxWidth: '28rem',
  };

  return (
    <div className={className} style={containerStyles}>
      {icon && <div style={iconStyles}>{icon}</div>}
      <div style={titleStyles}>{title}</div>
      {description && <div style={descriptionStyles}>{description}</div>}
      {action && <div>{action}</div>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// DIVIDER COMPONENT
// ═══════════════════════════════════════════════════════════

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  spacing: spacingSize = 'md',
  className = '',
}) => {
  const spacingStyles: Record<string, React.CSSProperties> = {
    sm: orientation === 'horizontal' 
      ? { margin: `${spacing[2]} 0` }
      : { margin: `0 ${spacing[2]}` },
    md: orientation === 'horizontal'
      ? { margin: `${spacing[4]} 0` }
      : { margin: `0 ${spacing[4]}` },
    lg: orientation === 'horizontal'
      ? { margin: `${spacing[6]} 0` }
      : { margin: `0 ${spacing[6]}` },
  };

  const dividerStyles: React.CSSProperties = {
    border: 'none',
    backgroundColor: colors.slate[200],
    ...(orientation === 'horizontal'
      ? { height: '1px', width: '100%' }
      : { width: '1px', height: '100%', alignSelf: 'stretch' }),
    ...spacingStyles[spacingSize],
  };

  return <hr className={className} style={dividerStyles} />;
};

// ═══════════════════════════════════════════════════════════
// BADGE COMPONENT
// ═══════════════════════════════════════════════════════════

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantStyles: Record<string, { bg: string; text: string }> = {
    default: { bg: colors.slate[100], text: colors.slate[700] },
    primary: { bg: colors.primary[100], text: colors.primary[700] },
    success: { bg: colors.success[100], text: colors.success[700] },
    warning: { bg: colors.warning[100], text: colors.warning[700] },
    error: { bg: colors.error[100], text: colors.error[700] },
    info: { bg: colors.info[100], text: colors.info[700] },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: `${spacing[0.5]} ${spacing[2]}`,
      fontSize: typography.fontSize.xs,
    },
    md: {
      padding: `${spacing[1]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
    },
  };

  const styles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeight.medium,
    backgroundColor: variantStyles[variant].bg,
    color: variantStyles[variant].text,
    ...sizeStyles[size],
  };

  return (
    <span className={className} style={styles}>
      {children}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════
// TOOLTIP COMPONENT
// ═══════════════════════════════════════════════════════════

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const wrapperStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  };

  const tooltipStyles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 1500,
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: colors.slate[900],
    color: '#FFFFFF',
    fontSize: typography.fontSize.xs,
    borderRadius: borderRadius.md,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: isVisible ? 1 : 0,
    transition: `opacity ${motion.duration.fast} ${motion.easing.default}`,
    ...(position === 'top' && {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: spacing[2],
    }),
    ...(position === 'bottom' && {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: spacing[2],
    }),
    ...(position === 'left' && {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginRight: spacing[2],
    }),
    ...(position === 'right' && {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: spacing[2],
    }),
  };

  return (
    <div
      className={className}
      style={wrapperStyles}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div style={tooltipStyles} role="tooltip">
        {content}
      </div>
    </div>
  );
};
