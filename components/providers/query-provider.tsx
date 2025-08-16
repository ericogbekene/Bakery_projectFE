'use client'
import { getQueryClient } from '@/lib/tanstack-query'
import { QueryClientProvider } from '@tanstack/react-query'
import type * as React from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}