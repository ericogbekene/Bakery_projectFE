"use client";

import image from "@/assets/images/2.webp";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import z from "zod";

export default function Page() {
  const formSchema = z.object({
    quantity: z.number().int().min(6, { message: "Minimum is half dozen (6)" }),
    notes: z
      .string()
      .max(500, { message: "Maximum 500 characters" })
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 6,
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Add to cart:", values);
  };

  return (
    <main className="pb-12">
      <Container className="mt-6 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-[2fr_3fr]">
        <div className="bg-primary-100 flex items-center justify-center rounded py-8">
          <Image
            src={image}
            alt="Cream Filled Doughnut"
            className="w-full max-w-xs! object-contain"
            height={300}
            width={300}
          />
        </div>

        <div className="text-dark-text space-y-6">
          <div>
            <h2
              className={cn(
                "text-2xl font-semibold lg:text-3xl",
                poltawskiNowy.className,
              )}
            >
              Cream Filled Doughnut
            </h2>
            <p className="mt-1 text-sm opacity-80">
              Butterfly is a 2 layered buttercream covered cake
            </p>
          </div>

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
                      <Input
                        type="number"
                        min={6}
                        step={1}
                        placeholder="Minimum, half dozen"
                        className="h-11"
                        value={
                          Number.isNaN(field.value as unknown as number)
                            ? 0
                            : field.value
                        }
                        onChange={(e) => {
                          const next =
                            e.currentTarget.value === ""
                              ? 0
                              : e.currentTarget.valueAsNumber;
                          field.onChange(next);
                        }}
                        name={field.name}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
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
                        placeholder="Tell us if you want a 'Happy Birthday' written on the cake or cake board or any extra information"
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
                  <span className="text-lg font-bold">₦ 0</span>
                </div>
                <div className="flex items-center lg:justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    className="ml-auto w-full lg:w-44"
                  >
                    Add to cart
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
