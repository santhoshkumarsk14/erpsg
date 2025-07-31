/**
 * Utility function to conditionally join CSS class names together
 * 
 * @param classes - Array of class names or objects where keys are class names and values are booleans
 * @returns A string of joined class names
 */
export function classNames(...classes: (string | boolean | undefined | null | Record<string, boolean>)[]): string {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (cls && typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return cls;
    })
    .join(' ');
}