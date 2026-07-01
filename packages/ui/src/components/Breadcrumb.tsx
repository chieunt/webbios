import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm text-cf-gray-text", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center space-x-2">
            {item.href && !isLast ? (
              <a href={item.href} className="hover:text-cf-text transition-colors">
                {item.label}
              </a>
            ) : (
              <span className={cn(isLast ? "text-cf-text" : "")}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight size={14} className="text-gray-400" />
            )}
          </div>
        );
      })}
    </nav>
  );
};
