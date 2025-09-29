import { fromZonedTime, toZonedTime, formatInTimeZone } from 'date-fns-tz'

// Default timezone (fallback)
export const DEFAULT_TIMEZONE = 'America/Mexico_City'

// Cache for timezone configuration
let cachedTimezone: string | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Get the configured timezone from the database with caching
 */
async function getConfiguredTimezone(): Promise<string> {
  const now = Date.now()
  
  // Return cached value if still valid
  if (cachedTimezone && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedTimezone
  }
  
  try {
    // Only fetch in server environment
    if (typeof window === 'undefined') {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/timezone-config`, {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const config = await response.json()
        const timezone = config.timezone || DEFAULT_TIMEZONE
        cachedTimezone = timezone
        cacheTimestamp = now
        return timezone
      }
    }
  } catch (error) {
    console.warn('Failed to fetch timezone config, using default:', error)
  }
  
  // Fallback to default timezone
  cachedTimezone = DEFAULT_TIMEZONE
  cacheTimestamp = now
  return DEFAULT_TIMEZONE
}

/**
 * Get the current timezone (either configured or default)
 */
export async function getCurrentTimezone(): Promise<string> {
  return await getConfiguredTimezone()
}

/**
 * Clear the timezone cache (useful after configuration changes)
 */
export function clearTimezoneCache(): void {
  cachedTimezone = null
  cacheTimestamp = 0
}

/**
 * Get current date and time in configured timezone
 */
export async function getCurrentTime(): Promise<Date> {
  const timezone = await getCurrentTimezone()
  return toZonedTime(new Date(), timezone)
}

/**
 * Get current date and time in Mexico City timezone (legacy function)
 */
export function getMexicoCityTime(): Date {
  return toZonedTime(new Date(), DEFAULT_TIMEZONE)
}

/**
 * Convert a date from configured timezone to UTC
 */
export async function configuredTimezoneToUtc(date: Date): Promise<Date> {
  const timezone = await getCurrentTimezone()
  return fromZonedTime(date, timezone)
}

/**
 * Convert a date from UTC to configured timezone
 */
export async function utcToConfiguredTimezone(date: Date): Promise<Date> {
  const timezone = await getCurrentTimezone()
  return toZonedTime(date, timezone)
}

/**
 * Convert a date from Mexico City timezone to UTC (legacy function)
 */
export function mexicoCityToUtc(date: Date): Date {
  return fromZonedTime(date, DEFAULT_TIMEZONE)
}

/**
 * Convert a date from UTC to Mexico City timezone (legacy function)
 */
export function utcToMexicoCity(date: Date): Date {
  return toZonedTime(date, DEFAULT_TIMEZONE)
}

/**
 * Format a date in configured timezone
 */
export async function formatConfiguredTime(date: Date, formatStr: string = 'yyyy-MM-dd HH:mm:ss zzz'): Promise<string> {
  const timezone = await getCurrentTimezone()
  return formatInTimeZone(date, timezone, formatStr)
}

/**
 * Format a date in Mexico City timezone (legacy function)
 */
export function formatMexicoCityTime(date: Date, formatStr: string = 'yyyy-MM-dd HH:mm:ss zzz'): string {
  return formatInTimeZone(date, DEFAULT_TIMEZONE, formatStr)
}

/**
 * Check if a given date/time in Mexico City timezone is in the past
 * Used for scheduled publishing logic
 */
export function isMexicoCityTimePast(date: Date): boolean {
  const mexicoCityNow = getMexicoCityTime()
  const targetMexicoTime = toZonedTime(date, DEFAULT_TIMEZONE)
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
 * Get a SQL timestamp that represents "NOW" in configured timezone
 * This returns a properly formatted timestamp for PostgreSQL
 */
export async function getConfiguredNowForSQL(): Promise<string> {
  const configuredTime = await getCurrentTime()
  return configuredTime.toISOString()
}

/**
 * Get a SQL timestamp that represents "NOW" in Mexico City timezone
 * This returns a properly formatted timestamp for PostgreSQL
 */
export function getMexicoCityNowForSQL(): string {
  const mexicoCityTime = getMexicoCityTime()
  return mexicoCityTime.toISOString()
}

/**
 * Check if a given date/time in configured timezone is in the past
 * Used for scheduled publishing logic
 */
export async function isConfiguredTimePast(date: Date): Promise<boolean> {
  const configuredNow = await getCurrentTime()
  const timezone = await getCurrentTimezone()
  const targetConfiguredTime = toZonedTime(date, timezone)
  return targetConfiguredTime <= configuredNow
}

/**
 * Parse a datetime-local input string as admin timezone time (NO CONVERSION)
 * This treats the input as if it was entered in the configured admin timezone
 * @param datetimeLocalString - String from datetime-local input (YYYY-MM-DDTHH:mm)
 * @returns Date object representing that exact time in admin timezone
 */
export async function parseAdminTimezoneDateTime(datetimeLocalString: string): Promise<Date> {
  if (!datetimeLocalString) {
    return new Date()
  }
  
  // If input already has timezone info (Z or offset), don't convert
  if (datetimeLocalString.includes('Z') || /[+-]\d{2}:\d{2}$/.test(datetimeLocalString)) {
    return new Date(datetimeLocalString)
  }
  
  const timezone = await getCurrentTimezone()
  
  // Parse the naive datetime string directly as admin timezone
  // Do NOT create Date object first as that causes conversion issues
  return fromZonedTime(datetimeLocalString, timezone)
}

/**
 * Format a Date object for datetime-local input in admin timezone (NO CONVERSION)
 * This displays the stored time as it should appear in admin timezone
 * @param date - Date object from database
 * @returns String formatted for datetime-local input (YYYY-MM-DDTHH:mm)
 */
export async function formatForAdminTimezoneInput(date: Date): Promise<string> {
  if (!date) {
    return ''
  }
  
  const timezone = await getCurrentTimezone()
  
  // Format directly in admin timezone - do NOT use toISOString which converts to UTC
  return formatInTimeZone(date, timezone, "yyyy-MM-dd'T'HH:mm")
}

/**
 * LEGACY: Parse datetime-local as Mexico City time (NO CONVERSION)
 * Use parseAdminTimezoneDateTime for new code
 */
export function parseMexicoCityDateTime(datetimeLocalString: string): Date {
  if (!datetimeLocalString) {
    return new Date()
  }
  
  // If input already has timezone info, don't convert
  if (datetimeLocalString.includes('Z') || /[+-]\d{2}:\d{2}$/.test(datetimeLocalString)) {
    return new Date(datetimeLocalString)
  }
  
  // Parse the naive datetime string directly as Mexico City time
  return fromZonedTime(datetimeLocalString, DEFAULT_TIMEZONE)
}

/**
 * LEGACY: Format Date for datetime-local input in Mexico City time (NO CONVERSION)
 * Use formatForAdminTimezoneInput for new code
 */
export function formatForMexicoCityInput(date: Date): string {
  if (!date) {
    return ''
  }
  
  // Format directly in Mexico City timezone - do NOT use toISOString
  return formatInTimeZone(date, DEFAULT_TIMEZONE, "yyyy-MM-dd'T'HH:mm")
}