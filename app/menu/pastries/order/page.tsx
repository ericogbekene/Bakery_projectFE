"use client";

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
import { poltawskiNowy } from "@/lib/font";
import { cartService } from "@/lib/services/cart-service";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  quantity: z.number().int().min(1, { message: "Minimum quantity is 1" }),
  notes: z.string().max(500).optional(),
});

type FormType = z.infer<typeof formSchema>;

interface DjangoProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string | null;
  thumbnail_url: string | null;
  available: boolean;
}

export default function Page() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const productTitle = searchParams.get("title");

  const [product, setProduct] = useState<DjangoProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: { quantity: 1, notes: "" },
  });

  const quantity = form.watch("quantity") || 1;
  const unitPrice = product ? Number(product.price) : 0;
  const totalPrice = unitPrice * quantity;

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

    fetch(
      `${apiBase}/products/${searchParams.get("slug") || ""}?product_type=pastry&page_size=100`,
      {
        credentials: "include",
      },
    )
      .then((res) => res.json())
      .then((data) => {
        // data.results is array from list endpoint
        const results: DjangoProduct[] = data.results ?? [];
        const found = results.find((p) => String(p.id) === productId);
        setProduct(found ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  const onSubmit = async (values: FormType) => {
    if (!product) {
      alert("Product not found. Please go back and try again.");
      return;
    }

    try {
      await cartService.addToCart({
        product_id: product.id,
        quantity: values.quantity,
        additional_notes: values.notes ?? "",
        flavour_1: "",
        flavour_2: "",
        size: "",
        colours: "",
        cake_topper: 0,
        candle: 0,
        birthday_card: 0,
        chocolate: 0,
        wine: 0,
        whiskey_200ml: 0,
      });
      alert(`${product.name} added to cart!`);
      form.reset({ quantity: 1, notes: "" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to add to cart";
      alert(message);
    }
  };

  return (
    <main className="pb-12">
      <Container className="mt-6 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-[2fr_3fr]">
        {/* Image */}
        <div className="bg-primary-100 flex items-center justify-center rounded py-8">
          {loading ? (
            <div className="h-64 w-64 animate-pulse rounded bg-gray-200" />
          ) : product?.thumbnail_url ? (
            <Image
              src={product.thumbnail_url}
              alt={product.name}
              height={300}
              width={300}
              className="w-full max-w-xs object-contain"
            />
          ) : (
            <div className="flex h-64 w-64 items-center justify-center rounded bg-gray-100 text-sm text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* Info + Form */}
        <div className="text-dark-text space-y-6">
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 w-2/3 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
            </div>
          ) : (
            <>
              <h2
                className={cn(
                  "text-2xl font-semibold lg:text-3xl",
                  poltawskiNowy.className,
                )}
              >
                {product?.name ?? productTitle ?? "Pastry"}
              </h2>
              {product?.description && (
                <p className="text-sm opacity-80">{product.description}</p>
              )}
              {product && (
                <p className="font-semibold text-gray-900">
                  ₦{Number(product.price).toLocaleString()} per piece
                </p>
              )}
            </>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Quantity
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-11 w-11 text-lg"
                          onClick={() =>
                            field.onChange(Math.max(1, (field.value || 1) - 1))
                          }
                          disabled={(field.value || 1) <= 1}
                        >
                          −
                        </Button>
                        <Input
                          type="number"
                          min={1}
                          className="h-11 w-20 text-center"
                          value={field.value || 1}
                          onChange={(e) => {
                            const next = parseInt(e.target.value, 10);
                            field.onChange(isNaN(next) || next < 1 ? 1 : next);
                          }}
                          name={field.name}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-11 w-11 text-lg"
                          onClick={() => field.onChange((field.value || 1) + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Additional notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-28"
                        placeholder="Any special instructions"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-lg font-medium">Price</span>
                  <span className="text-lg font-bold">
                    ₦{totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center lg:justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    className="ml-auto w-full lg:w-44"
                    disabled={!product || form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Adding..." : "Add to cart"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </Container>
    </main>
  );
}
