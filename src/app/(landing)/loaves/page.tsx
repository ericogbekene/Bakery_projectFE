import Image from "next/image"
import Cakes from "@/public/images/cakes-bg.jpeg"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/src/components/ui/button"

interface CupcakeItem {
  id: string
  title: string
  description: string
  image: string
}

const LoavesPage = () => {
  const cupcakes: CupcakeItem[] = [
    {
      id: "coconut",
      title: "Coconut Cupcakes",
      description:
        "Our coconut cupcakes are made with coconut milk and topped with fluffy coconut buttercream frosting. A real treat for the true coconut aficionado.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "chocolate",
      title: "Chocolate Cupcakes",
      description:
        "Our classic chocolate cupcakes are rich and moist, topped with smooth chocolate buttercream frosting for the ultimate treat.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "marble",
      title: "Marble Cupcakes",
      description:
        "Our marble cupcakes are a perfect blend of vanilla and chocolate swirled together and topped with a dual frosting for a delicious mix.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "plain",
      title: "Plain Cupcakes",
      description:
        "Our plain cupcakes are light and fluffy with a subtle vanilla flavor. Perfect for those who prefer a simpler treat.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "red-velvet",
      title: "Red Velvet Cupcakes",
      description:
        "Our red velvet cupcakes are rich and velvety with a hint of cocoa, topped with cream cheese frosting for a classic combination.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "vanilla",
      title: "Vanilla Cupcakes",
      description:
        "A classic cupcake with light and airy vanilla cake topped with smooth vanilla buttercream frosting for a timeless treat.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "swirl",
      title: "Swirl",
      description:
        "Our signature cake with beautiful blue swirl decoration. Perfect for birthdays and special celebrations.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "flowers",
      title: "Flowers",
      description:
        "A delicate cake adorned with handcrafted buttercream flowers. Ideal for weddings and elegant occasions.",
      image: "/images/coconut-cake.png",
    },
    {
      id: "mixer",
      title: "Mixer",
      description:
        "Our specialty cake with a mix of flavors and decorative elements for those who want a bit of everything.",
      image: "/images/coconut-cake.png",
    },
  ]

  return (
    <div>
      <div className="h-[20vh] md:h-[60vh] max-h-[444px] flex items-center justify-center text-white font-nowy"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${Cakes.src})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}>
        <h1 className="text-[3.5rem] font-semibold w-full md:w-[65%] max-w-4xl text-center">Scroll down and browse through our <span className="text-primary-1100">amazing</span> menu</h1>
      </div>

      <div className="container mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-28 px-4">
        {
          cupcakes.map(cupcake => (
            <Card key={cupcake.id} className="overflow-hidden border-none shadow-sm p-0">
              <CardHeader className="p-0">
                <div className="aspect-square relative bg-primary-300">
                  <Image src={cupcake.image || "/placeholder.svg"} alt={cupcake.title} fill className="object-cover" />
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <h3 className="font-semibold text-lg mb-2">{cupcake.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{cupcake.description}</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="link" className="text-pink-600 border-pink-600 hover:bg-pink-50">
                  Order now
                </Button>
              </CardFooter>
            </Card>
          ))
        }
      </div>

    </div>
  )
}

export default LoavesPage