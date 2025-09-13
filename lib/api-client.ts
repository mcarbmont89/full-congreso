import type { LiveStream, Program, NewsItem } from './api'

// Re-export types for use in other components
export type { NewsItem, Program }

// Client-side API functions that call server-side routes
export async function fetchPrograms(): Promise<Program[]> {
  const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/programs`)
  if (!response.ok) {
    throw new Error('Failed to fetch programs')
  }
  return response.json()
}

export async function createProgram(data: Omit<Program, "id" | "createdAt">): Promise<Program> {
  const response = await fetch('/api/programs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create program')
  }

  return response.json()
}

export async function updateProgram(
  id: string,
  data: Partial<Omit<Program, "id" | "createdAt">>
): Promise<Program> {
  const response = await fetch(`/api/programs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update program')
  }

  return response.json()
}

export async function deleteProgram(id: string): Promise<void> {
  const response = await fetch(`/api/programs/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete program')
  }
}

export async function reorderProgram(programId: string, direction: 'up' | 'down'): Promise<void> {
  const response = await fetch('/api/programs/reorder', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ programId, direction }),
  })

  if (!response.ok) {
    throw new Error('Failed to reorder program')
  }
}

// News API functions
export async function getNews(): Promise<NewsItem[]> {
  const response = await fetch('/api/news')
  if (!response.ok) {
    throw new Error('Failed to fetch news')
  }
  return response.json()
}

export async function createNewsItem(data: Omit<NewsItem, "id" | "createdAt">): Promise<NewsItem> {
  const response = await fetch('/api/news', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create news item')
  }

  return response.json()
}

export async function updateNewsItem(
  id: string,
  data: Partial<Omit<NewsItem, "id" | "createdAt">>
): Promise<NewsItem> {
  const response = await fetch(`/api/news/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update news item')
  }

  return response.json()
}

export async function deleteNewsItem(id: string): Promise<boolean> {
  const response = await fetch(`/api/news/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to delete news item: ${error}`)
  }

  return true
}

// Add more API functions here as needed