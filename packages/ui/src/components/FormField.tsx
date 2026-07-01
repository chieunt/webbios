import * as React from "react"
import { cn } from "../lib/utils"
import { HelpCircle } from "lucide-react"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  error?: string;
  required?: boolean;
  description?: string;
}

export function FormField({ 
  label, 
  error, 
  required, 
  description,
  className, 
  children, 
  ...props 
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      {label && (
        <div className="flex items-center space-x-2">
          <label className="block text-sm font-medium text-cf-text">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {description && (
            <div className="group relative flex items-center">
              <HelpCircle className="w-4 h-4 text-cf-gray-text hover:text-cf-text cursor-help transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-max max-w-xs bg-gray-900 text-white text-xs rounded py-1 px-2 z-50">
                {description}
                <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>
      )}
      {!label && description && (
        <p className="text-xs text-cf-gray-text">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
}
