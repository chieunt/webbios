import React from 'react';
import { User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackIcon?: React.ReactNode;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

/**
 * Avatar component to display a user's profile picture or initials.
 */
export function Avatar({
  src,
  alt,
  initials,
  size = 'md',
  className = '',
  fallbackIcon = <User className="h-1/2 w-1/2" />,
  ...props
}: AvatarProps) {
  const baseClasses = 'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${className}`;

  if (src) {
    return (
      <div className={combinedClasses} {...props}>
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="aspect-square h-full w-full object-cover"
          onError={(e) => {
            // Hide the broken image if it fails to load
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className={combinedClasses} {...props}>
      {initials ? (
        <span className="font-medium uppercase">{initials}</span>
      ) : (
        fallbackIcon
      )}
    </div>
  );
}

/**
 * AvatarGroup component to display multiple avatars overlapping each other.
 */
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  children: React.ReactNode;
}

export function AvatarGroup({ max, children, className = '', ...props }: AvatarGroupProps) {
  const validChildren = React.Children.toArray(children).filter(React.isValidElement);
  
  const renderChildren = max ? validChildren.slice(0, max) : validChildren;
  const extraCount = max && validChildren.length > max ? validChildren.length - max : 0;

  return (
    <div className={`flex items-center -space-x-2 ${className}`} {...props}>
      {renderChildren.map((child, index) => (
        <div key={index} className="relative ring-2 ring-white dark:ring-slate-950 rounded-full">
          {child}
        </div>
      ))}
      {extraCount > 0 && (
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400 ring-2 ring-white dark:ring-slate-950">
          +{extraCount}
        </div>
      )}
    </div>
  );
}
