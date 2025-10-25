import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService, Cart, CartItem } from '@/lib/services/cart-service';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (productId: number) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (productId: number, quantity: number) => Promise<{ success: boolean; error?: string }>;
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
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartService.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (productId: number) => cartService.removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartService.updateQuantity(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      await addToCartMutation.mutateAsync({ productId, quantity });
      return { success: true };
    } catch (error: unknown) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add to cart' 
      };
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      await removeFromCartMutation.mutateAsync(productId);
      return { success: true };
    } catch (error: unknown) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove from cart' 
      };
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      await updateQuantityMutation.mutateAsync({ productId, quantity });
      return { success: true };
    } catch (error: unknown) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update quantity' 
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
        error: error instanceof Error ? error.message : 'Failed to clear cart' 
      };
    }
  };

  const isInCart = (productId: number) => {
    if (!cart?.cart_items) return false;
    return cart.cart_items.some(item => item.product.id === productId);
  };

  const getCartItem = (productId: number) => {
    if (!cart?.cart_items) return null;
    return cart.cart_items.find(item => item.product.id === productId) || null;
  };

  const getTotalItems = () => {
    if (!cart?.cart_items) return 0;
    return cart.cart_items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart?.total_price || '0.00';
  };

  const refreshCart = () => {
    refetchCart();
  };

  return (
    <CartContext.Provider value={{
      cart,
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
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};