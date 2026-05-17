import ENDPOINTS from "@/constants/endpoints";
import { httpClient } from "@/lib/api/http-client";
import { ProductListResponse } from "./product-service";

export interface CategoryFilters {
  search?: string;
  hasProducts?: boolean;
  ordering?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: string;
  page?: number;
  page_size?: number;
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
   * FIXED: Use PRODUCTS.CATEGORIES instead of non-existent CATEGORIES.LIST
   */
  async getCategories(
    filters: CategoryFilters = {},
  ): Promise<CategoryListResponse> {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append("search", filters.search);
    if (filters.hasProducts !== undefined) {
      queryParams.append("has_products", filters.hasProducts.toString());
    }
    if (filters.ordering) queryParams.append("ordering", filters.ordering);
    if (filters.limit) queryParams.append("limit", filters.limit.toString());
    if (filters.offset) queryParams.append("offset", filters.offset.toString());
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.page_size)
      queryParams.append("page_size", filters.page_size.toString());

    // FIXED: Use ENDPOINTS.EXTERNAL.PRODUCTS.CATEGORIES
    const baseUrl = ENDPOINTS.EXTERNAL.PRODUCTS.CATEGORIES;
    const endpoint = queryParams.toString()
      ? `${baseUrl}?${queryParams.toString()}`
      : baseUrl;

    return await httpClient.get<CategoryListResponse>(endpoint);
  }

  /**
   * Get single category by slug
   * FIXED: Use PRODUCTS.CATEGORIES with slug
   */
  async getCategory(slug: string): Promise<Category> {
    const endpoint = `${ENDPOINTS.EXTERNAL.PRODUCTS.CATEGORIES}${slug}/`;
    return await httpClient.get<Category>(endpoint);
  }

  /**
   * Get products in category
   * FIXED: Use PRODUCTS.CATEGORIES with slug and products endpoint
   */
  async getCategoryProducts(
    slug: string,
    filters: {
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
      page?: number;
      page_size?: number;
    } = {},
  ): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams();

    if (filters.minPrice)
      queryParams.append("min_price", filters.minPrice.toString());
    if (filters.maxPrice)
      queryParams.append("max_price", filters.maxPrice.toString());
    if (filters.inStock !== undefined)
      queryParams.append("in_stock", filters.inStock.toString());
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.page_size)
      queryParams.append("page_size", filters.page_size.toString());

    // FIXED: Use PRODUCTS.CATEGORIES with products sub-resource
    const endpoint = `${ENDPOINTS.EXTERNAL.PRODUCTS.CATEGORIES}${slug}/products/?${queryParams.toString()}`;
    return await httpClient.get<ProductListResponse>(endpoint);
  }

  /**
   * Get category statistics
   * FIXED: Use PRODUCTS.CATEGORIES with stats endpoint
   */
  async getCategoryStats(slug: string): Promise<unknown> {
    const endpoint = `${ENDPOINTS.EXTERNAL.PRODUCTS.CATEGORIES}${slug}/stats/`;
    return await httpClient.get<unknown>(endpoint);
  }
}

export const categoryService = new CategoryService();
export default categoryService;
