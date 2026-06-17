// @ts-ignore
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  className?: string;
  size?: number;
  fullScreen?: boolean;
  text?: string;
}

export function Loading({ className = '', size = 24, fullScreen = false, text }: LoadingProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Loader2 className="animate-spin text-primary" size={size} />
      {text && <span className="text-sm text-cf-gray-text animate-pulse">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
