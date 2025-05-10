import { Quote, User } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Linda Malgwi",
    feedback:
      "Very tasty, delicious and fresh.... amazing customer service. Ordering was simple and delivery time was accurate.",
  },
  {
    id: 2,
    name: "Gb Olulu",
    feedback:
      "5 stars! All pastries are on point, especially the wheat bread. I’d recommend over and over again.",
  },
  {
    id: 3,
    name: "Felix Gbinda",
    feedback:
      "M&C is a slice of heaven. Their pastries and cakes are very delicious. The plain croissant was yum, everything came out fresh.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="w-full max-w-[1248px] mx-auto px-4 py-12 text-center">
      {/* Heading */}
      <h2 className="text-3xl font-semibold text-gray-800 font-nowy mb-4">
        Clients Testimonials
      </h2>

      {/* Testimonials Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="relative bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4 items-start"
          >
            {/* Quote Icon */}
            <Quote className="absolute top-4 right-4 text-black text-2xl" />

            {/* Profile Placeholder */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-300">
                <User className="text-gray-600 w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {testimonial.name}
              </h3>
            </div>

            {/* Testimony */}
            <p className="text-gray-600 text-left">{testimonial.feedback}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
