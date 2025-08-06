/**
 * Timezone detection utilities
 * Automatically detects user's timezone from browser
 */

export function getUserTimezone(): string {
  // Use Intl API to get timezone
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getUserLocale(): string {
  // Get user's preferred language
  return navigator.language || 'es-MX';
}

export function getTimezoneOffset(): number {
  // Get timezone offset in minutes
  return new Date().getTimezoneOffset();
}

export function formatTimezone(timezone: string): string {
  // Format timezone for display
  const offset = new Date().toLocaleTimeString('en-US', {
    timeZone: timezone,
    timeZoneName: 'short'
  }).split(' ').pop();
  
  return `${timezone.replace('_', ' ')} (${offset})`;
}

// Example usage:
// const userTimezone = getUserTimezone(); // "America/Mexico_City"
// const userLocale = getUserLocale(); // "es-MX"
// const formattedTz = formatTimezone(userTimezone); // "America/Mexico City (CST)"