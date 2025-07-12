import image1 from "@/assets/images/13.webp";
import image2 from "@/assets/images/2.webp";
import image3 from "@/assets/images/3.webp";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Container from "../shared/container";
import { Button } from "../ui/button";

const CATEGORIES = [
  {
    item: "Cakes",
    image: image1,
    link: "/menu/cakes",
  },
  {
    item: "Pastries",
    image: image2,
    link: "/menu/pastries",
  },
  {
    item: "Loaves",
    image: image3,
    link: "/menu/loaves",
  },
];

const HomeCategories = () => {
  return (
    <Container className="space-y-8 pt-16 pb-8">
      <header className="space-y-4 text-center">
        <h4
          className={cn(
            "text-dark-text text-3xl font-semibold max-lg:text-xl",
            poltawskiNowy.className,
          )}
        >
          Browse through our category{" "}
        </h4>
        <p>
          Browse through our categories and discover some mouth watering tasty
          treats.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category, index) => (
          <div key={index} className="space-y-4">
            <div className="bg-custom-green-100 flex aspect-[383/335] items-center justify-center rounded-xl">
              <Image
                src={category.image}
                alt="image"
                height={100}
                width={100}
                className="aspect-[365/272] w-full max-w-xs object-contain"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-text font-semibold">
                {category.item}
              </span>
              <Button variant={"ghost"} size={"lg"} asChild>
                <Link
                  href={category.link}
                  className="text-gold-400 flex items-center space-x-2 text-base"
                >
                  Explore <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default HomeCategories;
