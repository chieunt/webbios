import * as React from 'react';
import PhoneInputLib from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { cn } from '../lib/utils';
import { Input } from './Input';

export interface PhoneInputProps {
  value?: string;
  onChange: any;
  defaultCountry?: any;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

// Custom input wrapper to strip out className injection that conflicts with the wrapper
const CustomInput = React.forwardRef<HTMLInputElement, any>((props, ref) => {
  return <Input {...props} ref={ref} className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-auto p-0" />;
});
CustomInput.displayName = 'CustomInput';

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, defaultCountry = 'VN', ...props }, ref) => {
    return (
      <div className={cn(
        "flex h-9 w-full items-center rounded-md border border-cf-border bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary",
        props.disabled ? "cursor-not-allowed opacity-50 bg-cf-gray-bg" : "",
        className
      )}>
        <PhoneInputLib
          {...props}
          ref={ref as any}
          defaultCountry={defaultCountry}
          international
          withCountryCallingCode
          inputComponent={CustomInput}
          className="flex-1 PhoneInput--custom"
        />
      </div>
    );
  }
);
PhoneInput.displayName = 'PhoneInput';
