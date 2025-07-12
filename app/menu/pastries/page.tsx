import Container from "@/components/shared/container";
import MenuHero from "@/components/shared/menu-hero";
import { Button } from "@/components/ui/button";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PASTRIES } from ".";

export default function Page() {
  return (
    <main className="pb-12">
      <MenuHero />
      <Container className="my-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:my-16 lg:mt-8 lg:grid-cols-3">
        {PASTRIES.map((item, index) => (
          <div key={index} className="shadow-md">
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
              <p>{item.desc}</p>
              <Button
                className="text-primary hover:text-primary-700 mx-auto block w-fit text-base underline"
                variant="link"
              >
                Order now
              </Button>
            </div>
          </div>
        ))}
      </Container>
    </main>
  );
}
