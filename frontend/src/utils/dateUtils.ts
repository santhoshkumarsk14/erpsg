/**
 * Date utility functions for formatting and manipulating dates
 */

/**
 * Format a date to a string in the format 'YYYY-MM-DD'
 * @param date - The date to format
 * @returns The formatted date string
 */
export const formatDateToYYYYMMDD = (date: Date | string | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format a date to a string in the format 'DD/MM/YYYY'
 * @param date - The date to format
 * @returns The formatted date string
 */
export const formatDateToDDMMYYYY = (date: Date | string | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
};

/**
 * Format a date to a string in the format 'DD MMM YYYY' (e.g., '01 Jan 2023')
 * @param date - The date to format
 * @returns The formatted date string
 */
export const formatDateToReadable = (date: Date | string | number): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return d.toLocaleDateString('en-GB', options);
};

/**
 * Format a date to a string with time in the format 'DD MMM YYYY, HH:MM'
 * @param date - The date to format
 * @returns The formatted date and time string
 */
export const formatDateTimeToReadable = (date: Date | string | number): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return d.toLocaleDateString('en-GB', options);
};

/**
 * Format a time to a string in the format 'HH:MM'
 * @param date - The date to extract time from
 * @returns The formatted time string
 */
export const formatTimeToHHMM = (date: Date | string | number): string => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Get the difference in days between two dates
 * @param date1 - The first date
 * @param date2 - The second date
 * @returns The difference in days
 */
export const getDaysDifference = (date1: Date | string | number, date2: Date | string | number): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Check if a date is today
 * @param date - The date to check
 * @returns True if the date is today, false otherwise
 */
export const isToday = (date: Date | string | number): boolean => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is in the past
 * @param date - The date to check
 * @returns True if the date is in the past, false otherwise
 */
export const isPast = (date: Date | string | number): boolean => {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
};

/**
 * Check if a date is in the future
 * @param date - The date to check
 * @returns True if the date is in the future, false otherwise
 */
export const isFuture = (date: Date | string | number): boolean => {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d > today;
};

/**
 * Add days to a date
 * @param date - The date to add days to
 * @param days - The number of days to add
 * @returns The new date
 */
export const addDays = (date: Date | string | number, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Subtract days from a date
 * @param date - The date to subtract days from
 * @param days - The number of days to subtract
 * @returns The new date
 */
export const subtractDays = (date: Date | string | number, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
};

/**
 * Get the start of the month for a given date
 * @param date - The date to get the start of the month for
 * @returns The start of the month
 */
export const getStartOfMonth = (date: Date | string | number): Date => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get the end of the month for a given date
 * @param date - The date to get the end of the month for
 * @returns The end of the month
 */
export const getEndOfMonth = (date: Date | string | number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get the start of the week for a given date (Monday as first day of week)
 * @param date - The date to get the start of the week for
 * @returns The start of the week
 */
export const getStartOfWeek = (date: Date | string | number): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get the end of the week for a given date (Sunday as last day of week)
 * @param date - The date to get the end of the week for
 * @returns The end of the week
 */
export const getEndOfWeek = (date: Date | string | number): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (day === 0 ? 0 : 7 - day); // Adjust when day is Sunday
  d.setDate(diff);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get an array of dates for a given month
 * @param year - The year
 * @param month - The month (0-11)
 * @returns An array of dates for the month
 */
export const getDatesInMonth = (year: number, month: number): Date[] => {
  const dates: Date[] = [];
  const date = new Date(year, month, 1);
  
  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  
  return dates;
};

/**
 * Get the number of days in a month
 * @param year - The year
 * @param month - The month (0-11)
 * @returns The number of days in the month
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Get the quarter of a date
 * @param date - The date to get the quarter for
 * @returns The quarter (1-4)
 */
export const getQuarter = (date: Date | string | number): number => {
  const d = new Date(date);
  const month = d.getMonth();
  return Math.floor(month / 3) + 1;
};

/**
 * Format a date range to a string
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns The formatted date range string
 */
export const formatDateRange = (startDate: Date | string | number, endDate: Date | string | number): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If same day
  if (
    start.getDate() === end.getDate() &&
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return formatDateToReadable(start);
  }
  
  // If same month and year
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    const startDay = String(start.getDate()).padStart(2, '0');
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return `${startDay} - ${end.toLocaleDateString('en-GB', options)}`;
  }
  
  // Different months or years
  return `${formatDateToReadable(start)} - ${formatDateToReadable(end)}`;
};