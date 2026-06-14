"use client";

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

  const { data: cart } = useQuery({
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

  const initializePayment = async (orderNumber: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/initialize/`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          },
          credentials: "include",
          body: JSON.stringify({ order_number: orderNumber }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to initialize payment");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Payment initialization error:", error);
      throw error;
    }
  };

  const onSubmit = async (values: FormType) => {
    const payload = {
      customer_name: values.name,
      customer_email: values.email,
      customer_phone: values.phone,
      delivery_address: values.deliveryAddress,
      delivery_city: values.deliveryCity,
      delivery_date: values.deliveryDate,
      delivery_time_slot: values.deliveryTimeSlot ?? "",
      special_instructions: values.specialInstructions ?? "",
    };

    try {
      // Step 1: Create the order
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/create/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to create order");
      }

      const data = await response.json();
      const orderNumber = data.order.order_number;

      // Clear cart cache
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });

      // Step 2: Initialize Paystack payment
      const paymentData = await initializePayment(orderNumber);

      // Step 3: Redirect to Paystack payment page
      if (paymentData.payment_link) {
        // Store order number in session storage for after payment return
        sessionStorage.setItem("pending_order", orderNumber);
        // Redirect to Paystack
        window.location.href = paymentData.payment_link;
      } else {
        throw new Error("No payment link received");
      }

    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to place order";
      alert(message);
    }
  };

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

        {/* Order Summary */}
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