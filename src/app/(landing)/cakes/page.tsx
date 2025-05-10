"use client"; // Ensures this runs on the client side only

import { useState, useEffect } from "react";
import Image from "next/image";
import Cakes from "@/public/images/cakes-bg.jpeg";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

interface CupcakeItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

const CakesPage = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    setBackgroundImage(Cakes.src); // Set the background image only on client-side
  }, []);

  const cupcakes: CupcakeItem[] = [
    {
      id: "1",
      title: "Coconut Cupcakes",
      description:
        "Our coconut cupcakes are made with coconut milk and topped with fluffy coconut buttercream frosting. A real treat for the true coconut aficionado.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "2",
      title: "Chocolate Cupcakes",
      description:
        "Our classic chocolate cupcakes are rich and moist, topped with smooth chocolate buttercream frosting for the ultimate treat.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "3",
      title: "Marble Cupcakes",
      description:
        "Our marble cupcakes are a perfect blend of vanilla and chocolate swirled together and topped with a dual frosting for a delicious mix.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "4",
      title: "Plain Cupcakes",
      description:
        "Our plain cupcakes are light and fluffy with a subtle vanilla flavor. Perfect for those who prefer a simpler treat.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "5",
      title: "Red Velvet Cupcakes",
      description:
        "Our red velvet cupcakes are rich and velvety with a hint of cocoa, topped with cream cheese frosting for a classic combination.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "6",
      title: "Vanilla Cupcakes",
      description:
        "A classic cupcake with light and airy vanilla cake topped with smooth vanilla buttercream frosting for a timeless treat.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "7",
      title: "Swirl",
      description:
        "Our signature cake with beautiful blue swirl decoration. Perfect for birthdays and special celebrations.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "8",
      title: "Flowers",
      description:
        "A delicate cake adorned with handcrafted buttercream flowers. Ideal for weddings and elegant occasions.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "9",
      title: "Mixer",
      description:
        "Our specialty cake with a mix of flavors and decorative elements for those who want a bit of everything.",
      image: "/images/coconut-cake.png",
    },
  ];

  return (
    <div>
      {/* Hero Section with Background Image */}
      <div
        className="h-[20vh] md:h-[60vh] max-h-[444px] flex items-center justify-center text-white font-nowy px-4"
        style={{
          backgroundImage: backgroundImage
            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage})`
            : "none",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <h1 className="text-2xl sm:text-4xl lg:text-[3.5rem] font-semibold w-full md:w-[65%] max-w-4xl text-center">
          Scroll down and browse through our{" "}
          <span className="text-primary-1100">amazing</span> menu
        </h1>
      </div>

      {/* Cupcakes Grid */}
      <div className="container mx-auto py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-6 sm:mt-12 md:mt-20 lg:mt-28 px-4">
        {cupcakes.map((cupcake) => (
          <Card
            key={cupcake.id}
            className="h-96 md:h-[500px] border-none shadow-sm p-0 rounded-b-none"
          >
            <CardContent className="text-center p-0 h-full">
              {/* Cupcake Image */}
              <div className="bg-primary-300 w-full h-3/5 flex justify-center items-center">
                <div className="w-52 h-52 relative">
                  <Image
                    src={cupcake.image || "/placeholder.svg"}
                    alt={cupcake.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Cupcake Details */}
              <div className="p-2 h-2/5 flex flex-col items-center justify-center">
                <h3 className="font-semibold text-lg font-nowy">
                  {cupcake.title}
                </h3>
                <p className="text-sm text-gray-600">{cupcake.description}</p>
                <Link
                  href="#"
                  className="text-primary-1100 underline text-sm font-semibold mt-2"
                >
                  Order now
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CakesPage;
