import React from "react";
import { Button } from "./button";
import heroImage from '@/assets/images/Frame 9.png'
import Image from 'next/image'


export default function Hero() {
    return (
        <div>
            <div className="hero-container flex items-center justify-between p-10 bg-hero-pattern bg-cover bg-center min-h-[60vh]">
                <div className="hero-left gap-5 px-4 py-20 ">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-4"> Freshly Baked <br/> from our oven to <br/> your heart </h1>
                    <p className="text-lg text-gray-200"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit, enim?</p>
                    <div className="cta-btns">
                        <Button> Get Started </Button>
                    </div>
                </div>
                <div className="hero-right">
                    <Image
                        src={heroImage}
                        alt="Hero Image"
                        width={500}
                        height={500}
                    />

                </div>
            </div>


        </div>
    )
}
