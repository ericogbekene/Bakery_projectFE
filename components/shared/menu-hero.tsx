import image from "@/assets/images/32.webp";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Container from "./container";
import Link from "next/link";

const MenuHero = ({ hideButton = false }: { hideButton?: boolean }) => {
  return (
    <>
      <section
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${image.src})`,
        }}
        className="flex h-80 items-center justify-center bg-cover bg-center bg-no-repeat text-white max-lg:h-64"
      >
        <Container
          className={cn(
            "max-w-4xl text-center text-2xl leading-relaxed font-semibold tracking-wide lg:text-5xl",
            poltawskiNowy.className,
          )}
        >
          Scroll down and browse through our{" "}
          <span className="text-primary">amazing</span> menu
        </Container>
      </section>
      {!hideButton && (
        <Container className="mt-16">
          <Button
            className="border-primary text-primary bg-transparent text-base font-medium"
            size="lg"
            variant={"outline"}
            asChild
          >
            <Link href="/custom-order">Make custom orders</Link>
          </Button>
        </Container>
      )}
    </>
  );
};

export default MenuHero;
