import image from "@/assets/images/11.webp";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Container from "../shared/container";
import { Button } from "../ui/button";
import Link from "next/link";

const CallToAction = () => {
  return (
    <Container
      className={`mx-auto my-8 flex aspect-[343/131] w-[95%] flex-col items-center justify-center gap-8 rounded-lg bg-cover bg-center bg-no-repeat px-4 py-8 text-center lg:my-12 lg:aspect-[1248/352] lg:px-8 lg:py-12`}
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${image.src})`,
      }}
    >
      <h5
        className={cn(
          "text-4xl font-semibold text-white max-lg:text-xl",
          poltawskiNowy.className,
        )}
      >
        Give your tastebuds the treat it deserves
      </h5>
      <Button size={"lg"} className="w-40 max-lg:w-36" asChild>
        <Link href="/custom-order">Order now</Link>
      </Button>
    </Container>
  );
};

export default CallToAction;
