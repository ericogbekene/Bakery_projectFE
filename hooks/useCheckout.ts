import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, CreateOrderData, Order } from '@/lib/services/order-service';

interface UseCheckoutOptions {
  onSuccess?: (order: Order) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for managing checkout and order creation
 */
export function useCheckout(options: UseCheckoutOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateOrderData) => orderService.createOrder(data),
    onSuccess: (order) => {
      // Invalidate cart and orders queries
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      if (options.onSuccess) {
        options.onSuccess(order);
      }
    },
    onError: (error: Error) => {
      if (options.onError) {
        options.onError(error);
      }
    },
  });

  return {
    checkout: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
}
