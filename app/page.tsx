import DonoughtIcon from "@/assets/icons/DonoughtIcon";
import heroImage from "@/assets/images/1.webp";
import heroImageMobile from "@/assets/images/12.webp";
import CallToAction from "@/components/home/call-to-action";
import HomeCategories from "@/components/home/categories";
import ClientTestimonials from "@/components/home/client-testimonials";
import FeaturedProducts from "@/components/home/featured-products";
import WhyChooseUs from "@/components/home/why-choose-us";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import {
  faFacebook,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <section className="bg-primary-100">
        <Container className="flex min-h-[calc(100vh-70px)] grid-cols-2 flex-col items-center gap-y-12 pt-8 pb-16 lg:grid">
          <div className="flex items-center justify-center lg:hidden">
            <Image
              src={heroImageMobile}
              alt="Hero Image"
              height={400}
              width={400}
              className="aspect-[201/172] w-full max-w-md object-contain"
            />
          </div>
          <div className="flex items-center gap-6 max-lg:flex-col">
            <div className="flex items-center gap-8 max-lg:order-2 max-lg:w-full lg:h-full lg:flex-col lg:justify-center">
              <Link href="#">
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="text-primary h-6 w-6"
                />
              </Link>
              <Link href="#">
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="text-primary h-6 w-6"
                />
              </Link>
              <Link href="#">
                <FontAwesomeIcon
                  icon={faTiktok}
                  className="text-primary h-6 w-6"
                />
              </Link>
            </div>
            <div className="flex-1 space-y-12 max-lg:order-1 max-lg:space-y-8">
              <div className="bg-primary-200 flex w-fit items-center space-x-4 rounded-lg px-3 py-2 max-lg:px-2 max-lg:py-1 max-lg:text-sm">
                <span className="text-primary font-medium">
                  More than delicious
                </span>
                <DonoughtIcon className="h-5 w-5" />
              </div>
              <div className="space-y-6">
                <h1
                  className={cn(
                    "text-dark-text text-6xl font-bold max-lg:text-4xl",
                    poltawskiNowy.className,
                  )}
                >
                  Freshly baked, <br /> from our oven to <br /> your{" "}
                  <span className="text-primary">heart</span>
                </h1>
                <p className="lg:text-lg">
                  From buttery snacks to delicious cakes, we bring you
                  irresistible treats baked daily with care. Every bite is a
                  moment of pure delight.
                </p>
              </div>
              <div className="flex items-center justify-start gap-6 max-lg:gap-4">
                <Button size="lg" className="lg:w-40">
                  Order now
                </Button>
                <Button
                  variant={"outline"}
                  size="lg"
                  className="border-primary text-primary hover:bg-primary-200 bg-transparent"
                >
                  Make custom order
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end max-lg:hidden">
            <Image
              src={heroImage}
              alt="Hero Image"
              height={400}
              width={400}
              className="aspect-[913/786] w-full max-w-xl object-contain"
            />
          </div>
        </Container>
      </section>
      <HomeCategories />
      <FeaturedProducts />
      <WhyChooseUs />
      <ClientTestimonials />
      <CallToAction />
    </main>
  );
}
