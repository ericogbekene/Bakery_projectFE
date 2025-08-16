import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserIcon } from "lucide-react";
import Container from "../shared/container";

const TESTIMONIALS = [
  {
    name: "Linda Malgwi",
    feedback:
      "Very tasty, delicious and fresh.... amazing customer service. Ordering was simple and delivery time was accurate.",
  },
  {
    name: "GB Olulu",
    feedback:
      "5 stars! All pastries are on point, especially the wheat bread. I’d recommend over and over again.",
  },
  {
    name: "Felix Gbinda",
    feedback:
      "M&C is a slice of heaven. Their pastries and cakes are very delicious. The plain croissant was yum, everything came out fresh. ",
  },
];

const ClientTestimonials = () => {
  return (
    <Container className="space-y-8 py-8 lg:py-12">
      <h4
        className={cn(
          "text-dark-text text-center text-2xl font-semibold max-lg:text-lg",
          poltawskiNowy.className,
        )}
      >
        Client Testimonials
      </h4>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial, index) => (
          <div
            key={index}
            className="mx-auto flex items-start gap-4 rounded-lg bg-white p-6 py-4 shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#CBC9C9]">
              <UserIcon className="text-text h-8 w-8" />
            </div>
            <div className="flex-1 space-y-1">
              <header className="flex items-center justify-between">
                <h5
                  className={cn(
                    "text-dark-text font-semibold lg:text-lg",
                    poltawskiNowy.className,
                  )}
                >
                  {testimonial.name}
                </h5>
                <FontAwesomeIcon icon={faQuoteRight} className="h-5 w-5" />
              </header>
              <p className="text-sm lg:text-base">{testimonial.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ClientTestimonials;
