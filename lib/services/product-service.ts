import { httpClient } from '@/lib/api/http-client';
import ENDPOINTS from '@/constants/endpoints';

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  ordering?: string;
  page?: number;
  limit?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
  thumbnail_url?: string;
  medium_image_url?: string;
  large_image_url?: string;
  price: string;
  available: boolean;
  category_name: string;
  stock_quantity: number;
  is_in_stock: boolean;
  is_low_stock: boolean;
  track_inventory: boolean;
  created_at: string;
}

export interface ProductListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Product[];
}

/**
 * Product service for M&C Cakes API
 */
class ProductService {
  /**
   * Get all products with filtering and pagination
   */
  async getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams();
    
    // Apply filters
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.category) queryParams.append('category_slug', filters.category);
    if (filters.minPrice) queryParams.append('min_price', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('max_price', filters.maxPrice.toString());
    if (filters.inStock !== undefined) queryParams.append('in_stock', filters.inStock.toString());
    if (filters.ordering) queryParams.append('ordering', filters.ordering);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const endpoint = `${ENDPOINTS.EXTERNAL.PRODUCTS.LIST}?${queryParams.toString()}`;
    return await httpClient.get<ProductListResponse>(endpoint);
  }

  /**
   * Get single product by slug
   */
  async getProduct(slug: string): Promise<Product> {
    return await httpClient.get<Product>(`${ENDPOINTS.EXTERNAL.PRODUCTS.DETAIL}${slug}/`);
  }

  /**
   * Search products
   */
  async searchProducts(query: string, filters: Omit<ProductFilters, 'search'> = {}): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams({ q: query });
    
    if (filters.category) queryParams.append('category_slug', filters.category);
    if (filters.minPrice) queryParams.append('min_price', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('max_price', filters.maxPrice.toString());
    if (filters.inStock !== undefined) queryParams.append('in_stock', filters.inStock.toString());

    const endpoint = `${ENDPOINTS.EXTERNAL.PRODUCTS.SEARCH}?${queryParams.toString()}`;
    return await httpClient.get<ProductListResponse>(endpoint);
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(): Promise<Product[]> {
    return await httpClient.get<Product[]>(ENDPOINTS.EXTERNAL.PRODUCTS.FEATURED);
  }

  /**
   * Get related products
   */
  async getRelatedProducts(slug: string): Promise<Product[]> {
    return await httpClient.get<Product[]>(`${ENDPOINTS.EXTERNAL.PRODUCTS.DETAIL}${slug}/related/`);
  }

  /**
   * Get low stock products (admin only)
   */
  async getLowStockProducts(): Promise<Product[]> {
    return await httpClient.get<Product[]>(ENDPOINTS.EXTERNAL.PRODUCTS.LOW_STOCK);
  }
}

export const productService = new ProductService();
export default productService;
