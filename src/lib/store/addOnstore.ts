// lib/store/addOnStore.ts
import { create } from 'zustand';

interface OrderForm {
  quantity: number;
  topper: string;
  birthdayCard: number;
  chocolate: number;
  candle: number;
  wine: number;
  whiskey: number;
  note: string;
} 

export interface AddOn {
  field: keyof OrderForm;
  label: string;
  price: number;
}

interface AddOnStore {
  addOns: AddOn[];
  fetchAddOns: () => void; // currently uses mock data
}

export const useAddOnStore = create<AddOnStore>((set) => ({
  addOns: [],
  fetchAddOns: () => {
    // Mock data for now – can replace with API call later
    const mockAddOns: AddOn[] = [
      { field: 'topper', label: 'Topper', price: 2000 },
      { field: 'birthdayCard', label: 'Birthday Card', price: 1500 },
      { field: 'chocolate', label: 'Chocolate', price: 2500 },
      { field: 'candle', label: 'Candle', price: 500 },
      { field: 'wine', label: 'Wine', price: 6000 },
      { field: 'whiskey', label: 'Whiskey', price: 10000 },
    ];

    set({ addOns: mockAddOns });
  },
}));
