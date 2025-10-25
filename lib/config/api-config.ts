/**
 * API Configuration for M&C Cakes Frontend
 * Centralized configuration for external API integration
 */

export const API_CONFIG = {
  // External API base URL
  EXTERNAL_API_URL: process.env.NEXT_PUBLIC_EXTERNAL_API_URL || 'https://api.mandccakes.com/api',
  
  // Request timeout (in milliseconds)
  TIMEOUT: 10000,
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second
  },
  
  // Cache configuration
  CACHE: {
    PRODUCTS_TTL: 5 * 60 * 1000, // 5 minutes
    CATEGORIES_TTL: 10 * 60 * 1000, // 10 minutes
    CART_TTL: 1 * 60 * 1000, // 1 minute
  },
  
  // Data source configuration
  DATA_SOURCES: {
    PRODUCTS: process.env.NEXT_PUBLIC_PRODUCTS_DATA_SOURCE || 'external',
    CATEGORIES: process.env.NEXT_PUBLIC_CATEGORIES_DATA_SOURCE || 'external',
    ORDERS: process.env.NEXT_PUBLIC_ORDERS_DATA_SOURCE || 'local',
    USERS: process.env.NEXT_PUBLIC_USERS_DATA_SOURCE || 'local',
    INVENTORY: process.env.NEXT_PUBLIC_INVENTORY_DATA_SOURCE || 'external',
  },
  
  // Feature flags
  FEATURES: {
    ENABLE_CART_PERSISTENCE: true,
    ENABLE_OFFLINE_MODE: false,
    ENABLE_ANALYTICS: true,
  },
};

/**
 * Check if external API is configured
 */
export function isExternalApiConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
}

/**
 * Get the appropriate API base URL
 */
export function getApiBaseUrl(): string {
  return API_CONFIG.EXTERNAL_API_URL;
}

/**
 * Check if a data source is enabled
 */
export function isDataSourceEnabled(source: 'external' | 'local' | 'hybrid', entity: keyof typeof API_CONFIG.DATA_SOURCES): boolean {
  const config = API_CONFIG.DATA_SOURCES[entity];
  return config === source || config === 'hybrid';
}
