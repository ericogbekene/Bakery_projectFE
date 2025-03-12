import { Button } from '@/components/ui/button';
import Image from 'next/image';
import NewFrame from "@/public/images/Frame 369.jpg"

const WhyChooseUs = () => {
  return (
    <section className="mt-16 py-12 w-full max-w-[1248px] mx-auto sm:bg-[#E2E7D7] bg-transparent rounded-lg">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-3xl font-semibold text-gray-800 font-nowy text-center mb-12">Why Choose Us</h2>
        
        {/* Responsive Layout Container */}
        <div className="flex flex-col md:flex-row gap-8 items-center">
          
          {/* Left Column - Image */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <div className="relative w-full h-[400px]">
              <Image 
                src={NewFrame}
                alt="Why Choose Us" 
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="w-full md:w-1/2">
            <div className="space-y-8">
              {/* Paragraph 1 */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Quality Ingredients & Freshness</h3>
                <p className="text-gray-700">
                We deliver superior taste by baking fresh daily with high-quality ingredients. You’ll enjoy the authentic, home-baked flavors that mass-produced goods can’t replicate, making every bite an indulgent experience.
                </p>
              </div>
              
              {/* Paragraph 2 */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Customization & Personal Touch</h3>
                <p className="text-gray-700">
                We offer personalized services for events such as birthdays, weddings, and celebrations. Whether it's a custom-designed cake or a special order of pastries, you get a bespoke experience that caters to your unique needs.
                </p>
              </div>
              
              {/* Paragraph 3 */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Unmatched flavour</h3>
                <p className="text-gray-700">
                A bakery delivers superior taste by baking fresh daily with high-quality ingredients. You’ll enjoy the authentic, home-baked flavors that mass-produced goods can’t replicate, making every bite an indulgent experience.
                </p>
              </div>
              
              {/* CTA Button */}
              <div className="pt-4">
              <Button
                size="sm"
                className="bg-[#C85387] hover:bg-pink-700 text-white px-8 py-6 text-lg cursor-pointer"
              >
                Order Now
              </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;