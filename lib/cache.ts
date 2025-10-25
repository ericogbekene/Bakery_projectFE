import { NextRequest } from 'next/server'

// Simple in-memory cache (for development)
// In production, you'd want to use Redis or similar
const cache = new Map<string, { data: unknown; timestamp: number }>()

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export function getCacheKey(request: NextRequest): string {
  const url = new URL(request.url)
  return `${request.method}:${url.pathname}${url.search}`
}

export function getCachedResponse(request: NextRequest): unknown | null {
  const key = getCacheKey(request)
  const cached = cache.get(key)
  
  if (!cached) return null
  
  const now = Date.now()
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key)
    return null
  }
  
  return cached.data
}

export function setCachedResponse(request: NextRequest, data: unknown): void {
  const key = getCacheKey(request)
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

export function clearCache(): void {
  cache.clear()
}

export function invalidateCache(pattern: string): void {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  }
} 