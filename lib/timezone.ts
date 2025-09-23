import { fromZonedTime, toZonedTime, formatInTimeZone } from 'date-fns-tz'

// Mexico City timezone
export const MEXICO_CITY_TIMEZONE = 'America/Mexico_City'

/**
 * Get current date and time in Mexico City timezone
 */
export function getMexicoCityTime(): Date {
  return toZonedTime(new Date(), MEXICO_CITY_TIMEZONE)
}

/**
 * Convert a date from Mexico City timezone to UTC
 */
export function mexicoCityToUtc(date: Date): Date {
  return fromZonedTime(date, MEXICO_CITY_TIMEZONE)
}

/**
 * Convert a date from UTC to Mexico City timezone
 */
export function utcToMexicoCity(date: Date): Date {
  return toZonedTime(date, MEXICO_CITY_TIMEZONE)
}

/**
 * Format a date in Mexico City timezone
 */
export function formatMexicoCityTime(date: Date, formatStr: string = 'yyyy-MM-dd HH:mm:ss zzz'): string {
  return formatInTimeZone(date, MEXICO_CITY_TIMEZONE, formatStr)
}

/**
 * Check if a given date/time in Mexico City timezone is in the past
 * Used for scheduled publishing logic
 */
export function isMexicoCityTimePast(date: Date): boolean {
  const mexicoCityNow = getMexicoCityTime()
  const targetMexicoTime = toZonedTime(date, MEXICO_CITY_TIMEZONE)
  return targetMexicoTime <= mexicoCityNow
}

/**
 * Get current Mexico City time as ISO string for database queries
 */
export function getMexicoCityTimeForDB(): string {
  return getMexicoCityTime().toISOString()
}

/**
 * Convert a date string to Mexico City timezone and return as Date object
 * Useful for handling dates from forms or API inputs
 */
export function parseMexicoCityDate(dateString: string): Date {
  const localDate = new Date(dateString)
  return mexicoCityToUtc(localDate)
}

/**
 * Get a SQL timestamp that represents "NOW" in Mexico City timezone
 * This returns a properly formatted timestamp for PostgreSQL
 */
export function getMexicoCityNowForSQL(): string {
  const mexicoCityTime = getMexicoCityTime()
  return mexicoCityTime.toISOString()
}