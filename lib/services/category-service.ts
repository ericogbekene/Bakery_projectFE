import { httpClient } from '@/lib/api/http-client';
import ENDPOINTS from '@/constants/endpoints';
import { ProductListResponse } from './product-service';

export interface CategoryFilters {
  search?: string;
  hasProducts?: boolean;
  ordering?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  product_count?: number;
  created_at: string;
}

export interface CategoryListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Category[];
}

/**
 * Category service for M&C Cakes API
 */
class CategoryService {
  /**
   * Get all categories
   */
  async getCategories(filters: CategoryFilters = {}): Promise<CategoryListResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.hasProducts !== undefined) {
      queryParams.append('has_products', filters.hasProducts.toString());
    }
    if (filters.ordering) queryParams.append('ordering', filters.ordering);
    if (filters.limit) queryParams.append('limit', filters.limit.toString()); // ✅ Add this
    if (filters.offset) queryParams.append('offset', filters.offset.toString()); // ✅ Add this
  
    const endpoint = `${ENDPOINTS.EXTERNAL.CATEGORIES.LIST}?${queryParams.toString()}`;
    return await httpClient.get<CategoryListResponse>(endpoint);
  }

  /**
   * Get single category by slug
   */
  async getCategory(slug: string): Promise<Category> {
    return await httpClient.get<Category>(`${ENDPOINTS.EXTERNAL.CATEGORIES.DETAIL}${slug}/`);
  }

  /**
   * Get products in category
   */
  async getCategoryProducts(
    slug: string, 
    filters: {
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
    } = {}
  ): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.minPrice) queryParams.append('min_price', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('max_price', filters.maxPrice.toString());
    if (filters.inStock !== undefined) queryParams.append('in_stock', filters.inStock.toString());

    const endpoint = `${ENDPOINTS.EXTERNAL.CATEGORIES.DETAIL}${slug}/products/?${queryParams.toString()}`;
    return await httpClient.get<ProductListResponse>(endpoint);
  }

  /**
   * Get category statistics
   */
  async getCategoryStats(slug: string): Promise<unknown> {
    return await httpClient.get<unknown>(`${ENDPOINTS.EXTERNAL.CATEGORIES.DETAIL}${slug}/stats/`);
  }
}

export const categoryService = new CategoryService();
export default categoryService;