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

export type FulfillmentType = "delivery" | "pickup";

export interface CartItemAddon {
  id: number;
  addon: number;
  addon_name: string;
  addon_slug: string;
  quantity: number;
  unit_price: string;
  total_cost: string;
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

  // Legacy add-ons
  cake_topper: number;
  candle: number;
  birthday_card: number;
  chocolate: number;
  wine: number;
  whiskey_200ml: number;

  // Dynamic add-ons
  dynamic_addons: CartItemAddon[];

  additional_notes: string;

  // Pricing
  base_price: string;
  customization_cost: string;
  unit_price: string;
  total_price: string;
  customization_summary: string;
  added_at: string;
}

export interface Cart {
  id: number;
  fulfillment_type: FulfillmentType;
  items: CartItem[];
  item_count: number;
  subtotal: string;
  delivery_cost: string;
  grand_total: string;
  created_at: string;
  updated_at: string;
}

export interface AddonInput {
  addon_id: number;
  quantity: number;
}

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
  addons?: AddonInput[];
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

export interface AddonOption {
  id: number;
  type: string;
  name: string;
  price: string;
  description: string;
}

export interface SizeOption {
  id: number;
  size: string;
  display: string;
  multiplier: string;
}

export interface FlavorOption {
  id: number;
  name: string;
  multiplier: string;
}

export interface CustomizationOptions {
  sizes: SizeOption[];
  flavors: FlavorOption[];
  addons: AddonOption[];
}

export interface CakeCustomizeResponse {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string | null;
  layers: number;
  covering: string;
  preparation_days: number;
  customization_options: CustomizationOptions;
}

// ============================================================================
// DELIVERY TYPES — aligned to DeliveryZoneListSerializer
// ============================================================================

export interface DeliveryZone {
  id: number;
  area_name: string;        // matches serializer field
  fee: string;              // matches serializer field
}

// ============================================================================
// SERVICE
// ============================================================================

class CartService {
  async getCart(): Promise<Cart> {
    return await httpClient.get<Cart>(ENDPOINTS.EXTERNAL.CART.ROOT);
  }

  async getCartCount(): Promise<number> {
    const res = await httpClient.get<CartItemCount>(
      ENDPOINTS.EXTERNAL.CART.COUNT,
    );
    return res.count;
  }

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
      ...payload,
    });
  }

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

  async removeCartItem(itemId: number): Promise<{
    message: string;
    cart_item_count: number;
  }> {
    return await httpClient.delete(`${ENDPOINTS.EXTERNAL.CART.ITEM}${itemId}/`);
  }

  async clearCart(): Promise<{ message: string; cart: Cart }> {
    return await httpClient.delete(ENDPOINTS.EXTERNAL.CART.ROOT);
  }

  async getCartSummary(): Promise<CartSummary> {
    return await httpClient.get<CartSummary>(ENDPOINTS.EXTERNAL.CART.SUMMARY);
  }

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

  async saveDeliveryInfo(data: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    area_name?: string;          // matches form field
    delivery_date: string;
    delivery_time_slot?: string;
    special_instructions?: string;
  }): Promise<{ message: string; delivery_info: object }> {
    return await httpClient.post(ENDPOINTS.EXTERNAL.CART.DELIVERY, data);
  }

  async setFulfillmentType(
    fulfillmentType: FulfillmentType,
  ): Promise<{ message: string; cart: Cart }> {
    return await httpClient.post(ENDPOINTS.EXTERNAL.CART.FULFILLMENT_TYPE, {
      fulfillment_type: fulfillmentType,
    });
  }

  async getDeliveryZones(): Promise<DeliveryZone[]> {
    const res = await httpClient.get<
      DeliveryZone[] | { results: DeliveryZone[] }
    >(ENDPOINTS.EXTERNAL.DELIVERY.ZONES);

    if (Array.isArray(res)) {
      return res;
    }
    return res?.results ?? [];
  }

  async getCakeCustomizationOptions(
    slug: string,
  ): Promise<CakeCustomizeResponse> {
    return await httpClient.get<CakeCustomizeResponse>(
      `${ENDPOINTS.EXTERNAL.PRODUCTS.CUSTOMIZE}${slug}/customize/`,
    );
  }
}

export const cartService = new CartService();
export default cartService;