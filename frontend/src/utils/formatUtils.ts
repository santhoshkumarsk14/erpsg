/**
 * Utility functions for formatting and validating data
 */

/**
 * Format a number as currency
 * @param value - The number to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale (default: 'en-US')
 * @returns The formatted currency string
 */
export const formatCurrency = (value: number, currency = 'USD', locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format a number with commas as thousands separators
 * @param value - The number to format
 * @param decimalPlaces - The number of decimal places (default: 2)
 * @returns The formatted number string
 */
export const formatNumber = (value: number, decimalPlaces = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
};

/**
 * Format a number as a percentage
 * @param value - The number to format (e.g., 0.25 for 25%)
 * @param decimalPlaces - The number of decimal places (default: 0)
 * @returns The formatted percentage string
 */
export const formatPercentage = (value: number, decimalPlaces = 0): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
};

/**
 * Format a phone number to a standard format
 * @param phoneNumber - The phone number to format
 * @returns The formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if it doesn't match expected formats
  return phoneNumber;
};

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes - The file size in bytes
 * @param decimals - The number of decimal places (default: 2)
 * @returns The formatted file size string
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Truncate a string to a specified length and add ellipsis if needed
 * @param str - The string to truncate
 * @param maxLength - The maximum length (default: 50)
 * @returns The truncated string
 */
export const truncateString = (str: string, maxLength = 50): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

/**
 * Capitalize the first letter of a string
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert a string to title case
 * @param str - The string to convert
 * @returns The title case string
 */
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format a credit card number with spaces or dashes
 * @param cardNumber - The credit card number
 * @param separator - The separator character (default: ' ')
 * @returns The formatted credit card number
 */
export const formatCreditCard = (cardNumber: string, separator = ' '): string => {
  if (!cardNumber) return '';
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(separator) : cleaned;
};

/**
 * Mask a credit card number, showing only the last 4 digits
 * @param cardNumber - The credit card number
 * @returns The masked credit card number
 */
export const maskCreditCard = (cardNumber: string): string => {
  if (!cardNumber) return '';
  const cleaned = cardNumber.replace(/\D/g, '');
  return cleaned.length > 4
    ? `${'*'.repeat(cleaned.length - 4)}${cleaned.slice(-4)}`
    : cleaned;
};

/**
 * Format a string as a slug (lowercase, hyphens instead of spaces)
 * @param str - The string to convert to a slug
 * @returns The slug
 */
export const slugify = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Validate an email address
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

/**
 * Validate a password strength
 * @param password - The password to validate
 * @returns An object with validation results
 */
export const validatePasswordStrength = (password: string): { 
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
} => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  
  return {
    isValid,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  };
};

/**
 * Generate initials from a name
 * @param name - The name to generate initials from
 * @param maxInitials - The maximum number of initials (default: 2)
 * @returns The initials
 */
export const getInitials = (name: string, maxInitials = 2): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .filter(char => char.match(/[A-Za-z]/))
    .slice(0, maxInitials)
    .join('')
    .toUpperCase();
};

/**
 * Format bytes to a human-readable string
 * @param bytes - The number of bytes
 * @param decimals - The number of decimal places (default: 2)
 * @returns The formatted string
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format a duration in seconds to a human-readable string (HH:MM:SS)
 * @param seconds - The duration in seconds
 * @returns The formatted duration string
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  
  if (hours > 0) {
    parts.push(String(hours).padStart(2, '0'));
  }
  
  parts.push(String(minutes).padStart(2, '0'));
  parts.push(String(secs).padStart(2, '0'));
  
  return parts.join(':');
};