import React from 'react';

type ChipVariant = 'default' | 'ok' | 'warn' | 'error' | 'muted';

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  children: React.ReactNode;
}

export function Chip({ variant = 'default', children, className = '', ...props }: ChipProps) {
  const variantClass = variant === 'default' ? '' : `chip-${variant}`;
  return (
    <span className={`chip ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
