import { NextRequest, NextResponse } from 'next/server';
import externalApiClient from '@/lib/api/external-client';
import { transformExternalProduct } from '@/lib/utils/data-transformer';
import { externalApiCircuitBreaker } from '@/lib/circuit-breaker';
import { ApiResponse, ProductWithCategory } from '@/lib/types/product';

/**
 * GET /api/external/products
 * 
 * Fetches products from the external M&C Cakes API
 * Handles authentication, error handling, and data transformation
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const search = searchParams.get('search');

    // Check if external API is healthy
    if (!externalApiCircuitBreaker.isHealthy()) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'External API is currently unavailable'
      };
      return NextResponse.json(response, { status: 503 });
    }

    // Fetch products from external API with circuit breaker protection
    const externalProducts = await externalApiCircuitBreaker.execute(async () => {
      // Use the correct external API endpoint for products
      const response = await externalApiClient.get('/api/products/products/', {
        params: {
          category,
          limit: limit ? parseInt(limit) : undefined,
          offset: offset ? parseInt(offset) : undefined,
          search,
        },
      });

      // The external API returns data in a different format
      if (!response.data.results) {
        throw new Error('No products found in external API response');
      }

      return response.data.results;
    });

    // Transform external products to internal format

    //should be externalProducts here 
    const transformedProducts = externalProducts.map(products => 
      transformExternalProduct(products ) as ProductWithCategory
    );

    const response: ApiResponse<ProductWithCategory[]> = {
      success: true,
      data: transformedProducts,
      message: `Found ${transformedProducts.length} products from external API`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching external products:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch products from external API'
    };

    return NextResponse.json(response, { status: 500 });
  }
}
