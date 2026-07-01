import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "../lib/utils"

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function DropdownMenu({ trigger, children, align = 'right', className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 0, height: 0 });

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (e: Event) => {
      // Don't close if scrolling inside the dropdown itself
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isOpen]);

  const menu = isOpen ? createPortal(
    <div 
      ref={dropdownRef}
      className={cn(
        "fixed z-[9999] mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
        className
      )}
      style={{ 
        top: coords.top, 
        ...(align === 'right' ? {
          right: window.innerWidth - (coords.left + coords.width)
        } : {
          left: coords.left
        })
      }}
    >
      <div className="py-1" role="menu" aria-orientation="vertical">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              // @ts-ignore
              onClick: (e: any) => {
                const childProps = (child as React.ReactElement).props as any;
                if (childProps.onClick) childProps.onClick(e);
                setIsOpen(false);
              }
            });
          }
          return child;
        })}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div 
        ref={triggerRef} 
        className="inline-block"
        onClick={() => setIsOpen(!isOpen)} 
      >
        <div className="cursor-pointer">{trigger}</div>
      </div>
      {menu}
    </>
  );
}

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
}

export function DropdownMenuItem({ className, children, icon, variant = 'default', ...props }: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "w-full text-left flex items-center px-4 py-2 text-sm transition-colors",
        variant === 'danger' 
          ? "text-red-600 hover:bg-red-50 hover:text-red-700" 
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        className
      )}
      role="menuitem"
      {...props}
    >
      {icon && <span className="mr-2.5 flex items-center justify-center [&>svg]:w-3.5 [&>svg]:h-3.5 text-cf-gray-text">{icon}</span>}
      {children}
    </button>
  );
}
