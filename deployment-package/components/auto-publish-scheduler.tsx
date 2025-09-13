"use client"

import { useEffect } from 'react'

export default function AutoPublishScheduler() {
  useEffect(() => {
    const autoPublish = async () => {
      try {
        // Auto-publish scheduled news
        try {
          const newsResponse = await fetch('/api/news/publish-scheduled', {
            method: 'POST',
          })

          if (newsResponse.ok) {
            const newsData = await newsResponse.json()
            console.log('Auto-publish news successful:', newsData)
          } else {
            console.warn(`Auto-publish news failed: ${newsResponse.status} ${newsResponse.statusText}`)
          }
        } catch (newsError) {
          console.warn('Auto-publish news error:', newsError instanceof Error ? newsError.message : 'Unknown error')
        }

        // Auto-publish scheduled radio episodes
        try {
          const radioResponse = await fetch('/api/radio/episodes/publish-scheduled', {
            method: 'POST',
          })

          if (radioResponse.ok) {
            const radioData = await radioResponse.json()
            console.log('Auto-publish radio episodes successful:', radioData)
          } else {
            console.warn(`Auto-publish radio episodes failed: ${radioResponse.status} ${radioResponse.statusText}`)
          }
        } catch (radioError) {
          console.warn('Auto-publish radio episodes error:', radioError instanceof Error ? radioError.message : 'Unknown error')
        }
      } catch (error) {
        console.warn('Error in auto-publish scheduler:', error instanceof Error ? error.message : 'Unknown error')
      }
    }

    // Check immediately on mount
    autoPublish()

    // Set up interval to check every 5 minutes
    const interval = setInterval(autoPublish, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return null // This component doesn't render anything
}