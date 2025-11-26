export {};

declare global {
  namespace T {
    interface QueryResponse<T> {
      count: number;
      next: string | null;
      previous: string | null;
      results: T[];
    }

    interface LoginResponse {
      message: string;
      access: string;
      refresh: string;
      user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
      };
    }

    interface Product {
      id: number;
      name: string;
      slug: string;
      image: string;
      price: string;
      available: boolean;
      category_name: string;
      stock_quantity: number;
      is_in_stock: boolean;
      is_low_stock: boolean;
      created_at: string;
      image_url: string;
      medium_image_url: string;
      large_image_url: string;
      thumbnail_url: string;
    }
  }
}
