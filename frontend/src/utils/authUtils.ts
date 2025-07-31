import { jwtDecode } from 'jwt-decode';
import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem } from './storageUtils';

// Storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

// Token expiration buffer in seconds (5 minutes)
const TOKEN_EXPIRATION_BUFFER = 300;

/**
 * Interface for JWT payload
 */
interface JwtPayload {
  sub: string; // Subject (user ID)
  exp: number; // Expiration time
  iat: number; // Issued at
  roles?: string[]; // User roles
  permissions?: string[]; // User permissions
  [key: string]: any; // Other custom claims
}

/**
 * Interface for user data
 */
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions?: string[];
  companyId?: string;
  [key: string]: any;
}

/**
 * Save authentication tokens to localStorage
 * @param accessToken - The JWT access token
 * @param refreshToken - The JWT refresh token
 */
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  setLocalStorageItem(ACCESS_TOKEN_KEY, accessToken);
  setLocalStorageItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Get the access token from localStorage
 * @returns The access token or null if not found
 */
export const getAccessToken = (): string | null => {
  return getLocalStorageItem<string>(ACCESS_TOKEN_KEY);
};

/**
 * Get the refresh token from localStorage
 * @returns The refresh token or null if not found
 */
export const getRefreshToken = (): string | null => {
  return getLocalStorageItem<string>(REFRESH_TOKEN_KEY);
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuth = (): void => {
  removeLocalStorageItem(ACCESS_TOKEN_KEY);
  removeLocalStorageItem(REFRESH_TOKEN_KEY);
  removeLocalStorageItem(USER_KEY);
};

/**
 * Check if the user is authenticated
 * @returns True if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired (with buffer)
    return decoded.exp > currentTime + TOKEN_EXPIRATION_BUFFER;
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};

/**
 * Check if the access token is expired or about to expire
 * @param bufferSeconds - Seconds before actual expiration to consider token as expired
 * @returns True if token is expired or about to expire, false otherwise
 */
export const isTokenExpired = (bufferSeconds = TOKEN_EXPIRATION_BUFFER): boolean => {
  const token = getAccessToken();
  if (!token) return true;
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    return decoded.exp <= currentTime + bufferSeconds;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get the time until token expiration in seconds
 * @returns Seconds until expiration or 0 if token is invalid or expired
 */
export const getTokenExpirationTime = (): number => {
  const token = getAccessToken();
  if (!token) return 0;
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    return Math.max(0, decoded.exp - currentTime);
  } catch (error) {
    console.error('Error getting token expiration time:', error);
    return 0;
  }
};

/**
 * Decode and get user information from the access token
 * @returns The decoded user information or null if token is invalid
 */
export const getDecodedToken = (): JwtPayload | null => {
  const token = getAccessToken();
  if (!token) return null;
  
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Save user data to localStorage
 * @param user - The user data to save
 */
export const saveUser = (user: AuthUser): void => {
  setLocalStorageItem(USER_KEY, user);
};

/**
 * Get user data from localStorage
 * @returns The user data or null if not found
 */
export const getUser = (): AuthUser | null => {
  return getLocalStorageItem<AuthUser>(USER_KEY);
};

/**
 * Check if the user has a specific role
 * @param role - The role to check
 * @returns True if the user has the role, false otherwise
 */
export const hasRole = (role: string): boolean => {
  const user = getUser();
  if (!user || !user.roles) return false;
  
  return user.roles.includes(role);
};

/**
 * Check if the user has a specific permission
 * @param permission - The permission to check
 * @returns True if the user has the permission, false otherwise
 */
export const hasPermission = (permission: string): boolean => {
  const user = getUser();
  if (!user || !user.permissions) return false;
  
  return user.permissions.includes(permission);
};

/**
 * Check if the user has any of the specified roles
 * @param roles - Array of roles to check
 * @returns True if the user has any of the roles, false otherwise
 */
export const hasAnyRole = (roles: string[]): boolean => {
  const user = getUser();
  if (!user || !user.roles) return false;
  
  return roles.some(role => user.roles.includes(role));
};

/**
 * Check if the user has all of the specified roles
 * @param roles - Array of roles to check
 * @returns True if the user has all of the roles, false otherwise
 */
export const hasAllRoles = (roles: string[]): boolean => {
  const user = getUser();
  if (!user || !user.roles) return false;
  
  return roles.every(role => user.roles.includes(role));
};

/**
 * Get user's full name
 * @returns The user's full name or empty string if user data is not available
 */
export const getUserFullName = (): string => {
  const user = getUser();
  if (!user) return '';
  
  return `${user.firstName} ${user.lastName}`.trim();
};

/**
 * Get user's initials
 * @returns The user's initials or empty string if user data is not available
 */
export const getUserInitials = (): string => {
  const user = getUser();
  if (!user) return '';
  
  const firstInitial = user.firstName ? user.firstName.charAt(0) : '';
  const lastInitial = user.lastName ? user.lastName.charAt(0) : '';
  
  return (firstInitial + lastInitial).toUpperCase();
};