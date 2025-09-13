
import { createContext, useContext, useRef, ReactNode } from 'react'

interface RateLimiterContextType {
  canMakeRequest: (endpoint: string) => boolean
  recordRequest: (endpoint: string) => void
}

const RateLimiterContext = createContext<RateLimiterContextType | null>(null)

export function useRateLimit() {
  const context = useContext(RateLimiterContext)
  if (!context) {
    throw new Error('useRateLimit must be used within RateLimiterProvider')
  }
  return context
}

interface RateLimiterProviderProps {
  children: ReactNode
}

export function RateLimiterProvider({ children }: RateLimiterProviderProps) {
  const requestTimes = useRef<Record<string, number[]>>({})

  const canMakeRequest = (endpoint: string): boolean => {
    const now = Date.now()
    const times = requestTimes.current[endpoint] || []
    
    // Remove requests older than 15 minutes
    const fifteenMinutesAgo = now - 15 * 60 * 1000
    const recentRequests = times.filter(time => time > fifteenMinutesAgo)
    
    // Update the array
    requestTimes.current[endpoint] = recentRequests
    
    // Check if we can make another request (limit to 50 per 15 minutes for safety)
    return recentRequests.length < 50
  }

  const recordRequest = (endpoint: string): void => {
    const now = Date.now()
    if (!requestTimes.current[endpoint]) {
      requestTimes.current[endpoint] = []
    }
    requestTimes.current[endpoint].push(now)
  }

  return (
    <RateLimiterContext.Provider value={{ canMakeRequest, recordRequest }}>
      {children}
    </RateLimiterContext.Provider>
  )
}
