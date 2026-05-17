import {
  AddToCartPayload,
  Cart,
  CartItem,
  cartService,
} from "@/lib/services/cart-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (
    productId: number,
    quantity?: number,
  ) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (
    itemId: number,
  ) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (
    itemId: number,
    quantity: number,
  ) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<{ success: boolean; error?: string }>;
  isInCart: (productId: number) => boolean;
  getCartItem: (productId: number) => CartItem | null;
  getTotalItems: () => number;
  getTotalPrice: () => string;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  // Fetch cart data
  const {
    data: cart,
    isLoading,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add to cart mutation - FIXED: Use AddToCartPayload
  const addToCartMutation = useMutation({
    mutationFn: (payload: AddToCartPayload) => cartService.addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Remove from cart mutation - FIXED: Use removeCartItem with item ID
  const removeFromCartMutation = useMutation({
    mutationFn: (itemId: number) => cartService.removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Update quantity mutation - FIXED: Use updateCartItem with item ID
  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartService.updateCartItem(itemId, { quantity, action: "set" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // FIXED: Construct proper payload for addToCart
  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      const payload: AddToCartPayload = {
        product_id: productId,
        quantity,
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
      };
      await addToCartMutation.mutateAsync(payload);
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to add to cart",
      };
    }
  };

  // FIXED: removeFromCart now uses item ID (not product ID)
  const removeFromCart = async (itemId: number) => {
    try {
      await removeFromCartMutation.mutateAsync(itemId);
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to remove from cart",
      };
    }
  };

  // FIXED: updateQuantity now uses item ID (not product ID)
  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await updateQuantityMutation.mutateAsync({ itemId, quantity });
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update quantity",
      };
    }
  };

  const clearCart = async () => {
    try {
      await clearCartMutation.mutateAsync();
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to clear cart",
      };
    }
  };

  // FIXED: Use cart.items (not cart_items)
  const isInCart = (productId: number) => {
    if (!cart?.items) return false;
    return cart.items.some((item) => item.product.id === productId);
  };

  // FIXED: Use cart.items
  const getCartItem = (productId: number) => {
    if (!cart?.items) return null;
    return cart.items.find((item) => item.product.id === productId) || null;
  };

  // FIXED: Use cart.items
  const getTotalItems = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  // FIXED: Use grand_total (not total_price)
  const getTotalPrice = () => {
    return cart?.grand_total || "0.00";
  };

  const refreshCart = () => {
    refetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart: cart || null,
        loading: isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartItem,
        getTotalItems,
        getTotalPrice,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
