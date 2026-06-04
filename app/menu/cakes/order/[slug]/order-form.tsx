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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { AddonInput, cartService } from "@/lib/services/cart-service";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const LEGACY_TYPES = ["topper", "candle", "birthday_card", "chocolate", "wine", "whiskey"];

const LEGACY_ADDON_MAP: Record<string, string> = {
  topper: "cake_topper",
  candle: "candle",
  birthday_card: "birthday_card",
  chocolate: "chocolate",
  wine: "wine",
  whiskey: "whiskey_200ml",
};

const SIZE_TO_DJANGO: Record<string, string> = {
  "6 Inches": "6",
  "8 Inches": "8",
  "10 Inches": "10",
  "12 Inches": "12",
  "14 Inches": "14",
};

const COLOURS = ["White", "Pink", "Blue", "Purple", "Green", "Yellow"];

const formSchema = z.object({
  flavour: z.array(z.string()).min(1, { message: "Select at least 1 flavour" }).max(2),
  size: z.string().min(1, { message: "Select a size" }),
  colours: z.array(z.string()).min(1, { message: "Select at least 1 colour" }).max(2),
  legacy_extras: z.record(z.string(), z.number().min(0)),
  dynamic_extras: z.record(z.string(), z.number().min(0)),
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

interface OrderFormProps {
  productId: number;
  slug: string;
}

const OrderForm = ({ productId, slug }: OrderFormProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: customizeData, isLoading } = useQuery({
    queryKey: ["cake-customize", slug],
    queryFn: () => cartService.getCakeCustomizationOptions(slug),
  });

  const options = customizeData?.customization_options;
  const legacyAddons = options?.addons.filter((a) => LEGACY_TYPES.includes(a.type)) ?? [];
  const dynamicAddons = options?.addons.filter((a) => !LEGACY_TYPES.includes(a.type)) ?? [];
  const flavors = options?.flavors ?? [];
  const sizes = options?.sizes ?? [];

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flavour: [],
      size: "",
      colours: [],
      legacy_extras: {},
      dynamic_extras: {},
      notes: "",
    },
  });

  const watchSize = form.watch("size");
  const watchLegacyExtras = form.watch("legacy_extras");
  const watchDynamicExtras = form.watch("dynamic_extras");

  const totalPrice = useMemo(() => {
    if (!options) return 0;
    const basePrice = Number(customizeData?.price ?? 0);
    const sizeOption = sizes.find((s) => s.display === watchSize);
    const sizeMultiplier = sizeOption ? Number(sizeOption.multiplier) : 1;
    const sizedPrice = basePrice * sizeMultiplier;

    const legacyCost = legacyAddons.reduce((sum, addon) => {
      const qty = watchLegacyExtras[addon.name] ?? 0;
      return sum + Number(addon.price) * qty;
    }, 0);

    const dynamicCost = dynamicAddons.reduce((sum, addon) => {
      const qty = watchDynamicExtras[addon.name] ?? 0;
      return sum + Number(addon.price) * qty;
    }, 0);

    return sizedPrice + legacyCost + dynamicCost;
  }, [watchSize, watchLegacyExtras, watchDynamicExtras, options, sizes, legacyAddons, dynamicAddons, customizeData]);

  async function handleSubmit(data: FormType) {
    setIsSubmitting(true);

    try {
      const legacyFields: Record<string, number> = {};
      legacyAddons.forEach((addon) => {
        const djangoField = LEGACY_ADDON_MAP[addon.type];
        if (djangoField) {
          legacyFields[djangoField] = data.legacy_extras[addon.name] ?? 0;
        }
      });

      const dynamicAddonInputs: AddonInput[] = dynamicAddons
        .filter((addon) => (data.dynamic_extras[addon.name] ?? 0) > 0)
        .map((addon) => ({
          addon_id: addon.id,
          quantity: data.dynamic_extras[addon.name],
        }));

      const payload = {
        product_id: productId,
        quantity: 1,
        flavour_1: data.flavour[0] ?? "",
        flavour_2: data.flavour[1] ?? "",
        size: SIZE_TO_DJANGO[data.size] ?? data.size,
        colours: data.colours.join(", "),
        ...legacyFields,
        addons: dynamicAddonInputs,
        additional_notes: data.notes ?? "",
      };

      await cartService.addToCart(payload);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
      window.location.href = "/cart";
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to add to cart");
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 rounded-md bg-gray-200" />
        ))}
      </div>
    );
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
                    <Button variant="outline" type="button" className="w-full justify-between">
                      {field.value.length ? field.value.join(", ") : "Max 2"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  {flavors.map((fl) => (
                    <CheckboxItem
                      key={fl.id}
                      value={fl.name}
                      selected={field.value.includes(fl.name)}
                      onToggle={() => {
                        const exists = field.value.includes(fl.name);
                        field.onChange(
                          exists
                            ? field.value.filter((v) => v !== fl.name)
                            : [...field.value, fl.name].slice(-2),
                        );
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
                    <Button variant="outline" type="button" className="w-full justify-between">
                      {field.value || "Select"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  {sizes.map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      className="flex w-full items-center justify-start px-3 py-2 text-sm hover:bg-gray-100"
                      onClick={() => field.onChange(sz.display)}
                    >
                      {sz.display}
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
                    <Button variant="outline" type="button" className="w-full justify-between">
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
                        field.onChange(
                          exists
                            ? field.value.filter((v) => v !== col)
                            : [...field.value, col].slice(-2),
                        );
                      }}
                    />
                  ))}
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Legacy Addons */}
        {legacyAddons.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-medium">Add-ons</p>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-2">
              {legacyAddons.map((addon) => (
                <FormField
                  key={addon.id}
                  control={form.control}
                  name={`legacy_extras.${addon.name}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{addon.name}</FormLabel>
                      <FormControl>
                        <div className="space-y-1">
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10);
                              field.onChange(isNaN(v) ? 0 : v);
                            }}
                            placeholder={`₦${Number(addon.price).toLocaleString()} per piece`}
                            className="text-foreground"
                            min="0"
                          />
                          <div className="hidden justify-end gap-2 lg:flex">
                            <Button type="button" size="icon"
                              className="bg-primary/20 text-primary hover:bg-primary/30 h-6 w-6"
                              onClick={() => field.onChange((field.value || 0) + 1)}
                            >+</Button>
                            <Button type="button" size="icon"
                              className="bg-primary/20 text-primary hover:bg-primary/30 h-6 w-6"
                              onClick={() => field.onChange(Math.max((field.value || 0) - 1, 0))}
                              disabled={(field.value || 0) === 0}
                            >-</Button>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Addons */}
        {dynamicAddons.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-medium">Extra Options</p>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-2">
              {dynamicAddons.map((addon) => (
                <FormField
                  key={addon.id}
                  control={form.control}
                  name={`dynamic_extras.${addon.name}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{addon.name}</FormLabel>
                      <FormControl>
                        <div className="space-y-1">
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10);
                              field.onChange(isNaN(v) ? 0 : v);
                            }}
                            placeholder={`₦${Number(addon.price).toLocaleString()} per piece`}
                            className="text-foreground"
                            min="0"
                          />
                          <div className="hidden justify-end gap-2 lg:flex">
                            <Button type="button" size="icon"
                              className="bg-primary/20 text-primary hover:bg-primary/30 h-6 w-6"
                              onClick={() => field.onChange((field.value || 0) + 1)}
                            >+</Button>
                            <Button type="button" size="icon"
                              className="bg-primary/20 text-primary hover:bg-primary/30 h-6 w-6"
                              onClick={() => field.onChange(Math.max((field.value || 0) - 1, 0))}
                              disabled={(field.value || 0) === 0}
                            >-</Button>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional notes</FormLabel>
              <FormControl>
                <Textarea
                  className="h-24"
                  placeholder="Tell us if you want a 'Happy Birthday' written on the cake or any extra information"
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
              ₦{totalPrice.toLocaleString()}
            </span>
          </div>
          <Button
            disabled={totalPrice === 0 || isSubmitting}
            type="submit"
            size="lg"
            className="ml-auto w-full lg:w-44"
          >
            {isSubmitting ? "Adding..." : "Add to cart"}
          </Button>
        </div>

      </form>
    </Form>
  );
};

export default OrderForm;