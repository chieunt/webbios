import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "./Input"
import type { InputProps } from "./Input"

export interface SearchInputProps extends Omit<InputProps, 'icon' | 'suffix'> {
  onClear?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, ...props }, ref) => {
    
    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        const e = {
          target: { value: '' },
          currentTarget: { value: '' },
          preventDefault: () => {},
          stopPropagation: () => {}
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(e);
      }
    };

    return (
      <Input
        type="text"
        icon={<Search className="h-4 w-4" />}
        className={className}
        value={value}
        onChange={onChange}
        ref={ref}
        suffix={
          value && String(value).length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              className="hover:text-cf-text focus:outline-none flex items-center justify-center rounded-full p-0.5 hover:bg-gray-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null
        }
        {...props}
      />
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
