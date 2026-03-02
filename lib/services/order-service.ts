import { httpClient } from '@/lib/api/http-client';
import ENDPOINTS from '@/constants/endpoints';

export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface CreateOrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  special_instructions?: string;
  payment_method: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  special_instructions?: string;
  payment_method: string;
  items: OrderItem[];
  total_amount: string;
  status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order: Order;
  message: string;
}

/**
 * Order service for M&C Cakes API
 */
class OrderService {
  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await httpClient.post<Order>(
      ENDPOINTS.EXTERNAL.ORDERS.CREATE,
      data
    );
    return response;
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: number): Promise<Order> {
    return await httpClient.get<Order>(
      `${ENDPOINTS.EXTERNAL.ORDERS.DETAIL}${orderId}/`
    );
  }

  /**
   * Get all orders for authenticated user
   */
  async listOrders(): Promise<Order[]> {
    const response = await httpClient.get<{ results: Order[] }>(
      ENDPOINTS.EXTERNAL.ORDERS.DETAIL
    );
    return response.results;
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: number): Promise<Order> {
    return await httpClient.patch<Order>(
      `${ENDPOINTS.EXTERNAL.ORDERS.DETAIL}${orderId}/cancel/`,
      {}
    );
  }
}

export const orderService = new OrderService();
export default orderService;
