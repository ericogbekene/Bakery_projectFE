import image from "@/assets/images/10.webp";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Container from "../shared/container";
import { Button } from "../ui/button";

const WHY_CHOOSE_US = [
  {
    title: "Quality Ingredients & Freshness",
    description:
      "We deliver superior taste by baking fresh daily with high-quality ingredients. You’ll enjoy the authentic, home-baked flavors that mass-produced goods can’t replicate, making every bite an indulgent experience.",
  },
  {
    title: "Customization & Personal Touch",
    description:
      "We offer personalized services for events such as birthdays, weddings, and celebrations. Whether it's a custom-designed cake or a special order of pastries, you get a bespoke experience that caters to your unique needs.",
  },
  {
    title: "Unmatched flavour",
    description:
      "A bakery delivers superior taste by baking fresh daily with high-quality ingredients. You’ll enjoy the authentic, home-baked flavors that mass-produced goods can’t replicate, making every bite an indulgent experience.",
  },
];

const WhyChooseUs = () => {
  return (
    <Container className="lg:bg-custom-green-100 space-y-8 rounded-lg py-8 lg:w-[95%] lg:py-12">
      <h4
        className={cn(
          "text-dark-text text-center text-2xl font-semibold max-lg:text-lg",
          poltawskiNowy.className,
        )}
      >
        Why Choose Us
      </h4>
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <div className="flex items-center justify-center">
          <Image
            src={image}
            alt="Why Choose Us"
            className="aspect-[620/510] w-full rounded-xs object-cover max-lg:aspect-[343/282]"
            height={300}
            width={300}
          />
        </div>
        <div className="space-y-6">
          {WHY_CHOOSE_US.map((item, index) => (
            <div key={index} className="space-y-2">
              <h6
                className={cn(
                  "font-semibold lg:text-lg",
                  poltawskiNowy.className,
                )}
              >
                {item.title}
              </h6>
              <p>{item.description}</p>
            </div>
          ))}
          <Button size={"lg"} className="w-40 max-lg:hidden">
            Order now
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default WhyChooseUs;
