# External API Integration Guide

## Overview

This document outlines the integration plan for connecting the M&C Cakes frontend with the external API at `api.mandccakes.com`.

## Current Frontend Architecture

### Current API Structure
- **Base URL**: Currently using local API at `/api`
- **Framework**: Next.js 15 with App Router
- **HTTP Client**: Axios with custom configuration
- **State Management**: React Query (TanStack Query) + Zustand
- **Data Fetching**: Custom hooks with React Query integration

### Current Endpoints
- `GET /api/products` - Get all products with filtering
- `GET /api/products/{id}` - Get specific product
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/categories` - Get all categories
- `GET /api/categories/{slug}` - Get specific category
- `POST /api/categories` - Create new category
- `PUT /api/categories/{slug}` - Update category
- `DELETE /api/categories/{slug}` - Delete category

## External API Integration Plan

### Phase 1: API Client Setup

#### 1.1 Environment Configuration
```typescript
// .env.local
NEXT_PUBLIC_EXTERNAL_API_URL=https://api.mandccakes.com
EXTERNAL_API_KEY=your_api_key_here
EXTERNAL_API_SECRET=your_api_secret_here
```

#### 1.2 External API Client
Create a dedicated client for external API communication:

```typescript
// lib/api/external-client.ts
import axios from 'axios';

const externalApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_EXTERNAL_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default externalApi;
```

### Phase 2: Data Mapping & Transformation

#### 2.1 External API Types
```typescript
// lib/types/external-api.ts
export interface ExternalProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface ExternalCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}
```

#### 2.2 Data Transformation
```typescript
// lib/utils/data-transformer.ts
export function transformExternalProduct(externalProduct: ExternalProduct): Product {
  return {
    id: externalProduct.id,
    title: externalProduct.name,
    description: externalProduct.description,
    image: externalProduct.image_url,
    price: externalProduct.price,
    categoryId: externalProduct.category,
    isActive: true,
    createdAt: new Date(externalProduct.created_at),
    updatedAt: new Date(externalProduct.updated_at),
  };
}
```

### Phase 3: Hybrid Data Strategy

#### 3.1 Data Source Configuration
```typescript
// lib/config/data-sources.ts
export enum DataSource {
  LOCAL = 'local',
  EXTERNAL = 'external',
  HYBRID = 'hybrid'
}

export const DATA_SOURCE_CONFIG = {
  products: DataSource.HYBRID,
  categories: DataSource.HYBRID,
  orders: DataSource.LOCAL,
  users: DataSource.LOCAL,
};
```

#### 3.2 Smart Data Fetching
```typescript
// lib/hooks/useHybridData.ts
export function useHybridProducts(options: UseProductsOptions = {}) {
  const [dataSource, setDataSource] = useState<DataSource>(DataSource.LOCAL);
  
  // Try external API first, fallback to local
  const externalQuery = useQuery({
    queryKey: ['external-products', options],
    queryFn: () => fetchExternalProducts(options),
    enabled: dataSource === DataSource.EXTERNAL || dataSource === DataSource.HYBRID,
    retry: 1,
  });

  const localQuery = useQuery({
    queryKey: ['local-products', options],
    queryFn: () => fetchLocalProducts(options),
    enabled: dataSource === DataSource.LOCAL || (dataSource === DataSource.HYBRID && externalQuery.isError),
  });

  // Smart fallback logic
  useEffect(() => {
    if (externalQuery.isError && dataSource === DataSource.HYBRID) {
      setDataSource(DataSource.LOCAL);
    }
  }, [externalQuery.isError, dataSource]);

  return {
    products: externalQuery.data || localQuery.data || [],
    loading: externalQuery.isLoading || localQuery.isLoading,
    error: externalQuery.error || localQuery.error,
    dataSource,
    setDataSource,
  };
}
```

### Phase 4: API Endpoint Integration

#### 4.1 External API Routes
```typescript
// app/api/external/products/route.ts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    
    const response = await externalApi.get('/products', {
      params: { category, limit }
    });
    
    const transformedData = response.data.map(transformExternalProduct);
    
    return NextResponse.json({
      success: true,
      data: transformedData,
      source: 'external'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch from external API'
    }, { status: 500 });
  }
}
```

#### 4.2 Unified API Endpoints
```typescript
// app/api/unified/products/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') || 'hybrid';
  
  switch (source) {
    case 'external':
      return handleExternalRequest(request);
    case 'local':
      return handleLocalRequest(request);
    case 'hybrid':
    default:
      return handleHybridRequest(request);
  }
}
```

### Phase 5: Caching & Performance

#### 5.1 Redis/In-Memory Caching
```typescript
// lib/cache/external-cache.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedExternalData(key: string) {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function setCachedExternalData(key: string, data: any, ttl = 300) {
  await redis.setex(key, ttl, JSON.stringify(data));
}
```

#### 5.2 Background Sync
```typescript
// lib/sync/background-sync.ts
export async function syncExternalData() {
  try {
    const externalProducts = await fetchExternalProducts();
    const transformedProducts = externalProducts.map(transformExternalProduct);
    
    // Store in local database for offline access
    await prisma.product.createMany({
      data: transformedProducts,
      skipDuplicates: true,
    });
    
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}
```

### Phase 6: Error Handling & Resilience

#### 6.1 Circuit Breaker Pattern
```typescript
// lib/circuit-breaker.ts
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > 60000) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= 5) {
      this.state = 'OPEN';
    }
  }
}
```

### Phase 7: Monitoring & Analytics

#### 7.1 API Health Monitoring
```typescript
// lib/monitoring/api-health.ts
export async function checkExternalApiHealth() {
  try {
    const start = Date.now();
    const response = await externalApi.get('/health');
    const duration = Date.now() - start;
    
    return {
      status: 'healthy',
      responseTime: duration,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}
```

## Implementation Steps

1. **Setup Environment Variables**
   - Add external API credentials
   - Configure Redis for caching
   - Set up monitoring endpoints

2. **Create External API Client**
   - Implement authentication
   - Add request/response interceptors
   - Handle rate limiting

3. **Implement Data Transformation**
   - Map external data to internal types
   - Handle data validation
   - Create transformation utilities

4. **Build Hybrid Data Layer**
   - Create unified data fetching hooks
   - Implement fallback mechanisms
   - Add data source switching

5. **Add Caching Layer**
   - Implement Redis caching
   - Add cache invalidation
   - Create background sync jobs

6. **Implement Error Handling**
   - Add circuit breaker pattern
   - Create retry mechanisms
   - Implement graceful degradation

7. **Add Monitoring**
   - Create health check endpoints
   - Add performance metrics
   - Implement alerting

## Testing Strategy

### Unit Tests
- Test data transformation functions
- Test API client methods
- Test error handling scenarios

### Integration Tests
- Test external API connectivity
- Test fallback mechanisms
- Test caching behavior

### End-to-End Tests
- Test complete user workflows
- Test offline/online scenarios
- Test performance under load

## Security Considerations

1. **API Key Management**
   - Store keys in environment variables
   - Use different keys for different environments
   - Implement key rotation

2. **Rate Limiting**
   - Implement client-side rate limiting
   - Add exponential backoff
   - Monitor API usage

3. **Data Validation**
   - Validate all external data
   - Sanitize inputs
   - Implement data integrity checks

## Performance Optimization

1. **Caching Strategy**
   - Cache frequently accessed data
   - Implement cache warming
   - Use appropriate TTL values

2. **Request Optimization**
   - Implement request batching
   - Use pagination for large datasets
   - Add request deduplication

3. **Background Processing**
   - Sync data in background
   - Implement incremental updates
   - Use queue-based processing

## Deployment Considerations

1. **Environment Configuration**
   - Different configs for dev/staging/prod
   - Secure credential management
   - Feature flag implementation

2. **Monitoring & Alerting**
   - Set up health checks
   - Monitor API response times
   - Alert on failures

3. **Rollback Strategy**
   - Implement feature toggles
   - Create rollback procedures
   - Monitor system health
