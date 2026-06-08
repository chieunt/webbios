import { useState, useEffect, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface IconPickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export function IconPicker({
  value,
  onChange,
  placeholder = 'Select icon...',
  searchPlaceholder = 'Search icon...',
  title = 'Select Icon',
  className,
  disabled = false
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const allIconNames = useMemo(() => {
    return Object.keys(LucideIcons.icons || LucideIcons).filter((key) => {
      // Basic check to ensure we only include icon components
      return typeof (LucideIcons as any)[key] === 'function' || typeof (LucideIcons as any)[key] === 'object';
    }).filter(key => key !== 'createLucideIcon' && key !== 'default' && key !== 'icons');
  }, []);

  const filteredIcons = useMemo(() => {
    if (!searchTerm) return allIconNames;
    const lower = searchTerm.toLowerCase();
    return allIconNames.filter(name => name.toLowerCase().includes(lower));
  }, [searchTerm, allIconNames]);

  const SelectedIcon = value && (LucideIcons as any)[value] ? (LucideIcons as any)[value] : null;

  return (
    <div className={cn('relative w-full', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 text-sm bg-white border border-cf-border rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className="flex items-center gap-2 truncate text-gray-700">
          {SelectedIcon ? (
            <>
              <SelectedIcon className="w-4 h-4" />
              <span>{value}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-white rounded-lg p-4 w-full max-w-3xl h-[80vh] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button type="button" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            
            <div className="relative mb-4 shrink-0">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="flex-1 overflow-y-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 pr-2 content-start">
              {filteredIcons.length === 0 ? (
                <div className="col-span-full text-center text-sm text-gray-500 py-8">No icons found</div>
              ) : (
                filteredIcons.map((name) => {
                  const IconComp = (LucideIcons as any)[name];
                  if (!IconComp) return null;
                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={() => {
                        onChange(name);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={cn(
                        'flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer',
                        value === name ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-gray-600 border border-transparent hover:border-gray-200'
                      )}
                    >
                      <IconComp className="w-6 h-6 mb-2" />
                      <span className="text-[10px] truncate w-full text-center">{name}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
