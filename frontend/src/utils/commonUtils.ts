/**
 * Utility functions for common operations
 */

/**
 * Debounce a function call
 * @param func - The function to debounce
 * @param wait - The debounce wait time in milliseconds
 * @returns A debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle a function call
 * @param func - The function to throttle
 * @param limit - The throttle limit time in milliseconds
 * @returns A throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return function(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Deep clone an object
 * @param obj - The object to clone
 * @returns A deep clone of the object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (obj instanceof Object) {
    const copy: Record<string, any> = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone((obj as Record<string, any>)[key]);
    });
    return copy as T;
  }
  
  return obj;
};

/**
 * Check if two objects are deeply equal
 * @param obj1 - The first object
 * @param obj2 - The second object
 * @returns True if the objects are deeply equal, false otherwise
 */
export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  
  if (obj1 === null || obj2 === null) return false;
  if (obj1 === undefined || obj2 === undefined) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
  
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => {
    return keys2.includes(key) && deepEqual(obj1[key], obj2[key]);
  });
};

/**
 * Generate a random string
 * @param length - The length of the string (default: 10)
 * @returns A random string
 */
export const generateRandomString = (length = 10): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

/**
 * Generate a UUID v4
 * @returns A UUID v4 string
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Flatten an array of arrays
 * @param arr - The array to flatten
 * @returns A flattened array
 */
export const flatten = <T>(arr: T[][]): T[] => {
  return arr.reduce((acc, val) => acc.concat(val), [] as T[]);
};

/**
 * Group an array of objects by a key
 * @param arr - The array to group
 * @param key - The key to group by
 * @returns An object with groups
 */
export const groupBy = <T>(arr: T[], key: keyof T): Record<string, T[]> => {
  return arr.reduce((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

/**
 * Sort an array of objects by a key
 * @param arr - The array to sort
 * @param key - The key to sort by
 * @param direction - The sort direction (default: 'asc')
 * @returns A sorted array
 */
export const sortBy = <T>(
  arr: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  const sortedArr = [...arr];
  
  sortedArr.sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA === valueB) return 0;
    
    if (valueA === null || valueA === undefined) return direction === 'asc' ? -1 : 1;
    if (valueB === null || valueB === undefined) return direction === 'asc' ? 1 : -1;
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    return direction === 'asc'
      ? (valueA < valueB ? -1 : 1)
      : (valueA < valueB ? 1 : -1);
  });
  
  return sortedArr;
};

/**
 * Filter an array of objects by a search term
 * @param arr - The array to filter
 * @param searchTerm - The search term
 * @param keys - The keys to search in
 * @returns A filtered array
 */
export const filterBySearchTerm = <T>(
  arr: T[],
  searchTerm: string,
  keys: (keyof T)[]
): T[] => {
  if (!searchTerm) return arr;
  
  const term = searchTerm.toLowerCase();
  
  return arr.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(term);
    });
  });
};

/**
 * Chunk an array into smaller arrays
 * @param arr - The array to chunk
 * @param size - The chunk size
 * @returns An array of chunks
 */
export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  
  return chunks;
};

/**
 * Remove duplicate items from an array
 * @param arr - The array to process
 * @param key - Optional key for objects
 * @returns An array with unique items
 */
export const uniqueArray = <T>(arr: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(arr)];
  }
  
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * Delay execution for a specified time
 * @param ms - The delay time in milliseconds
 * @returns A promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry a function multiple times
 * @param fn - The function to retry
 * @param maxRetries - Maximum number of retries
 * @param delayMs - Delay between retries in milliseconds
 * @returns The function result or throws an error
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number,
  delayMs: number
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await delay(delayMs);
      }
    }
  }
  
  throw lastError!;
};

/**
 * Memoize a function (cache its results)
 * @param fn - The function to memoize
 * @returns A memoized function
 */
export const memoize = <T extends (...args: any[]) => any>(
  fn: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
  const cache = new Map<string, ReturnType<T>>();
  
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param value - The value to check
 * @returns True if the value is empty, false otherwise
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Pick specific properties from an object
 * @param obj - The source object
 * @param keys - The keys to pick
 * @returns A new object with only the picked properties
 */
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  
  return result;
};

/**
 * Omit specific properties from an object
 * @param obj - The source object
 * @param keys - The keys to omit
 * @returns A new object without the omitted properties
 */
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj } as Omit<T, K>;
  
  keys.forEach(key => {
    delete result[key as unknown as keyof Omit<T, K>];
  });
  
  return result;
};