"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cartService } from "@/lib/services/cart-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  deliveryAddress: z
    .string()
    .min(1, { message: "Delivery address is required" }),
  deliveryCity: z.string().min(1, { message: "City is required" }),
  deliveryDate: z.string().min(1, { message: "Delivery date is required" }),
  deliveryTimeSlot: z.string().optional(),
  specialInstructions: z.string().optional(),
});

type FormType = z.infer<typeof formSchema>;

const OrderForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
  });

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      deliveryAddress: "",
      deliveryCity: "",
      deliveryDate: "",
      deliveryTimeSlot: "",
      specialInstructions: "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      console.log("🔍 getAuthToken - Token exists:", !!token);
      if (token) {
        console.log("🔍 Token preview:", token.substring(0, 20) + "...");
      }
      return token;
    }
    return null;
  };

  const initializePayment = async (orderNumber: string) => {
    try {
      const token = getAuthToken();
      
      console.log("🔍 initializePayment - Token found:", !!token);
      console.log("🔍 Order number:", orderNumber);
      
      if (!token) {
        console.log("❌ No token found - redirecting to login");
        sessionStorage.setItem("pending_order_number", orderNumber);
        const returnUrl = `/checkout`;
        router.push(`/login?next=${encodeURIComponent(returnUrl)}`);
        return null;
      }
      
      // ✅ Ensure token is properly formatted
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      console.log("🔍 Sending Authorization header:", formattedToken.substring(0, 30) + "...");
      
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/payments/initialize/`,
  {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": formattedToken,
    },
    credentials: "include",
    body: JSON.stringify({ order_number: orderNumber }),
  }
);

      const responseText = await response.text();
      console.log("📡 Payment response status:", response.status);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.detail || errorData.error || errorData.message || errorMessage;
          console.error("❌ Error response:", errorData);
        } catch {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Payment initialization error:", error);
      throw error;
    }
  };

  const onSubmit = async (values: FormType) => {
    if (!cart || cart.item_count === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      router.push("/menu");
      return;
    }

    const payload = {
      customer_name: values.name,
      customer_email: values.email,
      customer_phone: values.phone,
      delivery_address: values.deliveryAddress,
      delivery_city: values.deliveryCity,
      delivery_date: values.deliveryDate,
      delivery_time_slot: values.deliveryTimeSlot?.trim() !== "" ? values.deliveryTimeSlot : null,
      special_instructions: values.specialInstructions?.trim() !== "" ? values.specialInstructions : null,
    };

    const token = getAuthToken();
    console.log("🔍 Token on submit:", !!token);

    // ✅ GUEST FLOW - No authentication token
    if (!token) {
      console.log("Guest user detected - creating order then redirecting to login");
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create/`,
          {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
          }
        );

        const responseText = await response.text();

        if (!response.ok) {
          let errorMessage = `Failed to create order: ${response.status}`;
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = typeof errorData === 'object' 
              ? JSON.stringify(errorData, null, 2) 
              : errorData.detail || errorData.message || errorMessage;
          } catch {
            errorMessage = responseText ? responseText.substring(0, 300) + "..." : errorMessage;
          }
          throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText);
        
        if (data.requires_authentication) {
          sessionStorage.setItem('pending_order_id', String(data.order_id));
          sessionStorage.setItem('pending_order_number', data.order_number);
          
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          queryClient.invalidateQueries({ queryKey: ["cart-count"] });
          
          const returnUrl = `/checkout/${data.order_id}`;
          router.push(`/login?next=${encodeURIComponent(returnUrl)}`);
          return;
        }

        console.error("Unexpected response for guest order:", data);
        alert("Please login to complete your order.");
        router.push("/login");
        return;

      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to create order";
        console.error("Guest order creation failed:", message);
        alert(message);
        return;
      }
    }

    // ✅ AUTHENTICATED FLOW - User has token
    try {
      console.log("Sending order payload to Django:", payload);
      
      // ✅ Ensure token is properly formatted
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create/`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": formattedToken,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = `Failed to create order: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = typeof errorData === 'object' 
            ? JSON.stringify(errorData, null, 2) 
            : errorData.detail || errorData.message || errorMessage;
        } catch {
          errorMessage = responseText ? responseText.substring(0, 300) + "..." : errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);
      const orderNumber = data.order.order_number;
      
      console.log("✅ Order processed successfully. Reference ID:", orderNumber);

      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });

      const paymentData = await initializePayment(orderNumber);

      if (paymentData && paymentData.payment_link) {
        sessionStorage.setItem("pending_order", orderNumber);
        window.location.href = paymentData.payment_link;
      } else if (!paymentData) {
        // Guest flow - already redirected
        return;
      } else {
        throw new Error("No payment link received from Paystack");
      }

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to place order";
      console.error("❌ Order process failure logs:", message);
      alert(message);
    }
  };

  if (cartLoading || !mounted) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-lg font-semibold">Delivery Details</h2>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-text">Full Name</FormLabel>
              <FormControl>
                <Input {...field} className="h-11" placeholder="Full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-text">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-11"
                  placeholder="Email"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-text">Phone</FormLabel>
              <FormControl>
                <Input {...field} className="h-11" placeholder="Phone number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-text">Delivery Address</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="h-24"
                  placeholder="Street address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-text">City</FormLabel>
              <FormControl>
                <Input {...field} className="h-11" placeholder="City" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-text">Delivery Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-11"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryTimeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-text">
                Preferred Time (optional)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-11"
                  placeholder="e.g. Morning, Afternoon"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-text">
                Special Instructions (optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="h-20"
                  placeholder="Any special delivery instructions"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {cart && (
          <div className="space-y-2 rounded-lg border bg-gray-50 p-4 text-sm">
            <h3 className="font-semibold text-gray-900">Order Summary</h3>
            <div className="flex justify-between text-gray-600">
              <span>Items ({cart.item_count})</span>
              <span>₦{Number(cart.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span>₦{Number(cart.delivery_cost).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span>₦{Number(cart.grand_total).toLocaleString()}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="h-12 w-full"
          size="lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Processing..." : "Proceed to Payment"}
        </Button>
      </form>
    </Form>
  );
};

export default OrderForm;