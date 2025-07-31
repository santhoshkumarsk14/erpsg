/**
 * Utility functions for working with browser storage (localStorage and sessionStorage)
 */

/**
 * Set an item in localStorage with optional expiration
 * @param key - The storage key
 * @param value - The value to store
 * @param expirationMinutes - Optional expiration time in minutes
 */
export const setLocalStorageItem = <T>(key: string, value: T, expirationMinutes?: number): void => {
  try {
    const item = {
      value,
      expiration: expirationMinutes ? new Date().getTime() + expirationMinutes * 60 * 1000 : null,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error setting localStorage item:', error);
  }
};

/**
 * Get an item from localStorage
 * @param key - The storage key
 * @returns The stored value or null if not found or expired
 */
export const getLocalStorageItem = <T>(key: string): T | null => {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    
    // Check if the item has expired
    if (item.expiration && new Date().getTime() > item.expiration) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value as T;
  } catch (error) {
    console.error('Error getting localStorage item:', error);
    return null;
  }
};

/**
 * Remove an item from localStorage
 * @param key - The storage key
 */
export const removeLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage item:', error);
  }
};

/**
 * Clear all items from localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Set an item in sessionStorage
 * @param key - The storage key
 * @param value - The value to store
 */
export const setSessionStorageItem = <T>(key: string, value: T): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting sessionStorage item:', error);
  }
};

/**
 * Get an item from sessionStorage
 * @param key - The storage key
 * @returns The stored value or null if not found
 */
export const getSessionStorageItem = <T>(key: string): T | null => {
  try {
    const itemStr = sessionStorage.getItem(key);
    if (!itemStr) return null;
    return JSON.parse(itemStr) as T;
  } catch (error) {
    console.error('Error getting sessionStorage item:', error);
    return null;
  }
};

/**
 * Remove an item from sessionStorage
 * @param key - The storage key
 */
export const removeSessionStorageItem = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing sessionStorage item:', error);
  }
};

/**
 * Clear all items from sessionStorage
 */
export const clearSessionStorage = (): void => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
  }
};

/**
 * Check if localStorage is available
 * @returns True if localStorage is available, false otherwise
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if sessionStorage is available
 * @returns True if sessionStorage is available, false otherwise
 */
export const isSessionStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Get the total size of localStorage in bytes
 * @returns The size in bytes
 */
export const getLocalStorageSize = (): number => {
  try {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        totalSize += key.length + value.length;
      }
    }
    return totalSize * 2; // Multiply by 2 for UTF-16 encoding
  } catch (error) {
    console.error('Error calculating localStorage size:', error);
    return 0;
  }
};

/**
 * Get all keys from localStorage
 * @returns Array of keys
 */
export const getLocalStorageKeys = (): string[] => {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
};

/**
 * Check if a key exists in localStorage
 * @param key - The storage key
 * @returns True if the key exists, false otherwise
 */
export const hasLocalStorageItem = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error('Error checking localStorage item:', error);
    return false;
  }
};

/**
 * Update a specific property in a stored object
 * @param key - The storage key
 * @param property - The property to update
 * @param value - The new value
 */
export const updateLocalStorageItemProperty = <T>(key: string, property: keyof T, value: any): void => {
  try {
    const item = getLocalStorageItem<T>(key);
    if (item) {
      const updatedItem = { ...item, [property]: value };
      const itemStr = localStorage.getItem(key);
      if (itemStr) {
        const parsedItem = JSON.parse(itemStr);
        parsedItem.value = updatedItem;
        localStorage.setItem(key, JSON.stringify(parsedItem));
      }
    }
  } catch (error) {
    console.error('Error updating localStorage item property:', error);
  }
};