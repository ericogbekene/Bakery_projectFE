import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
  note?: string;
  addOns: {
    topper: string;
    birthdayCard: number;
    chocolate: number;
    candle: number;
    wine: number;
    whiskey: number;
  };
  total?: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  addToCart: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existingItemIndex = get().items.findIndex((i) => i.id === item.id);
        if (existingItemIndex !== -1) {
          const updatedItems = [...get().items];
          updatedItems[existingItemIndex].quantity += item.quantity;
          set({ items: updatedItems });
        } else {
          set((state) => ({ items: [...state.items, item] }));
        }
      },

      addToCart: (item) => {
        const existingItemIndex = get().items.findIndex((i) => i.id === item.id);
        if (existingItemIndex !== -1) {
          const updatedItems = [...get().items];
          updatedItems[existingItemIndex].quantity += item.quantity;
          set({ items: updatedItems });
        } else {
          set((state) => ({ items: [...state.items, item] }));
        }
      },

      removeItem: (id) => {
        const filteredItems = get().items.filter((item) => item.id !== id);
        set({ items: filteredItems });
      },

      clearCart: () => {
        set({ items: [] });
      },

      total: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);
