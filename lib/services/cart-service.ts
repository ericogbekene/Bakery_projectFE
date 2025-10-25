import { httpClient } from '@/lib/api/http-client';
import ENDPOINTS from '@/constants/endpoints';

export interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: string;
    image_url?: string;
    thumbnail_url?: string;
  };
  quantity: number;
  total_price: string;
}

export interface Cart {
  cart_items: CartItem[];
  total_price: string;
  total_items: number;
}

export interface AddToCartData {
  product_id: number;
  quantity: number;
}

export interface RemoveFromCartData {
  product_id: number;
}

/**
 * Cart service for M&C Cakes API
 */
class CartService {
  /**
   * Add item to cart
   */
  async addToCart(productId: number, quantity: number = 1): Promise<Cart> {
    const data: AddToCartData = {
      product_id: productId,
      quantity: quantity,
    };
    
    return await httpClient.post<Cart>(ENDPOINTS.EXTERNAL.CART.ADD, data);
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(productId: number): Promise<Cart> {
    const data: RemoveFromCartData = {
      product_id: productId,
    };
    
    return await httpClient.post<Cart>(ENDPOINTS.EXTERNAL.CART.REMOVE, data);
  }

  /**
   * Get cart contents
   */
  async getCart(): Promise<Cart> {
    return await httpClient.get<Cart>(ENDPOINTS.EXTERNAL.CART.LIST);
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<Cart> {
    return await httpClient.post<Cart>(ENDPOINTS.EXTERNAL.CART.CLEAR);
  }

  /**
   * Update item quantity
   */
  async updateQuantity(productId: number, quantity: number): Promise<Cart> {
    if (quantity <= 0) {
      return await this.removeFromCart(productId);
    }
    return await this.addToCart(productId, quantity);
  }
}

export const cartService = new CartService();
export default cartService;
