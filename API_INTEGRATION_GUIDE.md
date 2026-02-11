# API Integration Guide

This guide explains how the frontend properly integrates with the external M&C Cakes API at `api.mandccakes.com`.

## Overview

The application has been refactored to use the external API as the primary data source, with proper error handling, authentication, and fallback mechanisms.

## Architecture

### 1. HTTP Client (`lib/api/http-client.ts`)
- Centralized HTTP client with axios
- Automatic token management
- Request/response interceptors
- Error handling and retry logic
- Token refresh on 401 errors

### 2. Service Layer
- **Auth Service** (`lib/services/auth-service.ts`): User authentication
- **Product Service** (`lib/services/product-service.ts`): Product management
- **Cart Service** (`lib/services/cart-service.ts`): Shopping cart operations
- **Category Service** (`lib/services/category-service.ts`): Category management

### 3. React Hooks
- **useAuth**: Authentication state management
- **useProducts**: Product data fetching with caching
- **useCart**: Shopping cart state management
- **useCategories**: Category data fetching

## Configuration

### Environment Variables
Create a `.env.local` file with:

```env
# External API Configuration
NEXT_PUBLIC_EXTERNAL_API_URL=https://api.mandccakes.com/api

# Data Source Configuration (optional)
NEXT_PUBLIC_PRODUCTS_DATA_SOURCE=external
NEXT_PUBLIC_CATEGORIES_DATA_SOURCE=external
```

### API Endpoints
The application uses the following external API endpoints:

- **Authentication**: `/accounts/login/`, `/accounts/register/`, `/accounts/token/refresh/`
- **Products**: `/products/products/`, `/products/products/{slug}/`
- **Categories**: `/products/categories/`, `/products/categories/{slug}/`
- **Cart**: `/cart/cart/`, `/cart/cart/add/`, `/cart/cart/remove/`
- **Orders**: `/orders/create/`, `/orders/{id}/`

## Usage Examples

### 1. Fetching Products
```tsx
import { useProducts } from '@/lib/hooks/useProducts';

function ProductList() {
  const { products, loading, error } = useProducts({
    category: 'signature-cakes',
    limit: 10
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Authentication
```tsx
import { useAuth } from '@/lib/hooks/useAuth';

function LoginForm() {
  const { login, isAuthenticated } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const result = await login({ email, password });
    if (result.success) {
      // Redirect to dashboard
    } else {
      // Show error message
      console.error(result.error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      handleLogin(formData.get('email'), formData.get('password'));
    }}>
      {/* Login form fields */}
    </form>
  );
}
```

### 3. Shopping Cart
```tsx
import { useCart } from '@/lib/hooks/useCart';

function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = async () => {
    const result = await addToCart(product.id, 1);
    if (result.success) {
      // Show success message
    } else {
      // Show error message
      console.error(result.error);
    }
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button 
        onClick={handleAddToCart}
        disabled={!product.is_in_stock}
      >
        {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

## Error Handling

The application includes comprehensive error handling:

### 1. Network Errors
- Automatic retry for failed requests
- Circuit breaker pattern for external API
- Fallback to local data when external API is unavailable

### 2. Authentication Errors
- Automatic token refresh on 401 errors
- Redirect to login page when refresh fails
- Clear tokens on authentication failure

### 3. API Errors
- Structured error responses
- User-friendly error messages
- Error boundaries for React components

## Testing

### 1. API Test Page
Visit `/api-test` to run comprehensive API tests:
- Health check
- Products API
- Categories API
- Cart API (if authenticated)
- Hook functionality

### 2. Manual Testing
1. Start the development server: `npm run dev`
2. Navigate to `/api-test`
3. Click "Run API Tests" to verify connectivity
4. Check the test results and sample data

## Data Flow

1. **Component** calls a hook (e.g., `useProducts`)
2. **Hook** calls the appropriate service (e.g., `productService`)
3. **Service** uses the HTTP client to make API requests
4. **HTTP Client** handles authentication, error handling, and retries
5. **Response** is cached and returned to the component

## Caching Strategy

- **Products**: 5 minutes TTL
- **Categories**: 10 minutes TTL
- **Cart**: 1 minute TTL
- **User Data**: 15 minutes TTL

## Security

- Tokens stored in localStorage
- Automatic token refresh
- Secure API communication over HTTPS
- Input validation and sanitization

## Performance

- React Query for intelligent caching
- Request deduplication
- Background refetching
- Optimistic updates for cart operations

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the external API allows your domain
2. **Authentication Failures**: Check token storage and refresh logic
3. **Network Timeouts**: Verify API endpoint availability
4. **Data Format Issues**: Ensure API response matches expected format

### Debug Mode

Enable debug logging by setting:
```env
NEXT_PUBLIC_DEBUG_API=true
```

This will log all API requests and responses to the console.

## Next Steps

1. **Test the API integration** using the `/api-test` page
2. **Update existing components** to use the new hooks
3. **Implement error boundaries** for better error handling
4. **Add loading states** for better UX
5. **Set up monitoring** for API health and performance
