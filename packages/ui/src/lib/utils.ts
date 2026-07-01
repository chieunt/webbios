import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string (assumed to be UTC) according to the user's timezone preference
 * @param dateString The date string from database (e.g. '2026-06-30 05:50:35')
 * @param displayTimezone 'UTC' or 'Local' (defaults to Local)
 * @param locale Locale string for formatting (defaults to 'vi-VN')
 */
export function formatSystemDate(
  dateString: string | null | undefined, 
  displayTimezone: 'UTC' | 'Local' = 'Local',
  locale: string = 'vi-VN'
) {
  if (!dateString) return '';
  
  // Ensure the string is treated as UTC if it doesn't already have a timezone indicator
  const safeDateString = dateString.endsWith('Z') || dateString.includes('+') 
    ? dateString 
    : dateString.replace(' ', 'T') + 'Z';
    
  const dateObj = new Date(safeDateString);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return dateString;
  
  if (displayTimezone === 'UTC') {
    return new Intl.DateTimeFormat(locale, {
      timeZone: 'UTC',
      dateStyle: 'medium',
      timeStyle: 'medium'
    }).format(dateObj) + ' (UTC)';
  } else {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'medium'
    }).format(dateObj);
  }
}
