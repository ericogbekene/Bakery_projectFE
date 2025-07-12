import Container from "@/components/shared/container";
import MenuHero from "@/components/shared/menu-hero";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CAKE_ITEMS } from ".";

export default function Page() {
  return (
    <main className="pb-12">
      <MenuHero />
      <Container className="my-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:my-16 lg:mt-8 lg:grid-cols-3">
        {CAKE_ITEMS.map((item, index) => (
          <div key={index} className="shadow-md">
            <div className="bg-primary-300 flex aspect-[380/306] items-center justify-center overflow-hidden rounded-t">
              <Image
                src={item.image}
                alt={item.title}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="space-y-1 px-3 py-4">
              <h6
                className={cn(
                  "text-dark-text mb-2 text-lg font-semibold lg:text-xl",
                  poltawskiNowy.className,
                )}
              >
                {item.title}
              </h6>
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold">{item.desc}</span>
                <Link href={item.link}>
                  <button className="border-text flex h-10 w-10 items-center justify-center rounded-full border">
                    <ArrowRightIcon className="text-text h-5 w-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Container>
      <Container className="bg-custom-green-100 my-8 w-[95%] py-8 text-center lg:mt-12 lg:py-12">
        <h4
          className={cn(
            "text-dark-text mb-6 text-4xl font-semibold max-lg:text-2xl",
            poltawskiNowy.className,
          )}
        >
          About our cakes
        </h4>
        <div className="space-y-4">
          <p>
            At our bakery, every cake tells a story. From the first whisk to the
            final touch, we put care and craftsmanship into every creation,
            ensuring that each cake is as unique and special as the occasion it
            celebrates. Using only the finest ingredients—locally sourced and
            handpicked for quality—we bake with passion, bringing you fresh,
            flavorful, and unforgettable desserts.
          </p>
          <p>
            Our Cakes are covered with Swiss meringue buttercream, also known as
            SMBC, is a buttercream frosting recipe made with egg whites, sugar,
            butter, vanilla extract, and a pinch of salt. This buttercream is
            creamy, thick, buttery, and holds well in shape, which makes it a
            very stable, light, and fluffy buttercream that is not too sweet and
            ideal for cakes.
          </p>
          <p>
            We offer a wide range of customizations, allowing you to personalize
            your cake to fit your vision perfectly. With our commitment to
            quality and creativity, you can trust us to deliver a cake that not
            only looks stunning but tastes amazing, too. Explore our collection
            and let us help make your celebration truly memorable!
          </p>
        </div>
      </Container>
    </main>
  );
}
