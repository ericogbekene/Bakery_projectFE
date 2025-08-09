import cakeImage from "@/assets/images/4.webp";
import { Button } from "@/components/ui/button";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Image from "next/image";

const CartItem = () => {
  const specs = [
    { label: "Size", value: "6 inches" },
    { label: "Card", value: "1" },
    { label: "Chocolate", value: "1" },
    { label: "Candle", value: "6" },
    { label: "Colour", value: "Blue and white" },
    { label: "Cake topper", value: "1" },
    { label: "Card", value: "1" },
    { label: "Wine", value: "1" },
    { label: "Whiskey", value: "1" },
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      <div className="shrink-0">
        <div className="bg-primary-100 flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl sm:h-48 sm:w-48 lg:h-56 lg:w-56">
          <Image
            src={cakeImage}
            alt="Baby shark cake"
            className="h-full w-full object-contain p-5"
            width={224}
            height={224}
            priority
          />
        </div>
      </div>

      <div className="flex-1">
        <h3
          className={cn(
            poltawskiNowy.className,
            "text-dark-text text-lg font-semibold md:text-xl",
          )}
        >
          Baby shark 4 layered butter cream cake
        </h3>
        <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm md:text-base">
          {specs.map((s, idx) => (
            <li key={`${s.label}-${idx}`} className="whitespace-nowrap">
              <span>{s.label}:</span> {s.value}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary-50 h-11 w-full sm:w-44"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

const CartItems = () => {
  return (
    <div className="space-y-6">
      <CartItem />
    </div>
  );
};
export default CartItems;
