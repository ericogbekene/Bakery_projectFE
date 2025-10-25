import { NextRequest, NextResponse } from 'next/server';
import externalApiClient from '@/lib/api/external-client';
import { transformExternalCategory } from '@/lib/utils/data-transformer';
import { externalApiCircuitBreaker } from '@/lib/circuit-breaker';
import { ApiResponse, Category } from '@/lib/types/product';

/**
 * GET /api/external/categories
 * 
 * Fetches categories from the external M&C Cakes API
 * Handles authentication, error handling, and data transformation
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
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

    // Fetch categories from external API with circuit breaker protection
    const externalCategories = await externalApiCircuitBreaker.execute(async () => {
      const response = await externalApiClient.get('/api/products/categories/', {
        params: {
          limit: limit ? parseInt(limit) : undefined,
          offset: offset ? parseInt(offset) : undefined,
          search,
        },
      });

      // The external API returns data in a different format
      if (!response.data.results) {
        throw new Error('No categories found in external API response');
      }

      return response.data.results;
    });

    // Transform external categories to internal format
    const transformedCategories = externalCategories.map(category => 
      transformExternalCategory(category)
    );

    const response: ApiResponse<Category[]> = {
      success: true,
      data: transformedCategories,
      message: `Found ${transformedCategories.length} categories from external API`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching external categories:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch categories from external API'
    };

    return NextResponse.json(response, { status: 500 });
  }
}
