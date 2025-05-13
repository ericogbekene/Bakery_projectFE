"use client";

import { useCartStore } from "@/src/lib/store/cartstore";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total)();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = () => {
    console.log("Order Submitted:", formData, items);
    alert("Order placed!");
    // You can handle sending the data to backend here
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/">
          <button className="bg-[#C85387] text-white px-6 py-2 rounded hover:bg-pink-700 transition">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* LEFT: Cart Items */}
      
      <div>
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-start border-b py-4">
            {/* Image */}
            <div className="w-24 h-24 relative">
              <Image
                src={item.image || "/placeholder.jpg"}
                alt={item.title}
                fill
                className="object-cover rounded-md"
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <p className="font-semibold text-lg">{item.title}</p>
              <div className="text-sm text-gray-600 space-y-1 mt-1">
                {item.addOns &&
                  Object.entries(item.addOns)
                    .filter(([ value]) => value) // Only show truthy values (e.g., not 0 or false)
                    .map(([key, value], index) => (
                      <p key={index} className="text-sm text-gray-600">
                        • {key}:{" "}
                        {value === 1 || value === "Yes" ? "Yes" : value}
                      </p>
                    ))}
              </div>
              <p className="mt-2 text-gray-700 font-medium">
                ₦{item.price.toLocaleString()} x {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Form */}
      <div className="p-6 ">
        <form className="space-y-4">
          <label className="block font-medium">Name</label>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-sm px-4 py-2"
          />
          <label className="block font-medium">Email</label>
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-sm px-4 py-2"
          />
          <label className="block font-medium">Phone Number</label>
          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-sm px-4 py-2"
          />
          <label className="block font-medium">Address</label>
          <textarea
            name="address"
            placeholder="Delivery Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-sm px-4 py-2"
            rows={3}
          />
        </form>

        <div className="mt-6">
          <p className="text-lg font-semibold mb-2">
            Total: ₦{total.toLocaleString()}
          </p>
          <button
            onClick={handleOrder}
            className="bg-pink-600 text-white px-6 py-3 w-full rounded-lg hover:bg-pink-700 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
