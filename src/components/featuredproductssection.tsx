import Link from 'next/link';
import { CircleArrowRight } from 'lucide-react';

const FeaturedSection = () => {
  const categories = [
    { name: "4 layered butter cream cake", price: "From 40,000", link: "/cakes" },
    { name: "4 layered butter cream cake", price: "From 20,000", link: "/pastries" },
    { name: "Cookies", price: "2,000", link: "/loaves" },
    { name: "2 tiered wedding cake", price: "220,000", link: "/pastries" },
    { name: "Coconut loaf cake", price: "6,000", link: "/loaves" },
    { name: "2 layered butter cream cake", price: "From 20,000", link: "/loaves" }
  ];

  return (
    <section className="w-full max-w-[1248px] mx-auto flex flex-col items-center text-center gap-10 px-4 my-12">
      {/* Header */}
      <div className='flex flex-col items-center'>
        <h2 className="text-3xl font-semibold text-gray-800 font-nowy">Featured Products</h2>
        </div>

      {/* Categories Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 w-full">
        {categories.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-4 w-full"
          >
            {/* Image Box - Responsive sizing */}
            <div className="w-full h-[250px] sm:h-[300px] lg:h-[335px] bg-pink-100 rounded-t-[12px]"></div>

            {/* Text and Link */}
        <div className='w-full shadow-[0px_4px_4px_1px_rgba(0,0,0,0.1)] pb-3 px-2.5'>
        <h4 className='text-lg sm:text-xl font-semibold text-gray-800 font-nowy text-left w-full'>{item.name}</h4>
            <div className="w-full flex justify-between items-center font-sans text-neutral-500 ">
              <span className=" ">
              {item.price}
              </span>
              <Link href={item.link} className="font-medium flex items-center gap-1">
                < CircleArrowRight size={24} />
              </Link>
            </div>
        </div>
          
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;