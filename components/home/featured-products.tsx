import image1 from "@/assets/images/4.webp";
import image2 from "@/assets/images/5.webp";
import image3 from "@/assets/images/6.webp";
import image4 from "@/assets/images/7.webp";
import image5 from "@/assets/images/8.webp";
import image6 from "@/assets/images/9.webp";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Container from "../shared/container";

const FEATURED_PRODUCTS = [
  {
    name: "4 layered butter cream cake",
    image: image1,
    price: 40000,
  },
  {
    name: "4 layered butter cream cake",
    image: image2,
    price: 20000,
  },
  {
    name: "Cookies",
    image: image3,
    price: 2000,
  },
  {
    name: "2 tiered wedding cake",
    image: image4,
    price: 80000,
  },
  {
    name: "Coconut loaf cake",
    image: image5,
    price: 25000,
  },
  {
    name: "2 layered butter cream cake",
    image: image6,
    price: 30000,
  },
];

const FeaturedProducts = () => {
  return (
    <Container className="space-y-8 py-12">
      <h4
        className={cn(
          "text-dark-text text-center text-2xl font-semibold max-lg:text-lg",
          poltawskiNowy.className,
        )}
      >
        Featured Products
      </h4>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {FEATURED_PRODUCTS.map((product, index) => (
          <div key={index} className="overflow-hidden rounded-t-lg">
            <div className="bg-primary-300 flex aspect-[380/306] items-center justify-center">
              <Image
                src={product.image}
                alt={product.name}
                height={100}
                width={100}
                className="aspect-[365/300] w-full max-w-xs object-contain"
              />
            </div>
            <div className="border p-4 shadow-lg">
              <p className="text-dark-text mb-1 font-semibold">
                {product.name}
              </p>
              <div className="flex items-center justify-between">
                <span>₦{product.price.toLocaleString()}</span>
                <button className="border-text flex h-10 w-10 items-center justify-center rounded-full border">
                  <ArrowRightIcon className="text-text h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default FeaturedProducts;
