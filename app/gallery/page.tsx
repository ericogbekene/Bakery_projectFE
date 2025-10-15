import Container from "@/components/shared/container";
import MenuHero from "@/components/shared/menu-hero";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { GALLERY } from ".";

export default function Page() {
  return (
    <main className="pb-12">
      <MenuHero hideButton />
      <Container className="my-8 mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:my-16 lg:mt-16 lg:grid-cols-3">
        {GALLERY.map((item, index) => (
          <div key={index}>
            <div className="bg-primary-300 flex aspect-[380/306] items-center justify-center overflow-hidden rounded-t">
              <Image
                src={item.image}
                alt={item.title}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-dark-text px-3 py-4 text-center">
              <h6
                className={cn(
                  "mb-2 text-lg font-semibold lg:text-xl",
                  poltawskiNowy.className,
                )}
              >
                {item.title}
              </h6>
            </div>
          </div>
        ))}
      </Container>
    </main>
  );
}
