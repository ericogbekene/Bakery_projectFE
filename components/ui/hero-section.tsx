"use client"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <div className="relative min-h-[600px] lg:min-h-[800px] w-full">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("/home/ericomedia/workplace/Bakery_projectFE/assets/images/Frame 9.png")',
        }}
      >
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay for better text readability */}
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center h-full max-w-xl pt-20 pb-16">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">Freshly baked,<br/> 
          from our oven to <br/>your heart</h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
          From buttery snacks to delicious cakes, we bring you irresistible treats baked daily with care. Every bite is a moment of pure delight.
          </p>
          <div>
            <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg">
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

