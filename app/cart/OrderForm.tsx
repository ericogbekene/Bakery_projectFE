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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cartService, FulfillmentType } from "@/lib/services/cart-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z
  .object({
    fulfillmentType: z.enum(["delivery", "pickup"]),
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(1, { message: "Phone number is required" }),

    // Delivery fields — required only when fulfillmentType === "delivery"
    deliveryAddress: z.string().optional(),
    deliveryCity: z.string().optional(),
    deliveryState: z.string().optional(),
    deliveryDate: z.string().optional(),
    deliveryTimeSlot: z.string().optional(),

    // Pickup fields — required only when fulfillmentType === "pickup"
    pickupDate: z.string().optional(),
    pickupTimeSlot: z.string().optional(),

    specialInstructions: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillmentType === "delivery") {
      if (!data.deliveryAddress?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Delivery address is required",
          path: ["deliveryAddress"],
        });
      }
      if (!data.deliveryCity?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "City is required",
          path: ["deliveryCity"],
        });
      }
      if (!data.deliveryState?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "State is required",
          path: ["deliveryState"],
        });
      }
      if (!data.deliveryDate?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Delivery date is required",
          path: ["deliveryDate"],
        });
      }
    } else {
      if (!data.pickupDate?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pickup date is required",
          path: ["pickupDate"],
        });
      }
    }
  });

type FormType = z.infer<typeof formSchema>;

interface SavedDeliveryInfo {
  exists: boolean;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
}

const OrderForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
  });

  const { data: deliveryZones, isLoading: zonesLoading } = useQuery({
    queryKey: ["delivery-zones"],
    queryFn: () => cartService.getDeliveryZones(),
  });

  const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  // Fetch the logged-in user's saved delivery info (from a previous order)
  // so the form can be prefilled below. Guests get no data back and the
  // form just stays blank, same as before.
  const { data: savedDeliveryInfo } = useQuery<SavedDeliveryInfo>({
    queryKey: ["saved-delivery-info"],
    queryFn: async () => {
      const token = getAuthToken();
      const formattedToken = token?.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/saved-delivery-info/`,
        {
          headers: {
            Authorization: formattedToken,
          },
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch saved delivery info");
      }

      return response.json();
    },
    enabled: !!getAuthToken(),
    retry: false,
  });

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fulfillmentType: "delivery",
      name: "",
      email: "",
      phone: "",
      deliveryAddress: "",
      deliveryCity: "",
      deliveryState: "",
      deliveryDate: "",
      deliveryTimeSlot: "",
      pickupDate: "",
      pickupTimeSlot: "",
      specialInstructions: "",
    },
  });

  const fulfillmentType = form.watch("fulfillmentType");
  const selectedState = form.watch("deliveryState");

  // Hoisted to top-level watch calls (proper hook usage) instead of calling
  // form.watch(...) inline inside a useEffect dependency array, which was
  // creating new subscriptions on every render and destabilizing the form.
  const watchedName = form.watch("name");
  const watchedEmail = form.watch("email");
  const watchedPhone = form.watch("phone");
  const watchedDeliveryAddress = form.watch("deliveryAddress");
  const watchedDeliveryCity = form.watch("deliveryCity");
  const watchedDeliveryDate = form.watch("deliveryDate");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync form toggle with whatever the cart already has set (e.g. if
  // fulfillment type was chosen earlier in the flow, or on revisit).
  useEffect(() => {
    if (cart?.fulfillment_type) {
      form.setValue("fulfillmentType", cart.fulfillment_type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.fulfillment_type]);

  // Prefill Contact + Delivery fields from the user's saved delivery info
  // (set on a previous order). Only fills fields that are still empty, so
  // it never overwrites anything the user has already typed. Fully
  // editable afterward — this just sets the initial values.
  useEffect(() => {
    if (!savedDeliveryInfo?.exists) return;

    if (!form.getValues("name") && savedDeliveryInfo.full_name) {
      form.setValue("name", savedDeliveryInfo.full_name);
    }
    if (!form.getValues("phone") && savedDeliveryInfo.phone) {
      form.setValue("phone", savedDeliveryInfo.phone);
    }
    if (!form.getValues("deliveryAddress") && savedDeliveryInfo.address) {
      form.setValue("deliveryAddress", savedDeliveryInfo.address);
    }
    if (!form.getValues("deliveryCity") && savedDeliveryInfo.city) {
      form.setValue("deliveryCity", savedDeliveryInfo.city);
    }
    if (!form.getValues("deliveryState") && savedDeliveryInfo.state) {
      form.setValue("deliveryState", savedDeliveryInfo.state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedDeliveryInfo]);

  // When the toggle changes, persist it to the cart so delivery_cost
  // recalculates correctly (pickup always forces it to 0 server-side).
  const handleFulfillmentChange = async (value: FulfillmentType) => {
    form.setValue("fulfillmentType", value);
    try {
      await cartService.setFulfillmentType(value);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    } catch (error) {
      console.error("Failed to update fulfillment type:", error);
    }
  };

  // When state (or the other required delivery fields) changes, save it so
  // the backend can calculate the fee and the Order Summary reflects the
  // real delivery cost. Waits until the backend's required fields are
  // actually filled in, so we don't fire a request that 400s and silently
  // leaves delivery_cost at 0.
  useEffect(() => {
  if (fulfillmentType !== "delivery" || !selectedState) return;
  if (
    !watchedName ||
    !watchedEmail ||
    !watchedPhone ||
    !watchedDeliveryAddress ||
    !watchedDeliveryCity ||
    !watchedDeliveryDate
  ) {
    return;
  }

  const timeout = setTimeout(async () => {
    try {
      await cartService.saveDeliveryInfo({
        full_name: watchedName,
        email: watchedEmail,
        phone: watchedPhone,
        address: watchedDeliveryAddress,
        city: watchedDeliveryCity,
        state: selectedState,
        delivery_date: watchedDeliveryDate,
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    } catch (error) {
      console.error("Failed to save delivery info:", error);
    }
  }, 400);

  return () => clearTimeout(timeout);
}, [
  selectedState,
  fulfillmentType,
  watchedName,
  watchedEmail,
  watchedPhone,
  watchedDeliveryAddress,
  watchedDeliveryCity,
  watchedDeliveryDate,
]);

  const initializePayment = async (orderNumber: string) => {
    try {
      const token = getAuthToken();

      if (!token) {
        sessionStorage.setItem("pending_order_number", orderNumber);
        const returnUrl = `/checkout`;
        router.push(`/login?next=${encodeURIComponent(returnUrl)}`);
        return null;
      }

      const formattedToken = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/initialize/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: formattedToken,
          },
          credentials: "include",
          body: JSON.stringify({ order_number: orderNumber }),
        },
      );

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage =
            errorData.detail ||
            errorData.error ||
            errorData.message ||
            errorMessage;
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

    const basePayload = {
      customer_name: values.name,
      customer_email: values.email,
      customer_phone: values.phone,
      special_instructions:
        values.specialInstructions?.trim() !== ""
          ? values.specialInstructions
          : null,
    };

    const payload =
      values.fulfillmentType === "delivery"
        ? {
            ...basePayload,
            delivery_address: values.deliveryAddress,
            delivery_city: values.deliveryCity,
            delivery_state: values.deliveryState,
            delivery_date: values.deliveryDate,
            delivery_time_slot:
              values.deliveryTimeSlot?.trim() !== ""
                ? values.deliveryTimeSlot
                : null,
          }
        : {
            ...basePayload,
            pickup_date: values.pickupDate,
            pickup_time_slot:
              values.pickupTimeSlot?.trim() !== ""
                ? values.pickupTimeSlot
                : null,
          };

    const token = getAuthToken();

    // ✅ GUEST FLOW - No authentication token
    if (!token) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          },
        );

        const responseText = await response.text();

        if (!response.ok) {
          let errorMessage = `Failed to create order: ${response.status}`;
          try {
            const errorData = JSON.parse(responseText);
            errorMessage =
              typeof errorData === "object"
                ? JSON.stringify(errorData, null, 2)
                : errorData.detail || errorData.message || errorMessage;
          } catch {
            errorMessage = responseText
              ? responseText.substring(0, 300) + "..."
              : errorMessage;
          }
          throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText);

        if (data.requires_authentication) {
          sessionStorage.setItem("pending_order_id", String(data.order_id));
          sessionStorage.setItem("pending_order_number", data.order_number);

          queryClient.invalidateQueries({ queryKey: ["cart"] });
          queryClient.invalidateQueries({ queryKey: ["cart-count"] });

          const returnUrl = `/checkout/${data.order_id}`;
          router.push(`/login?next=${encodeURIComponent(returnUrl)}`);
          return;
        }

        alert("Please login to complete your order.");
        router.push("/login");
        return;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to create order";
        console.error("Guest order creation failed:", message);
        alert(message);
        return;
      }
    }

    // ✅ AUTHENTICATED FLOW - User has token
    try {
      const formattedToken = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: formattedToken,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = `Failed to create order: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage =
            typeof errorData === "object"
              ? JSON.stringify(errorData, null, 2)
              : errorData.detail || errorData.message || errorMessage;
        } catch {
          errorMessage = responseText
            ? responseText.substring(0, 300) + "..."
            : errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);
      const orderNumber = data.order.order_number;

      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });

      const paymentData = await initializePayment(orderNumber);

      if (paymentData && paymentData.payment_link) {
        sessionStorage.setItem("pending_order", orderNumber);
        window.location.href = paymentData.payment_link;
      } else if (!paymentData) {
        return;
      } else {
        throw new Error("No payment link received from Paystack");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to place order";
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
        <h2 className="text-lg font-semibold">How would you like your order?</h2>

        {/* Pickup / Delivery toggle */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleFulfillmentChange("delivery")}
            className={`rounded-lg border-2 p-4 text-left transition ${
              fulfillmentType === "delivery"
                ? "border-primary bg-primary/5"
                : "border-gray-200"
            }`}
          >
            <div className="font-semibold">Delivery</div>
            <div className="text-sm text-gray-500">
              We&apos;ll bring it to you
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleFulfillmentChange("pickup")}
            className={`rounded-lg border-2 p-4 text-left transition ${
              fulfillmentType === "pickup"
                ? "border-primary bg-primary/5"
                : "border-gray-200"
            }`}
          >
            <div className="font-semibold">Pickup with us</div>
            <div className="text-sm text-gray-500">
              Collect from the bakery
            </div>
          </button>
        </div>

        <h2 className="text-lg font-semibold">Contact Details</h2>

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

        {fulfillmentType === "delivery" ? (
          <>
            <h2 className="text-lg font-semibold">Delivery Details</h2>

            <FormField
              control={form.control}
              name="deliveryAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-dark-text">
                    Delivery Address
                  </FormLabel>
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
              name="deliveryState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-dark-text">State</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={zonesLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue
                          placeholder={
                            zonesLoading
                              ? "Loading states..."
                              : "Select your state"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {deliveryZones?.map((zone) => (
                        <SelectItem key={zone.state} value={zone.state}>
                          {zone.state_display} — ₦
                          {Number(zone.fee).toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {deliveryZones?.length === 0 && !zonesLoading && (
                    <p className="text-sm text-amber-600">
                      We currently don&apos;t deliver to any listed states —
                      please choose pickup instead.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-dark-text">
                    Delivery Date
                  </FormLabel>
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
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">Pickup Details</h2>

            <FormField
              control={form.control}
              name="pickupDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-dark-text">
                    Pickup Date
                  </FormLabel>
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
              name="pickupTimeSlot"
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
          </>
        )}

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
                  placeholder={
                    fulfillmentType === "delivery"
                      ? "Any special delivery instructions"
                      : "Any special pickup instructions"
                  }
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
              <span>{fulfillmentType === "delivery" ? "Delivery" : "Pickup"}</span>
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