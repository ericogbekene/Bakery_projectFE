"use client"

import Image from "next/image"
import Cakes from "@/public/images/cakes-bg.jpeg"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react";
import { useProductStore, Product } from "@/src/lib/store/productstore";


const CupcakesPage = () => {
 const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [cupcakeProducts, setCupcakeProducts] = useState<Product[]>([]);

  useEffect(() => {
    setBackgroundImage(Cakes.src);
    const cupcakes = useProductStore.getState().getProductsByType("cupcake");
    setCupcakeProducts(cupcakes);
  }, []);
  return (
    <div>
      <div className="h-[20vh] md:h-[60vh] max-h-[444px] flex items-center justify-center text-white font-nowy px-4"
        style={{
             backgroundImage: backgroundImage
            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage})`
            : "none",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}>
        <h1 className="text-2xl sm:text-4xl lg:text-[3.5rem] font-semibold w-full md:w-[65%] max-w-4xl text-center">Scroll down and browse through our <span className="text-primary-1100">amazing</span> menu</h1>
      </div>

      <div className="container mx-auto py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-6 sm:mt-12 md:mt-20 lg:mt-28 px-4">
        {
          cupcakeProducts.map(cupcake => (
            <Card key={cupcake.id} className="h-96 md:h-[500px] border-none shadow-sm p-0 rounded-b-none">
              <CardContent className="text-center p-0 h-full">
                <div className="bg-primary-300 w-full h-3/5 flex justify-center items-center">
                  <div className="w-52 h-52 relative">
                    <Image src={cupcake.image || "/placeholder.svg"} alt={cupcake.title} fill className="object-center" />
                  </div>
                </div>
                <div className="p-2 h-2/5 flex flex-col items-center justify-center">
                  <h3 className="font-semibold text-lg font-nowy">{cupcake.title}</h3>
                  <p className="text-sm text-gray-600">{cupcake.description}</p>
                  <Link href={`/product/cakes/${cupcake.id}`} className="text-primary-1100 underline text-sm font-semibold mt-2">
                    Order now
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        }
      </div>

    </div>
  )
}

export default CupcakesPage