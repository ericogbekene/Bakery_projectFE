"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useCart } from "@/lib/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import Container from "@/components/shared/container";
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
import useMessage from "@/hooks/use-message";

const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().min(10, "Phone number must be at least 10 digits"),
  delivery_address: z.string().min(5, "Address is required"),
  special_instructions: z.string().optional(),
  payment_method: z.enum(["card", "bank_transfer", "cash_on_delivery"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading } = useCart();
  const { alertMessage } = useMessage();
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const { checkout, isPending } = useCheckout({
    onSuccess: (order) => {
      setFormErrors([]);
      alertMessage(`Order #${order.id} created successfully!`, "success");
      router.push(`/order-success?orderId=${order.id}`);
    },
    onError: (error) => {
      const errorMsg = error.message || "Failed to create order";
      setFormErrors([errorMsg]);
      alertMessage(errorMsg, "error");
      console.error("[Checkout Error]", error);
    },
  });

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      delivery_address: "",
      special_instructions: "",
      payment_method: "card",
    },
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    // Reset form errors at start
    setFormErrors([]);

    // Validate cart state
    if (!cart) {
      const err = "Cart not loaded. Please refresh and try again.";
      setFormErrors([err]);
      alertMessage(err, "error");
      return;
    }

    if (cart.cart_items.length === 0) {
      const err = "Your cart is empty. Add items before checkout.";
      setFormErrors([err]);
      alertMessage(err, "error");
      return;
    }

    // Additional validation
    const validationErrors: string[] = [];
    if (!values.customer_name?.trim()) {
      validationErrors.push("Full name is required");
    }
    if (!values.customer_email?.trim()) {
      validationErrors.push("Email is required");
    }
    if (!values.customer_phone?.trim()) {
      validationErrors.push("Phone number is required");
    }
    if (!values.delivery_address?.trim()) {
      validationErrors.push("Delivery address is required");
    }

    if (validationErrors.length > 0) {
      setFormErrors(validationErrors);
      alertMessage("Please fix the errors below", "error");
      return;
    }

    try {
      await checkout(values);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error occurred";
      setFormErrors([errMsg]);
      console.error("[Checkout Error]", err);
    }
  };

  if (cartLoading) {
    return (
      <main className="py-12">
        <Container>
          <p>Loading checkout...</p>
        </Container>
      </main>
    );
  }

  if (!cart || cart.cart_items.length === 0) {
    return (
      <main className="py-12">
        <Container>
          <p className="mb-4">Your cart is empty. Add items before checkout.</p>
          <Button onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </Container>
      </main>
    );
  }

  return (
    <main className="py-12">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {/* Error Alert */}
            {formErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
                <h3 className="font-semibold text-red-900 mb-2">
                  Please fix the following errors:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
                  {formErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Customer Info Section */}
                <div className="border rounded p-4">
                  <h2 className="text-lg font-semibold mb-4">
                    Customer Information
                  </h2>

                  <FormField
                    control={form.control}
                    name="customer_name"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Your name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customer_email"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="your@email.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customer_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+1 (555) 123-4567" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Delivery Section */}
                <div className="border rounded p-4">
                  <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>

                  <FormField
                    control={form.control}
                    name="delivery_address"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Street address, city, zip code"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="special_instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Any special requests or allergies?"
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Payment Section */}
                <div className="border rounded p-4">
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Payment Method</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="card">Credit/Debit Card</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="cash_on_delivery">
                              Cash on Delivery
                            </option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending || cartLoading || !cart || cart.cart_items.length === 0}
                  className="w-full h-12"
                >
                  {isPending ? "Processing Order..." : "Place Order"}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  By placing an order, you agree to our terms and conditions.
                </p>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              cart={cart}
              isLoading={cartLoading}
              isSubmitting={isPending}
            />
          </div>
        </div>
      </Container>
    </main>
  );
}
