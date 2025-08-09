"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const FLAVOURS = [
  "Vanilla",
  "Chocolate",
  "Red velvet",
  "Coconut",
  "Marble",
  "Fruit cake",
];
const SIZES = ["6 inches", "8 inches", "10 inches", "12 inches", "14 inches"];
const COLOURS = ["White", "Pink", "Blue", "Purple", "Green", "Yellow"];
const EXTRAS = [
  { name: "Cake topper", price: 1500 },
  { name: "Candle", price: 2000 },
  { name: "Birthday card", price: 2000 },
  { name: "Chocolate", price: 3000 },
  { name: "Wine", price: 12000 },
  { name: "200ml whiskey", price: 8000 },
] as const;

const formSchema = z.object({
  flavour: z.array(z.string()).min(1, { message: "Select at least 1" }).max(2),
  size: z.string().min(1, { message: "Select size" }),
  colours: z.array(z.string()).min(1).max(2),
  extras: z.record(z.string(), z.number().min(0)),
  notes: z.string().optional(),
});

type FormType = z.infer<typeof formSchema>;

function CheckboxItem({
  value,
  selected,
  onToggle,
}: {
  value: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between px-3 py-2 text-sm",
        selected && "text-primary font-medium",
      )}
      onClick={onToggle}
    >
      {value}
      {selected && <span className="text-primary">●</span>}
    </button>
  );
}

const OrderForm = () => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flavour: [],
      size: "",
      colours: [],
      extras: EXTRAS.reduce(
        (acc, e) => ({ ...acc, [e.name]: 0 }),
        {} as Record<string, number>,
      ),
      notes: "",
    },
  });

  const watchExtras = form.watch("extras");
  const watchSize = form.watch("size");

  const extrasPrice = useMemo(() => {
    return Object.entries(watchExtras).reduce((sum, [key, qty]) => {
      const extra = EXTRAS.find((e) => e.name === key);
      return sum + (extra ? extra.price * qty : 0);
    }, 0);
  }, [watchExtras]);

  const basePrice = useMemo(() => {
    switch (watchSize) {
      case "6 inches":
        return 10000;
      case "8 inches":
        return 15000;
      case "10 inches":
        return 20000;
      case "12 inches":
        return 25000;
      case "14 inches":
        return 30000;
      default:
        return 0;
    }
  }, [watchSize]);

  function handleSubmit(data: FormType) {
    console.log("Order submitted", data, (basePrice + extrasPrice));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Flavour */}
        <FormField
          control={form.control}
          name="flavour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flavour</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full justify-between"
                    >
                      {field.value.length ? field.value.join(", ") : "Max 2"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  {FLAVOURS.map((fl) => (
                    <CheckboxItem
                      key={fl}
                      value={fl}
                      selected={field.value.includes(fl)}
                      onToggle={() => {
                        const exists = field.value.includes(fl);
                        let next: string[];
                        if (exists) {
                          next = field.value.filter((v) => v !== fl);
                        } else {
                          next = [...field.value, fl].slice(-2);
                        }
                        field.onChange(next);
                      }}
                    />
                  ))}
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Size */}
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full justify-between"
                    >
                      {field.value || "Select"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  {SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      className="flex w-full items-center justify-start px-3 py-2 text-sm"
                      onClick={() => field.onChange(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Colours */}
        <FormField
          control={form.control}
          name="colours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colours</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full justify-between"
                    >
                      {field.value.length ? field.value.join(", ") : "Max 2"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="max-h-56 overflow-auto p-0">
                  {COLOURS.map((col) => (
                    <CheckboxItem
                      key={col}
                      value={col}
                      selected={field.value.includes(col)}
                      onToggle={() => {
                        const exists = field.value.includes(col);
                        let next: string[];
                        if (exists) {
                          next = field.value.filter((v) => v !== col);
                        } else {
                          next = [...field.value, col].slice(-2);
                        }
                        field.onChange(next);
                      }}
                    />
                  ))}
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Extras */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-2">
          {EXTRAS.map((extra) => (
            <FormField
              key={extra.name}
              control={form.control}
              name={`extras.${extra.name}` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{extra.name}</FormLabel>
                  <FormControl>
                    <div className="space-y-1">
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                        placeholder={`₦${extra.price.toLocaleString()} per piece`}
                        className="text-foreground"
                      />
                      <div className="hidden justify-end gap-2 lg:flex">
                        <Button
                          type="button"
                          size="icon"
                          className="bg-primary/20 text-primary hover:bg-primary/30 h-6 w-6"
                          onClick={() => field.onChange((field.value || 0) + 1)}
                        >
                          +
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          className="bg-primary/20 text-primary hover:bg-primary/30 h-6 w-6"
                          onClick={() =>
                            field.onChange(Math.max((field.value || 0) - 1, 0))
                          }
                          disabled={(field.value || 0) === 0}
                        >
                          -
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional notes</FormLabel>
              <FormControl>
                <Textarea
                  className="h-24"
                  placeholder="Tell us if you want a 'Happy Birthday' written on the cake or cake board or any extra information"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-end space-x-2">
            <span className="text-lg font-medium">Price</span>
            <span className="text-lg font-bold">
              ₦ {(basePrice + extrasPrice).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center lg:justify-end">
            <Button
              disabled={basePrice + extrasPrice === 0}
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
  );
};
export default OrderForm;
