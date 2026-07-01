import ENDPOINTS from "@/constants/endpoints";
import { httpClient } from "@/lib/api/http-client";

export interface ProductFilters {
  search?: string;
  category?: string; // category ID (integer) — NOT slug
  product_type?: "cake" | "pastry";
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  product_type: "cake" | "pastry";
  product_type_display: string;
  image_url: string | null;
  thumbnail_url: string | null;
  medium_image_url: string | null;
  large_image_url: string | null;
  price: string;
  available: boolean;
  category_name: string | null;
  created_at: string;
  layers: number | null;
  covering: string | null;
  preparation_days: number | null;
  description: string | null; // ← ADD THIS LINE
  inspiration: string | null; // ← ADD THIS TOO (used in cake detail)
}
export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  page_size: number;
  results: Product[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  product_count: number;
}

export interface CategoryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export interface ProductCounts {
  cakes: number;
  pastries: number;
  total: number;
}

/**
 * Product service for MC Cakes Django API
 */
class ProductService {
  /**
   * Get all products with filtering and pagination.
   *
   * FIX 1: Removed `category_slug` param — Django filters by `category` (integer ID).
   * FIX 2: Removed `min_price`, `max_price`, `inStock`, `limit` — these params
   *         don't exist on the Django backend and were silently ignored.
   * FIX 3: Use `page_size` not `limit` for page size control.
   * FIX 4: Use `search` not `q` for text search.
   */
  async getProducts(
    filters: ProductFilters = {},
  ): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append("search", filters.search);
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.product_type)
      queryParams.append("product_type", filters.product_type);
    if (filters.ordering) queryParams.append("ordering", filters.ordering);
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.page_size)
      queryParams.append("page_size", filters.page_size.toString());

    const qs = queryParams.toString();
    const endpoint = qs
      ? `${ENDPOINTS.EXTERNAL.PRODUCTS.LIST}?${qs}`
      : ENDPOINTS.EXTERNAL.PRODUCTS.LIST;

    return await httpClient.get<ProductListResponse>(endpoint);
  }

  /**
   * Get all cakes only.
   */
  async getCakes(page = 1): Promise<ProductListResponse> {
    return await httpClient.get<ProductListResponse>(
      `${ENDPOINTS.EXTERNAL.PRODUCTS.CAKES}?page=${page}`,
    );
  }

  /**
   * Get all pastries only.
   */
  async getPastries(page = 1): Promise<ProductListResponse> {
    return await httpClient.get<ProductListResponse>(
      `${ENDPOINTS.EXTERNAL.PRODUCTS.PASTRIES}?page=${page}`,
    );
  }

  /**
   * Get single product by slug.
   */
  async getProduct(slug: string): Promise<Product> {
    return await httpClient.get<Product>(
      `${ENDPOINTS.EXTERNAL.PRODUCTS.DETAIL}${slug}/`,
    );
  }

  /**
   * Get cake customization options (sizes, flavors, add-ons).
   */
  async getCakeCustomization(
    slug: string,
  ): Promise<Product & { customization_options: unknown }> {
    return await httpClient.get(
      `${ENDPOINTS.EXTERNAL.PRODUCTS.DETAIL}${slug}/customize/`,
    );
  }

  /**
   * Search products by name or description.
   *
   * FIX: Changed `q` to `search` — DRF SearchFilter uses ?search= not ?q=
   * FIX: Removed `category_slug` — Django uses `category` (integer ID)
   */
  async searchProducts(
    query: string,
    filters: Pick<ProductFilters, "category" | "product_type"> = {},
  ): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams({ search: query });

    if (filters.category) queryParams.append("category", filters.category);
    if (filters.product_type)
      queryParams.append("product_type", filters.product_type);

    return await httpClient.get<ProductListResponse>(
      `${ENDPOINTS.EXTERNAL.PRODUCTS.SEARCH}?${queryParams.toString()}`,
    );
  }

  /**
   * Get product counts by type.
   */
  async getProductCounts(): Promise<ProductCounts> {
    return await httpClient.get<ProductCounts>(
      ENDPOINTS.EXTERNAL.PRODUCTS.COUNTS,
    );
  }

  /**
   * Get all categories with product counts.
   */
  async getCategories(): Promise<CategoryListResponse> {
    return await httpClient.get<CategoryListResponse>(
      ENDPOINTS.EXTERNAL.PRODUCTS.CATEGORIES,
    );
  }

  /**
   * Get a single category by slug, including its products.
   */
  async getCategoryBySlug(
    slug: string,
  ): Promise<Category & { products: Product[] }> {
    return await httpClient.get(
      `${ENDPOINTS.EXTERNAL.PRODUCTS.CATEGORIES}${slug}/`,
    );
  }
}

export const productService = new ProductService();
export default productService;
