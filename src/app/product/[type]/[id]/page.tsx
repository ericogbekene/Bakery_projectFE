'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useProductStore } from '@/src/lib/store/productstore';
import { useCartStore } from '@/src/lib/store/cartstore';
import {
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { toast } from 'sonner';

// type ProductType = 'cake' | 'loaves' | 'cupcake';

// interface Product {
//   id: string;
//   name: string;
//   image: string;
//   basePrice: number;
//   type: ProductType;
//   description: string;
// }

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

const addOns: { field: keyof Omit<OrderForm, 'quantity' | 'note'>; label: string; price: number }[] = [
  { field: 'topper', label: 'Cake Topper', price: 2000 },
  { field: 'candle', label: 'Candle', price: 2000 },
  { field: 'birthdayCard', label: 'Birthday Card', price: 2000 },
  { field: 'chocolate', label: 'Chocolate', price: 3000 },
  { field: 'wine', label: 'Wine', price: 12000 },
  { field: 'whiskey', label: 'Whiskey', price: 8000 },
];

export default function ProductCheckoutPage() {
  const params = useParams();
  // const type = params?.type as ProductType;
  const id = params?.id as string;

  const getProductById = useProductStore((state) => state.getProductById);
  const product = getProductById(id);

  const addToCart = useCartStore((state) => state.addToCart); // ✅ useCartStore

  const [form, setForm] = useState<OrderForm>({
    quantity: 6,
    topper: '',
    birthdayCard: 0,
    chocolate: 0,
    candle: 0,
    wine: 0,
    whiskey: 0,
    note: '',
  });

 const updateForm = <K extends keyof OrderForm>(field: K, value: OrderForm[K]) => {
  setForm((prev) => ({ ...prev, [field]: value }));
};

  const increment = (field: keyof OrderForm) => {
    setForm((prev) => ({ ...prev, [field]: (prev[field] as number) + 1 }));
  };

  const decrement = (field: keyof OrderForm) => {
    setForm((prev) => ({
      ...prev,
      [field]: Math.max(0, (prev[field] as number) - 1),
    }));
  };

  const calculateTotal = () => {
    if (!product) return 0;
    const extras =
      form.birthdayCard +
      form.chocolate +
      form.candle +
      form.wine +
      form.whiskey;
    return (product.price + extras * 1000) * form.quantity;
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      ...product,
      quantity: form.quantity,
      note: form.note,
      addOns: {
        topper: form.topper,
        birthdayCard: form.birthdayCard,
        chocolate: form.chocolate,
        candle: form.candle,
        wine: form.wine,
        whiskey: form.whiskey,
      },
      total: calculateTotal(),
    });
     toast.success(`${product.title} added to cart`, {
    description: "Go to your cart to check out.",
  });
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/3 w-full">
          
              <CardContent className="text-center p-0 h-full">
                <div className="bg-primary-300 w-full h-2/5 flex justify-center items-center">
                  <div className="w-52 h-52 relative">
                    <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-center" />
                  </div>
                </div>
              </CardContent>
        </div>

        <div className="md:w-2/3 w-full space-y-6">
          <h2 className="text-3xl font-bold">{product.title}</h2>
          <p className="text-gray-600 text-sm">{product.description}</p>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="block font-medium">Quantity</label>
            <input
              type="number"
              min={6}
              className="w-full border border-gray-400 rounded-md p-2"
              value={form.quantity}
              onChange={(e) => updateForm('quantity', Number(e.target.value))}
            />
          </div>

          {/* Add-ons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addOns.map(({ field, label, price }) => (
              <div key={field} className="relative pt-4">
                <label className="block text-sm font-medium mb-2">{label}</label>
                <input
                  type="number"
                  min={0}
                  placeholder={`₦${price.toLocaleString()} per piece`}
                  className="w-full border border-gray-400 rounded-md p-2"
                  value={form[field as keyof OrderForm] as number}
                  onChange={(e) =>
                    updateForm(field as keyof OrderForm, Number(e.target.value))
                  }
                />
                <div className="absolute -bottom-8 right-3 flex gap-2">
                  <button
                    type="button"
                    className="bg-[#C85387] w-6 h-6 rounded-sm flex items-center justify-center text-white"
                    onClick={() => decrement(field as keyof OrderForm)}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="bg-[#C85387] w-6 h-6 rounded-sm flex items-center justify-center text-white"
                    onClick={() => increment(field as keyof OrderForm)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block font-medium">Additional Notes</label>
            <textarea
              rows={8}
              value={form.note}
              onChange={(e) => updateForm('note', e.target.value)}
              placeholder="Tell us if you want a 'Happy Birthday' written on the cake or cake board or any  extra information"
              className="w-full border border-gray-400 rounded-md p-2"
            />
          </div>

          {/* Price + Button */}
          <div className="flex flex-col items-end pt-4 space-y-2">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">Price:</p>
              <p className="font-semibold text-sm">
                ₦{calculateTotal().toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-[#C85387] text-white px-8 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
