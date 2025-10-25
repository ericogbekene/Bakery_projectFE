/**
 * External API types for M&C Cakes API
 * These types represent the structure of data from the external API
 */

export interface ExternalProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  category: string;
  category_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tags?: string[];
  ingredients?: string[];
  allergens?: string[];
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface ExternalCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  sort_order?: number;
}

export interface ExternalApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ExternalProductFilters {
  category?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  is_active?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
  sort_by?: 'name' | 'price' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

export interface ExternalCategoryFilters {
  is_active?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sort_by?: 'name' | 'created_at' | 'sort_order';
  sort_order?: 'asc' | 'desc';
}

export interface ExternalOrder {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: ExternalOrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  delivery_address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  delivery_date: string;
  delivery_time: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface ExternalOrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_requests?: string;
}

export interface ExternalCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ExternalAuthResponse {
  success: boolean;
  token: string;
  expires_in: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ExternalError {
  success: false;
  error: string;
  code: string;
  details?: unknown;
  timestamp: string;
}
