import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CategoriesSection = () => {
  const categories = [
    { name: "Cakes", link: "/cakes" },
    { name: "Pastries", link: "/pastries" },
    { name: "Loaves", link: "/loaves" },
  ];

  return (
    <section className="w-full max-w-[1248px] mx-auto flex flex-col items-center text-center gap-10 px-4 my-12">
      {/* Header */}
      <div className='flex flex-col items-center'>
        <h2 className="text-3xl font-semibold text-gray-800 font-nowy">Browse through our category </h2>
        <p className="text-sm text-gray-600 mt-2 font-sans max-w-2xs">
        Browse through our categories and discover some mouth watering tasty treats.
        </p>
      </div>

      {/* Categories Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 w-full">
        {categories.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-4 w-full"
          >
            {/* Image Box - Responsive sizing */}
            <div className="w-full h-[250px] sm:h-[300px] lg:h-[335px] bg-[#E2E7D7] rounded-[12px]"></div>

            {/* Text and Link */}
            <div className="w-full flex justify-between items-center">
              <span className="text-lg sm:text-xl font-semibold text-gray-800 font-nowy ">
                {item.name}
              </span>
              <Link href={item.link} className="text-[#C3AA68] font-medium flex items-center gap-1">
                <span>Explore</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;