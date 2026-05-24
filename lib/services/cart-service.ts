import ENDPOINTS from "@/constants/endpoints";
import { httpClient } from "@/lib/api/http-client";

// ============================================================================
// TYPES — aligned to Django CartSerializer output
// ============================================================================

export interface CartItemProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  image_url: string | null;
  thumbnail_url: string | null;
}

export interface CartItem {
  id: number;
  product: CartItemProduct;
  quantity: number;

  // Cake customization
  flavour_1: string;
  flavour_2: string;
  size: string;
  colours: string;

  // Add-ons
  cake_topper: number;
  candle: number;
  birthday_card: number;
  chocolate: number;
  wine: number;
  whiskey_200ml: number;

  additional_notes: string;

  // Pricing
  base_price: string;
  customization_cost: string;
  unit_price: string;
  total_price: string; // NOTE: serializer exposes this as total_price
  customization_summary: string;
  added_at: string;
}

export interface Cart {
  id: number;
  items: CartItem[]; // FIX: Django returns `items` not `cart_items`
  item_count: number; // FIX: Django returns `item_count` not `total_items`
  subtotal: string;
  delivery_cost: string;
  grand_total: string; // FIX: Django returns `grand_total` not `total_price`
  created_at: string;
  updated_at: string;
}

// Full payload for adding a cake to cart — matches Django AddToCartSerializer
export interface AddToCartPayload {
  product_id: number;
  quantity?: number;
  flavour_1?: string;
  flavour_2?: string;
  size?: string;
  colours?: string;
  cake_topper?: number;
  candle?: number;
  birthday_card?: number;
  chocolate?: number;
  wine?: number;
  whiskey_200ml?: number;
  additional_notes?: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
  action: "set" | "increase" | "decrease";
}

export interface CartItemCount {
  count: number;
}

export interface CartSummary {
  item_count: number;
  subtotal: string;
  delivery_cost: string;
  grand_total: string;
}

// ============================================================================
// SERVICE
// ============================================================================

class CartService {
  /**
   * Get the current cart.
   * Works for both guests (session) and logged-in users.
   * FIX: was ENDPOINTS.EXTERNAL.CART.LIST → /cart/cart/ (doubled)
   */
  async getCart(): Promise<Cart> {
    return await httpClient.get<Cart>(ENDPOINTS.EXTERNAL.CART.ROOT);
  }

  /**
   * Get just the cart item count (lightweight, good for navbar badge).
   */
  async getCartCount(): Promise<number> {
    const res = await httpClient.get<CartItemCount>(
      ENDPOINTS.EXTERNAL.CART.COUNT,
    );
    return res.count;
  }

  /**
   * Add a product to the cart with full cake customization.
   *
   * FIX: Old signature was addToCart(productId, quantity) — too simple.
   *      Now accepts the full AddToCartPayload so cake customizations
   *      (flavour, size, colours, add-ons) are sent to Django correctly.
   * FIX: Endpoint was CART.ADD → /cart/cart/add/ (doubled)
   *      Now uses ENDPOINTS.EXTERNAL.CART.ADD → /cart/add/
   */
  async addToCart(payload: AddToCartPayload): Promise<{
    message: string;
    cart_item: CartItem;
    cart_item_count: number;
  }> {
    return await httpClient.post(ENDPOINTS.EXTERNAL.CART.ADD, {
      quantity: 1,
      flavour_1: "",
      flavour_2: "",
      size: "",
      colours: "",
      cake_topper: 0,
      candle: 0,
      birthday_card: 0,
      chocolate: 0,
      wine: 0,
      whiskey_200ml: 0,
      additional_notes: "",
      ...payload, // caller values override defaults
    });
  }

  /**
   * Update a cart item's quantity by its item ID.
   *
   * FIX: Old version called addToCart/removeFromCart by product_id.
   *      Django uses item ID (not product ID) for updates.
   *      Endpoint: PATCH /cart/items/<item_id>/
   */
  async updateCartItem(
    itemId: number,
    payload: UpdateCartItemPayload,
  ): Promise<{
    message: string;
    cart_item: CartItem;
    cart_item_count: number;
  }> {
    return await httpClient.patch(
      `${ENDPOINTS.EXTERNAL.CART.ITEM}${itemId}/`,
      payload,
    );
  }

  /**
   * Remove a cart item by its item ID.
   * FIX: Old version POSTed to /cart/cart/remove/ which doesn't exist.
   *      Django uses DELETE /cart/items/<item_id>/
   */
  async removeCartItem(itemId: number): Promise<{
    message: string;
    cart_item_count: number;
  }> {
    return await httpClient.delete(`${ENDPOINTS.EXTERNAL.CART.ITEM}${itemId}/`);
  }

  /**
   * Clear the entire cart.
   * FIX: Old version POSTed to /cart/cart/clear/ which doesn't exist.
   *      Django uses DELETE /cart/
   */
  async clearCart(): Promise<{ message: string; cart: Cart }> {
    return await httpClient.delete(ENDPOINTS.EXTERNAL.CART.ROOT);
  }

  /**
   * Get cart summary (totals only, no items).
   */
  async getCartSummary(): Promise<CartSummary> {
    return await httpClient.get<CartSummary>(ENDPOINTS.EXTERNAL.CART.SUMMARY);
  }

  /**
   * Calculate price for a cake configuration before adding to cart.
   */
  async calculatePrice(payload: Omit<AddToCartPayload, "quantity">): Promise<{
    product_id: number;
    product_name: string;
    design_price: string;
    size_multiplier: string;
    flavor_multiplier: string;
    cake_base_price: string;
    addons_cost: string;
    unit_price: string;
    formatted_price: string;
  }> {
    return await httpClient.post(
      ENDPOINTS.EXTERNAL.CART.CALCULATE_PRICE,
      payload,
    );
  }

  /**
   * Save delivery information to the cart.
   */
  async saveDeliveryInfo(data: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    postal_code?: string;
    delivery_date: string;
    delivery_time_slot?: string;
    special_instructions?: string;
  }): Promise<{ message: string; delivery_info: object }> {
    return await httpClient.post(ENDPOINTS.EXTERNAL.CART.DELIVERY, data);
  }
}

export const cartService = new CartService();
export default cartService;
