import image2 from "@/assets/images/14.webp";
import image3 from "@/assets/images/15.webp";
import image4 from "@/assets/images/16.webp";
import image5 from "@/assets/images/17.webp";
import image6 from "@/assets/images/18.webp";
import image1 from "@/assets/images/19.webp";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { CORE_VALUES, MISSION, VISION } from "./data";

const IMAGES = [image1, image2, image3, image4];

export default function Page() {
  return (
    <main className="space-y-8 pb-12">
      <section className="bg-primary-100">
        <Container className="text-dark-text py-12 text-center max-lg:py-8">
          <h2
            className={cn(
              "mb-3 text-2xl font-semibold lg:text-4xl",
              poltawskiNowy.className,
            )}
          >
            About Us
          </h2>
          <p className="mb-8">Indulge Your Cravings</p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {IMAGES.map((image, index) => (
              <div
                key={index}
                className="aspect-[300/250] overflow-hidden rounded-lg max-lg:aspect-[300/220]"
              >
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  height={100}
                  width={100}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
      <Container className="space-y-8 py-6">
        <h5
          className={cn(
            "text-dark-text mx-auto w-fit text-center text-2xl font-semibold lg:text-4xl",
            poltawskiNowy.className,
          )}
        >
          Our Story
          <div className="bg-primary h-[2px] w-8 rounded-xs max-lg:w-5" />
        </h5>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[4fr_5fr] lg:items-center">
          <div className="aspect-[522/505]">
            <Image
              src={image5}
              alt="Our Story"
              className="h-full w-full object-cover"
              height={100}
              width={100}
              quality={100}
            />
          </div>
          <div className="text-dark-text space-y-4">
            <p className="leading-loose">
              The name M and C comes from the initials of two sisters, Mary and
              Clara, who share a passion for pastry and baking arts. At just
              eight years old, she fell in love with baking, igniting a love for
              pastry that would shape her future. In 2016, Mary took her skills
              to the next level by earning a prestigious Cake Design Certificate
              from Lambert Academy, solidifying her expertise in crafting
              stunning confections.  
            </p>
            <p className="leading-loose">
              Clara began baking in 2014 while pursuing a master&apos;s degree
              in international business.In 2015, the sisters decided to combine
              their individual strengths—Mary’s technical artistry and Clara’s
              entrepreneurial acumen. Together, they founded M and C Cakes, with
              a mission to infuse creativity, elegance, and professionalism into
              every creation. Over the years, their business has become
              synonymous with bespoke designs, impeccable flavors, and a
              commitment to making every occasion unforgettable.
            </p>
          </div>
        </div>
      </Container>
      <Container className="space-y-8 py-6">
        <div className="space-y-3">
          <h5
            className={cn(
              "text-dark-text mx-auto w-fit text-center text-2xl font-semibold lg:text-4xl",
              poltawskiNowy.className,
            )}
          >
            Our Purpose
            <div className="bg-primary h-[2px] w-8 rounded-xs max-lg:w-5" />
          </h5>
          <p className="text-dark-text text-center">
            Your trusted partner in making every occasion deliciously special
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="bg-custom-green-100 space-y-6 rounded-lg px-6 py-8">
            <h6
              className={cn(
                "text-dark-text text-center text-xl font-semibold lg:text-3xl",
                poltawskiNowy.className,
              )}
            >
              Mission
            </h6>
            <ul className="space-y-3">
              {MISSION.map((item, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <ChevronRightIcon className="text-dark-text h-4 w-4 lg:h-6 lg:w-6" />
                  <p className="flex-1">{item}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-custom-green-100 space-y-6 rounded-lg px-6 py-8">
            <h6
              className={cn(
                "text-dark-text text-center text-xl font-semibold lg:text-3xl",
                poltawskiNowy.className,
              )}
            >
              Vision
            </h6>
            <ul className="space-y-3">
              {VISION.map((item, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <ChevronRightIcon className="text-dark-text h-4 w-4 lg:h-6 lg:w-6" />
                  <p className="flex-1">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
      <Container className="grid grid-cols-1 items-center gap-8 gap-x-12 py-6 lg:grid-cols-2">
        <div className="aspect-[648/353] max-lg:aspect-[343/186]">
          <Image
            src={image6}
            alt="About Us"
            className="h-full w-full object-cover"
            height={100}
            width={100}
          />
        </div>
        <div className="space-y-8 lg:space-y-12">
          <div className="space-y-3">
            <h5
              className={cn(
                "text-dark-text mx-auto text-2xl font-semibold lg:text-4xl",
                poltawskiNowy.className,
              )}
            >
              Our Core Values
              <div className="bg-primary h-[2px] w-8 rounded-xs max-lg:w-5" />
            </h5>
            <p>
              At the heart of everything we do are values that guide us, these
              principles drive our commitment to excellence and responsibility.
            </p>
          </div>
          <Button size={"lg"} className="w-36 lg:w-40">
            Order now
          </Button>
        </div>
      </Container>
      <Container className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {CORE_VALUES.map((value, index) => (
          <div key={index} className="rounded-xl bg-[#D1709B] p-5 text-white">
            <div className="mb-4 flex w-fit items-center justify-center rounded-xl bg-white p-1.5">
              <value.icon className="text-primary h-8 w-8" />
            </div>
            <h2
              className={cn(
                "text-lg font-semibold max-lg:text-base",
                poltawskiNowy.className,
              )}
            >
              {value.title}
            </h2>
            <p className="font-light max-lg:text-sm">{value.desc}</p>
          </div>
        ))}
        <div className="space-y-4 max-md:aspect-[343/222]">
          <div className="space-y-1.5 rounded bg-[#D1709B] px-4 py-4 text-center text-white max-lg:py-6">
            <h2
              className={cn(
                "text-4xl font-semibold max-lg:text-2xl",
                poltawskiNowy.className,
              )}
            >
              10+
            </h2>
            <p className="font-light max-lg:text-sm">Years of Experience</p>
          </div>
          <div className="space-y-1.5 rounded bg-[#D1709B] px-4 py-4 text-center text-white max-lg:py-6">
            <h2
              className={cn(
                "text-4xl font-semibold max-lg:text-2xl",
                poltawskiNowy.className,
              )}
            >
              1000+
            </h2>
            <p className="font-light max-lg:text-sm">Happy Customers</p>
          </div>
        </div>
      </Container>
    </main>
  );
}
