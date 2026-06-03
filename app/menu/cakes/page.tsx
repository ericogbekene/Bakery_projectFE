"use client";

import Container from "@/components/shared/container";
import MenuHero from "@/components/shared/menu-hero";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import categoryService, { Category } from "@/lib/services/category-service";

// Constants
const FALLBACK_IMAGE = '/images/categories/default-cake.png';

const IMAGE_MAP: Record<string, string> = {
  'birthday-cakes': '/images/categories/birthday-cake.png',
  'wedding-cakes': '/images/categories/wedding-cake.png',
  'cupcakes': '/images/categories/cupcakes.png',
  'celebration-cakes': '/images/categories/celebration-cake.png',
  'custom-cakes': '/images/categories/custom-cake.png',
  'cheesecakes': '/images/categories/cheesecake.png',
  'chocolate-cakes': '/images/categories/chocolate-cake.png',
  'fruit-cakes': '/images/categories/fruit-cake.png',
};

const DESCRIPTION_MAP: Record<string, string> = {
  'birthday-cakes': 'Perfect for birthdays and celebrations',
  'wedding-cakes': 'Elegant cakes for your special day',
  'cupcakes': 'Bite-sized treats for every occasion',
  'celebration-cakes': 'Make every moment memorable',
  'custom-cakes': 'Baked just the way you want',
};

// Helper functions
const getCategoryImage = (category: Category): string => {
  if (category.image_url) return category.image_url;
  return IMAGE_MAP[category.slug] || FALLBACK_IMAGE;
};

const getCategoryDescription = (category: Category): string => {
  if (category.description) return category.description;
  return DESCRIPTION_MAP[category.slug] || `Explore our ${category.name} collection`;
};

// Components
const CategorySkeleton = () => (
  <div className="shadow-md animate-pulse">
    <div className="bg-primary-300 flex aspect-[380/306] items-center justify-center overflow-hidden rounded-t bg-gray-200">
      <div className="h-full w-full bg-gray-300" />
    </div>
    <div className="space-y-1 px-3 py-4">
      <div className="bg-gray-200 h-6 w-3/4 rounded mb-2" />
      <div className="flex items-center justify-between gap-4">
        <div className="bg-gray-200 h-5 w-1/2 rounded" />
        <div className="bg-gray-200 h-10 w-10 rounded-full" />
      </div>
    </div>
  </div>
);

const AboutSection = () => (
  <Container className="bg-custom-green-100 my-8 w-[95%] py-8 text-center lg:mt-12 lg:py-12">
    <h4 className={cn(
      "text-dark-text mb-6 text-4xl font-semibold max-lg:text-2xl",
      poltawskiNowy.className
    )}>
      About our cakes
    </h4>
    <div className="space-y-4">
      <p>
        At our bakery, every cake tells a story. From the first whisk to the
        final touch, we put care and craftsmanship into every creation,
        ensuring that each cake is as unique and special as the occasion it
        celebrates. Using only the finest ingredients—locally sourced and
        handpicked for quality—we bake with passion, bringing you fresh,
        flavorful, and unforgettable desserts.
      </p>
      <p>
        Our Cakes are covered with Swiss meringue buttercream, also known as
        SMBC, is a buttercream frosting recipe made with egg whites, sugar,
        butter, vanilla extract, and a pinch of salt. This buttercream is
        creamy, thick, buttery, and holds well in shape, which makes it a
        very stable, light, and fluffy buttercream that is not too sweet and
        ideal for cakes.
      </p>
      <p>
        We offer a wide range of customizations, allowing you to personalize
        your cake to fit your vision perfectly. With our commitment to
        quality and creativity, you can trust us to deliver a cake that not
        only looks stunning but tastes amazing, too. Explore our collection
        and let us help make your celebration truly memorable!
      </p>
    </div>
  </Container>
);

const CategoryCard = ({ category }: { category: Category }) => (
  <div className="shadow-md group hover:shadow-lg transition-shadow duration-300">
    <div className="bg-primary-300 flex aspect-[380/306] items-center justify-center overflow-hidden rounded-t">
      <Image
        src={getCategoryImage(category)}
        alt={category.name}
        width={380}
        height={306}
        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = FALLBACK_IMAGE;
        }}
      />
    </div>
    <div className="space-y-1 px-3 py-4">
      <h6 className={cn(
        "text-dark-text mb-2 text-lg font-semibold lg:text-xl",
        poltawskiNowy.className
      )}>
        {category.name}
      </h6>
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-sm">
          {getCategoryDescription(category)}
          {category.product_count !== undefined && category.product_count > 0 && (
            <span className="block text-xs text-gray-500 font-normal mt-1">
              {category.product_count} {category.product_count === 1 ? 'item' : 'items'}
            </span>
          )}
        </span>
        <Link href={`/menu/cakes/${category.slug}`}>
          <button className="border-text flex h-10 w-10 items-center justify-center rounded-full border hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-colors duration-300">
            <ArrowRightIcon className="text-text h-5 w-5 group-hover:text-white" />
          </button>
        </Link>
      </div>
    </div>
  </div>
);

// Main Page Component
export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories({
        hasProducts: true,
        page_size: 100,
      });
      
      const categoriesData = response.results || response;
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load cake categories. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Loading State
  if (loading) {
    return (
      <main className="pb-12">
        <MenuHero />
        <Container className="my-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:my-16 lg:mt-8 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <CategorySkeleton key={item} />
          ))}
        </Container>
      </main>
    );
  }

  // Error State
  if (error) {
    return (
      <main className="pb-12">
        <MenuHero />
        <Container className="my-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchCategories}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition"
            >
              Try Again
            </button>
          </div>
        </Container>
        <AboutSection />
      </main>
    );
  }

  // Success State
  return (
    <main className="pb-12">
      <MenuHero />
      <Container className="my-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:my-16 lg:mt-8 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </Container>
      <AboutSection />
    </main>
  );
}