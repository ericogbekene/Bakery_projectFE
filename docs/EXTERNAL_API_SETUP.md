# External API Integration Setup Guide

## Overview

This guide will help you set up the integration with the external M&C Cakes API (`api.mandccakes.com`) into your frontend application.

## Prerequisites

1. Access to the external M&C Cakes API
2. API credentials (API key and secret)
3. Node.js and npm installed
4. Your Next.js project set up

## Step 1: Environment Configuration

### 1.1 Create Environment File

Create a `.env.local` file in your project root:

```bash
cp .env.example .env.local
```

### 1.2 Configure External API Settings

Update your `.env.local` file with the following variables:

```env
# External API Configuration
NEXT_PUBLIC_EXTERNAL_API_URL="https://api.mandccakes.com"
EXTERNAL_API_KEY="your_external_api_key_here"
EXTERNAL_API_SECRET="your_external_api_secret_here"

# Data Source Configuration
NEXT_PUBLIC_PRODUCTS_DATA_SOURCE="hybrid"
NEXT_PUBLIC_CATEGORIES_DATA_SOURCE="hybrid"
NEXT_PUBLIC_ORDERS_DATA_SOURCE="local"
NEXT_PUBLIC_USERS_DATA_SOURCE="local"
NEXT_PUBLIC_INVENTORY_DATA_SOURCE="external"
```

## Step 2: Install Dependencies

The integration uses existing dependencies in your project:

- `axios` - HTTP client for API calls
- `@tanstack/react-query` - Data fetching and caching
- `zustand` - State management

No additional dependencies are required.

## Step 3: API Authentication

### 3.1 Get API Credentials

Contact the M&C Cakes API team to obtain:
- API Key
- API Secret
- Base URL (if different from `https://api.mandccakes.com`)

### 3.2 Test Authentication

Test your API credentials by running:

```bash
curl -X POST https://api.mandccakes.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "your_api_key",
    "api_secret": "your_api_secret"
  }'
```

## Step 4: Data Source Configuration

### 4.1 Configure Data Sources

You can configure which data sources to use for different entities:

```typescript
// Data source options:
// - "local": Use only local database
// - "external": Use only external API
// - "hybrid": Use external API with local fallback

NEXT_PUBLIC_PRODUCTS_DATA_SOURCE="hybrid"      // Products from external API with local fallback
NEXT_PUBLIC_CATEGORIES_DATA_SOURCE="hybrid"     // Categories from external API with local fallback
NEXT_PUBLIC_ORDERS_DATA_SOURCE="local"          // Orders from local database only
NEXT_PUBLIC_USERS_DATA_SOURCE="local"           // Users from local database only
```

### 4.2 Hybrid Mode Benefits

- **Primary**: External API provides real-time data
- **Fallback**: Local database ensures availability
- **Automatic**: Seamless switching between sources
- **Performance**: Cached data for faster loading

## Step 5: Using the Integration

### 5.1 Basic Usage

```tsx
import { useHybridProducts, useHybridCategories } from '@/lib/hooks/useHybridData';

function ProductList() {
  const {
    data: products,
    loading,
    error,
    dataSource,
    refetch,
    switchDataSource,
  } = useHybridProducts({
    category: 'signature-cakes',
    limit: 10,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Data source: {dataSource}</p>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 5.2 Data Source Switching

```tsx
function DataSourceControls() {
  const { switchDataSource, dataSource } = useHybridProducts();

  return (
    <div>
      <button onClick={() => switchDataSource('external')}>
        Use External API
      </button>
      <button onClick={() => switchDataSource('local')}>
        Use Local Database
      </button>
      <p>Current source: {dataSource}</p>
    </div>
  );
}
```

### 5.3 Error Handling

```tsx
function ProductListWithErrorHandling() {
  const { data, loading, error, refetch } = useHybridProducts();

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  // ... rest of component
}
```

## Step 6: API Endpoints

### 6.1 External API Endpoints

The integration provides the following endpoints:

- `GET /api/external/products` - Fetch products from external API
- `GET /api/external/categories` - Fetch categories from external API
- `GET /api/external/health` - Check external API health

### 6.2 Health Monitoring

Check the health of your external API integration:

```bash
curl http://localhost:3000/api/external/health
```

Response:
```json
{
  "success": true,
  "data": {
    "external_api": {
      "status": "healthy",
      "response_time": 150,
      "timestamp": "2024-01-01T12:00:00Z"
    },
    "circuit_breaker": {
      "state": "CLOSED",
      "is_healthy": true,
      "failure_count": 0
    },
    "overall_status": "healthy"
  }
}
```

## Step 7: Circuit Breaker

### 7.1 Automatic Protection

The integration includes a circuit breaker that:
- Prevents cascading failures
- Automatically switches to local data when external API fails
- Provides graceful degradation
- Monitors API health

### 7.2 Circuit Breaker States

- **CLOSED**: Normal operation, external API is healthy
- **OPEN**: External API is failing, using local data
- **HALF_OPEN**: Testing if external API has recovered

## Step 8: Caching and Performance

### 8.1 Automatic Caching

The integration provides:
- **React Query caching**: Automatic data caching
- **Stale-while-revalidate**: Serve cached data while fetching fresh data
- **Background updates**: Update data in the background

### 8.2 Cache Configuration

```typescript
// Products cache for 5 minutes
staleTime: 5 * 60 * 1000,
gcTime: 10 * 60 * 1000,

// Categories cache for 10 minutes
staleTime: 10 * 60 * 1000,
gcTime: 30 * 60 * 1000,
```

## Step 9: Monitoring and Debugging

### 9.1 Health Checks

Monitor your integration health:

```bash
# Check external API health
curl http://localhost:3000/api/external/health

# Check circuit breaker status
curl http://localhost:3000/api/external/health | jq '.data.circuit_breaker'
```

### 9.2 Debug Mode

Enable debug logging by setting:

```env
NEXT_PUBLIC_DEBUG_API="true"
```

### 9.3 Console Logging

The integration provides detailed console logging:
- API request/response logs
- Circuit breaker state changes
- Data source switches
- Error details

## Step 10: Production Deployment

### 10.1 Environment Variables

Ensure all environment variables are set in production:

```env
NEXT_PUBLIC_EXTERNAL_API_URL="https://api.mandccakes.com"
EXTERNAL_API_KEY="production_api_key"
EXTERNAL_API_SECRET="production_api_secret"
```

### 10.2 Monitoring

Set up monitoring for:
- External API response times
- Circuit breaker state changes
- Data source switches
- Error rates

### 10.3 Alerts

Configure alerts for:
- External API failures
- Circuit breaker opening
- High error rates
- Performance degradation

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify API credentials
   - Check API key permissions
   - Ensure API secret is correct

2. **Network Errors**
   - Check external API URL
   - Verify network connectivity
   - Check firewall settings

3. **Data Transformation Errors**
   - Verify external API response format
   - Check data validation
   - Review transformation functions

4. **Circuit Breaker Issues**
   - Check failure thresholds
   - Verify recovery timeouts
   - Monitor failure counts

### Debug Steps

1. Check environment variables
2. Test API connectivity
3. Verify authentication
4. Check console logs
5. Monitor health endpoints

## Support

For issues with the external API integration:

1. Check the health endpoint: `/api/external/health`
2. Review console logs for errors
3. Verify environment configuration
4. Test API credentials manually
5. Contact the development team

## Next Steps

1. **Test the integration** with sample data
2. **Configure monitoring** for production
3. **Set up alerts** for failures
4. **Optimize performance** based on usage
5. **Scale the integration** as needed
