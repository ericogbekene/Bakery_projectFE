"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import HeroCake from "@/public/images/Frame 9.png";
import MobileHeroCake from "@/public/images/Frame 99.png";

export default function HeroSection() {
  return (
    <div className="relative min-h-[600px] lg:min-h-[800px] w-full">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://source.unsplash.com/1600x900/?bakery,cakes")',
        }}
      >
        <div className="absolute inset-0 bg-pink-100 bg-opacity-90" /> {/* Overlay */}
      </div>
    
      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:pr-8">
        {/* Desktop layout - 3 columns */}
        <div className="hidden lg:grid lg:grid-cols-[auto_1fr_1.5fr] lg:items-center lg:h-full lg:gap-6">
          {/* Left - Social Media Icons */}
          <div className="flex flex-col gap-8 items-start mr-6">
            <Link href="" className="text-[#C85387] text-2xl"><Facebook /></Link>
            <Link href="" className="text-[#C85387] text-2xl"><Instagram /></Link>
            <Link href="" className="text-[#C85387] text-2xl"><Youtube /></Link>
          </div>
    
          {/* Center - Main Content */}
          <div className="flex flex-col justify-center max-w-xl text-left pt-20 pb-16">
            <div className="mb-10">
              <p className="inline-block text-[#C85387] bg-pink-200 px-3 rounded-lg">
                More than delicious
              </p>
            </div>
            <h1 className="font-nowy text-4xl md:text-5xl lg:text-6xl text-gray-800 mb-6">
              Freshly baked,<br />
              from our oven to <br />your <span className="text-[#C85387]">heart</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              From buttery snacks to delicious cakes, we bring you irresistible
              treats baked daily with care. Every bite is a moment of pure delight.
            </p>
            <div className="flex gap-2 justify-start">
              <Button
                size="sm"
                className="bg-[#C85387] hover:bg-pink-700 text-white px-8 py-6 text-lg cursor-pointer"
              >
                Order Now
              </Button>
              <Button
                size="sm"
                className="bg-transparent text-[#C85387] px-10 py-6 text-lg border border-[#C85387] cursor-pointer"
              >
                Make Custom Orders
              </Button>
            </div>
          </div>
    
          {/* Right - Image */}
          <div className="flex justify-end">
            <Image
              src={HeroCake}
              alt="Delicious Cake"
              className="w-full max-w-[500px] h-auto"
            />
          </div>
        </div>
    
        {/* Mobile layout - reordered for smaller screens */}
        <div className="flex flex-col lg:hidden items-center py-10 h-full">
          {/* First - Different Mobile Image */}
          <div className="w-full flex justify-center mb-8">
            <Image
              src={MobileHeroCake}
              alt="Delicious Mobile Cake"
              className="w-full max-w-[350px] h-auto"
            />
          </div>
    
          {/* Second - Main Content */}
          <div className="flex flex-col justify-center text-center w-full mb-8">
            <div className="mb-6">
              <p className="inline-block text-[#C85387] bg-pink-200 px-3 rounded-lg">
                More than delicious
              </p>
            </div>
            <h1 className="font-nowy text-3xl sm:text-4xl text-gray-800 mb-4">
              Freshly baked, from our oven to your <span className="text-[#C85387]">heart</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              From buttery snacks to delicious cakes, we bring you irresistible
              treats baked daily with care. Every bite is a moment of pure delight.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="sm"
                className="bg-[#C85387] hover:bg-pink-700 text-white px-6 py-4 text-base cursor-pointer"
              >
                Order Now
              </Button>
              <Button
                size="sm"
                className="bg-transparent text-[#C85387] px-6 py-4 text-base border border-[#C85387]"
              >
                Make Custom Orders
              </Button>
            </div>
          </div>
    
          {/* Third - Social Media Icons */}
          <div className="flex justify-center gap-6 mt-2">
            <Link href="" className="text-[#C85387] text-xl"><Facebook /></Link>
            <Link href="" className="text-[#C85387] text-xl"><Instagram /></Link>
            <Link href="" className="text-[#C85387] text-xl"><Youtube /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}