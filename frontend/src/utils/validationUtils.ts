/**
 * Utility functions for form validation
 */

/**
 * Validate if a value is required (not empty)
 * @param value - The value to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validateRequired = (value: any): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return 'This field is required';
  }
  if (Array.isArray(value) && value.length === 0) {
    return 'Please select at least one option';
  }
  return undefined;
};

/**
 * Validate if a value is a valid email address
 * @param value - The value to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validateEmail = (value: string): string | undefined => {
  if (!value) return undefined; // Skip validation if empty (use validateRequired for required fields)
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

/**
 * Validate if a value is a valid phone number
 * @param value - The value to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validatePhone = (value: string): string | undefined => {
  if (!value) return undefined; // Skip validation if empty
  
  // Remove all non-numeric characters for validation
  const numericValue = value.replace(/\D/g, '');
  
  // Check if the numeric value has a valid length
  if (numericValue.length < 10 || numericValue.length > 15) {
    return 'Please enter a valid phone number';
  }
  return undefined;
};

/**
 * Validate if a value is a valid URL
 * @param value - The value to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validateUrl = (value: string): string | undefined => {
  if (!value) return undefined; // Skip validation if empty
  
  try {
    new URL(value);
    return undefined;
  } catch (error) {
    return 'Please enter a valid URL';
  }
};

/**
 * Validate if a value is a valid number
 * @param value - The value to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validateNumber = (value: any): string | undefined => {
  if (value === undefined || value === null || value === '') return undefined; // Skip validation if empty
  
  if (isNaN(Number(value))) {
    return 'Please enter a valid number';
  }
  return undefined;
};

/**
 * Validate if a value is a valid integer
 * @param value - The value to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validateInteger = (value: any): string | undefined => {
  if (value === undefined || value === null || value === '') return undefined; // Skip validation if empty
  
  if (!Number.isInteger(Number(value)) || isNaN(Number(value))) {
    return 'Please enter a valid integer';
  }
  return undefined;
};

/**
 * Validate if a value is within a minimum and maximum range
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns A validation function
 */
export const validateRange = (min: number, max: number) => {
  return (value: any): string | undefined => {
    if (value === undefined || value === null || value === '') return undefined; // Skip validation if empty
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return 'Please enter a valid number';
    }
    
    if (numValue < min) {
      return `Value must be at least ${min}`;
    }
    
    if (numValue > max) {
      return `Value must be at most ${max}`;
    }
    
    return undefined;
  };
};

/**
 * Validate if a value has a minimum length
 * @param minLength - The minimum length
 * @returns A validation function
 */
export const validateMinLength = (value: string, minLength: number): string | undefined => {
  return value.length < minLength ? `Must be at least ${minLength} characters` : undefined;
};

/**
 * Validate if a value has a maximum length
 * @param maxLength - The maximum length
 * @returns A validation function
 */
export const validateMaxLength = (maxLength: number) => {
  return (value: string): string | undefined => {
    if (!value) return undefined; // Skip validation if empty
    
    if (value.length > maxLength) {
      return `Must be at most ${maxLength} characters`;
    }
    return undefined;
  };
};

/**
 * Validate if a value matches a pattern
 * @param pattern - The regular expression pattern
 * @param errorMessage - The error message to display
 * @returns A validation function
 */
export const validatePattern = (pattern: RegExp, errorMessage: string) => {
  return (value: string): string | undefined => {
    if (!value) return undefined; // Skip validation if empty
    
    if (!pattern.test(value)) {
      return errorMessage;
    }
    return undefined;
  };
};

/**
 * Validate if a value matches another value
 * @param getCompareValue - Function to get the value to compare against
 * @param errorMessage - The error message to display
 * @returns A validation function
 */
export const validateMatch = (value: any, compareValue: any): string | undefined => {
  if (value !== compareValue) {
    return 'Values do not match';
  }
  return undefined;
};

/**
 * Validate if a date is in the future
 * @param value - The date value to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validateFutureDate = (value: string | Date): string | undefined => {
  if (!value) return undefined; // Skip validation if empty
  
  const date = new Date(value);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return 'Please enter a valid date';
  }
  
  if (date <= now) {
    return 'Date must be in the future';
  }
  
  return undefined;
};

/**
 * Validate if a date is in the past
 * @param value - The date value to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validatePastDate = (value: string | Date): string | undefined => {
  if (!value) return undefined; // Skip validation if empty
  
  const date = new Date(value);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return 'Please enter a valid date';
  }
  
  if (date >= now) {
    return 'Date must be in the past';
  }
  
  return undefined;
};

/**
 * Validate if a value is a valid date
 * @param value - The date value to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validateDate = (value: string | Date): string | undefined => {
  if (!value) return undefined; // Skip validation if empty
  
  const date = new Date(value);
  
  if (isNaN(date.getTime())) {
    return 'Please enter a valid date';
  }
  
  return undefined;
};

/**
 * Validate if a value is a valid password
 * @param value - The password to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validatePassword = (value: string): string | undefined => {
  if (!value) return undefined; // Skip validation if empty
  
  const errors = [];
  
  if (value.length < 8) {
    errors.push('at least 8 characters');
  }
  
  if (!/[A-Z]/.test(value)) {
    errors.push('an uppercase letter');
  }
  
  if (!/[a-z]/.test(value)) {
    errors.push('a lowercase letter');
  }
  
  if (!/[0-9]/.test(value)) {
    errors.push('a number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    errors.push('a special character');
  }
  
  if (errors.length > 0) {
    return `Password must contain ${errors.join(', ')}`;
  }
  
  return undefined;
};

/**
 * Combine multiple validators into one
 * @param validators - Array of validator functions
 * @returns A combined validation function
 */
export const combineValidators = (...validators: ((value: any) => string | undefined)[]) => {
  return (value: any): string | undefined => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        return error;
      }
    }
    return undefined;
  };
};

/**
 * Create a custom validator
 * @param isValid - Function that returns true if valid, false if invalid
 * @param errorMessage - The error message to display
 * @returns A validation function
 */
export const createValidator = (isValid: (value: any) => boolean, errorMessage: string) => {
  return (value: any): string | undefined => {
    if (value === undefined || value === null || value === '') return undefined; // Skip validation if empty
    
    if (!isValid(value)) {
      return errorMessage;
    }
    return undefined;
  };
};