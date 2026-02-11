/**
 * Data source configuration for the application
 * Defines which data sources to use for different entities
 */

export enum DataSource {
  LOCAL = 'local',
  EXTERNAL = 'external',
  HYBRID = 'hybrid'
}

export interface DataSourceConfig {
  products: DataSource;
  categories: DataSource;
  orders: DataSource;
  users: DataSource;
  inventory: DataSource;
}

/**
 * Default data source configuration
 */
export const DEFAULT_DATA_SOURCE_CONFIG: DataSourceConfig = {
  products: DataSource.HYBRID,
  categories: DataSource.HYBRID,
  orders: DataSource.LOCAL,
  users: DataSource.LOCAL,
  inventory: DataSource.EXTERNAL,
};

/**
 * Get data source configuration from environment variables
 */
export function getDataSourceConfig(): DataSourceConfig {
  return {
    products: (process.env.NEXT_PUBLIC_PRODUCTS_DATA_SOURCE as DataSource) || DEFAULT_DATA_SOURCE_CONFIG.products,
    categories: (process.env.NEXT_PUBLIC_CATEGORIES_DATA_SOURCE as DataSource) || DEFAULT_DATA_SOURCE_CONFIG.categories,
    orders: (process.env.NEXT_PUBLIC_ORDERS_DATA_SOURCE as DataSource) || DEFAULT_DATA_SOURCE_CONFIG.orders,
    users: (process.env.NEXT_PUBLIC_USERS_DATA_SOURCE as DataSource) || DEFAULT_DATA_SOURCE_CONFIG.users,
    inventory: (process.env.NEXT_PUBLIC_INVENTORY_DATA_SOURCE as DataSource) || DEFAULT_DATA_SOURCE_CONFIG.inventory,
  };
}

/**
 * Check if a data source is enabled
 */
export function isDataSourceEnabled(source: DataSource, entity: keyof DataSourceConfig): boolean {
  const config = getDataSourceConfig();
  return config[entity] === source || config[entity] === DataSource.HYBRID;
}

/**
 * Get the primary data source for an entity
 */
export function getPrimaryDataSource(entity: keyof DataSourceConfig): DataSource {
  const config = getDataSourceConfig();
  const source = config[entity];
  
  if (source === DataSource.HYBRID) {
    // For hybrid, prefer external first, then local
    return DataSource.EXTERNAL;
  }
  
  return source;
}

/**
 * Get the fallback data source for an entity
 */
export function getFallbackDataSource(entity: keyof DataSourceConfig): DataSource {
  const config = getDataSourceConfig();
  const source = config[entity];
  
  if (source === DataSource.HYBRID) {
    // For hybrid, fallback to local
    return DataSource.LOCAL;
  }
  
  return source;
}
