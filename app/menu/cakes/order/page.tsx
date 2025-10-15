import image from "@/assets/images/13.webp";
import Container from "@/components/shared/container";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Image from "next/image";
import OrderForm from "./order-form";

export default function Page() {
  return (
    <main>
      <Container className="my-8 grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-[1fr_2fr] lg:items-start">
        <div>
          <div className="bg-primary-100 flex aspect-[380/306] items-center justify-center overflow-hidden rounded-t">
            <Image
              src={image}
              alt="image"
              height={200}
              width={200}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <div>
          <header className="mb-8 space-y-1">
            <h3
              className={cn(
                poltawskiNowy.className,
                "text-dark-text text-xl font-semibold lg:text-2xl",
              )}
            >Butterfly</h3>
            <p>Butterfly is a 2 layered buttercream covered cake</p>
          </header>
          <OrderForm />
        </div>
      </Container>
    </main>
  );
}
