"use client";
import React from "react";
import Image from "next/image";
import cakeOne from "@/public/images/cake1.png";
import cakeTwo from "@/public/images/cake2.png";
import cakeThree from "@/public/images/cake3.png";
import cakeFour from "@/public/images/cake4.png";
import foundersImg from "@/public/images/founders.png";
import CoreValue from "@/public/images/Corevalue.png";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import icon1 from "@/public/images/peoples.png";
import icon2 from "@/public/images/cross-society.png";
import icon3 from "@/public/images/heart-rate.png";
import icon4 from "@/public/images/lotus.png";
import icon5 from "@/public/images/shield.png";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center w-full p-2">
      <div>
     
        <div className="text-center p-2 m-2 bg-[#F4DDE7] w-full max-w-[1200px]">
          <h1 className="font-bold p-1">About Us</h1>
          <p className="mb-3 text-sm">Indulge your cravings</p>
          <div className="flex flex-wrap sm:flex-col md:flex-row w-full gap-2 justify-center items-center">
            <Image src={cakeOne} alt="image" className="w-[250px] h-[200px]" />
            <Image src={cakeTwo} alt="image" className="w-[250px] h-[200px]" />
            <Image
              src={cakeThree}
              alt="image"
              className="w-[250px] h-[200px]"
            />
            <Image src={cakeFour} alt="image" className="w-[250px] h-[200px]" />
          </div>
        </div>

       
        <div className="p-2 m-2">
          <h1 className="text-center font-bold">Our Story</h1>
          <div className="flex flex-col md:flex-row gap-3 items-center md:items-start">
            <Image
              src={foundersImg}
              alt="founders"
              className="w-[400px] h-[350px] rounded"
            />
            <p className="w-full md:w-[500px] text-sm font-sans px-4 leading-9 text-[#575154]">
              {`The name M and C comes from the initials of two sisters, Mary and
              Clara, who share a passion for pastry and baking arts. At the age
              of eight, Mary fell in love with baking, and in 2016, she obtained
              her Cake Design Certificate from Lambert Academy, certifying her
              skills. Clara began baking in 2014 while pursuing a master's
              degree in international business. In 2015, the sisters combined
              their talents to form M and C Cakes, bringing artistry and
              professionalism to every creation.`}
            </p>
          </div>
        </div>

       
        <section className="my-10 w-full max-w-[1200px]">
          <h1 className="text-center font-bold py-2">Our Purpose</h1>
          <p className="text-center text-sm">
            Your trusted partner in making every occasion deliciously special
          </p>

          <div className="flex flex-wrap sm:flex-col md:flex-row gap-4 justify-center items-center">
            <div className="bg-[#E2E7D7] w-full md:w-[500px] p-4 rounded-sm">
              <h1 className="text-center font-bold   "> Mission </h1>
              <div className="flex items-center gap-2 text-sm ">
                <ChevronRightIcon />
                <p className="py-2">
                  To provide premium, handcrafted delicacies that suit all
                  occasions in order to make life sweeter.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronRightIcon />
                <p className="py-2">
                  To deliver freshly baked goods made with premium ingredients
                  and love, creating moments of joy for our customers every day.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronRightIcon />
                <p className="py-2">
                  To surpass client expectations by crafting cakes and pastries
                  that offer a unique blend of creativity and tradition.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronRightIcon />
                <p className="py-2">
                  To bake with passion and talent, creating the pleasure that
                  reflect the best moments in life.
                </p>
              </div>
            </div>
            <div className="bg-[#E2E7D7] w-[500px] h-[300px] p-4 rounded-sm">
              <h1 className="text-center font-bold"> Vision</h1>
              <div className="flex items-center gap-2 text-sm">
                <ChevronRightIcon />
                <p className="py-2">
                  To lead the bakery industry with innovative flavors and
                  sustainable practices.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronRightIcon />
                <p className="py-2">
                  To be the go-to bakery for unforgettable celebrations, making
                  every occasion special with our treats.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronRightIcon />
                <p className="py-2">
                  To become the most trusted name in artisanal baking, renowned
                  for quality and creativity.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronRightIcon />
                <p className="py-2">
                  To be recognized globally as the bakery that turns dreams into
                  delicious realities.
                </p>
              </div>
            </div>
          </div>
        </section>

       
        <section className="w-full max-w-[1200px] flex flex-wrap sm:flex-col md:flex-row justify-center items-center my-4">
          <Image src={CoreValue} alt="img" className="w-[400px] h-[200px]" />
          <div className="w-[400px] h-[200px] text-center md:text-left">
            <h1 className="font-bold ">Our Core Values</h1>
            <p className="text-sm">
              At the heart of everything we do are values that guide us, these
              principles drive our commitment to excellence and responsibility.
            </p>
            <button className="bg-[#C85387] text-[#ffffff] my-8 py-2 px-6 rounded-md">
              Order now
            </button>
          </div>
        </section>

     
        <section className="w-full max-w-[1200px]">
          <div className="flex flex-wrap gap-4 text-[#ffffff] p-4 text-sm justify-center">
            <div className="w-full md:w-[350px] bg-[#C85387] p-4 rounded">
              <Image src={icon1} alt="icon" className="w-5 h-5" />
              <p className="font-bold">Customer First</p>
              <p>
                We prioritize our customers above all, striving to exceed their
                expectations and deliver exceptional experiences every step of
                the way.
              </p>
            </div>
            <div className="w-full md:w-[350px] bg-[#C85387] p-4 rounded">
              <Image src={icon3} alt="icon" className="w-5 h-5" />
              <p className="font-bold">Passion</p>
              <p>
                Our love for what we do drives us to innovate, create, and
                continuously improve, ensuring our work reflects our dedication
                and enthusiasm.
              </p>
            </div>
            <div className="w-[350px] bg-[#C85387] p-4 rounded">
              <Image src={icon5} alt="icon" className="w-5 h-5" />
              <p className="font-bold">integrity & honesty</p>
              <p>
                We uphold the highest standards of integrity, always being
                transparent, honest, and ethical in all our actions and
                decisions.
              </p>
            </div>
            <div className="w-[350px] bg-[#C85387] p-4 rounded">
              <Image src={icon4} alt="icon" className="w-5 h-5" />
              <p className="font-bold">Care for Environment and Community</p>
              <p>
                We are committed to sustainability and giving back, fostering a
                positive impact on our environment and supporting the
                communities we serve.
              </p>
            </div>
            <div className="w-[350px] bg-[#C85387] p-4 rounded">
              <Image src={icon2} alt="icon" className="w-5 h-5" />
              <p className="font-bold">Health and safety</p>
              <p>
                We prioritize the well-being of our team, customers, and
                partners by maintaining a safe, healthy, and supportive
                environment.
              </p>
            </div>

            <div className="w-[350px] text-center ">
              <div className="mb-2 bg-[#C85387] p-4 rounded">
                <p className="font-bold">10+</p>
                <p>years of experience</p>
              </div>
              <div className="w-[350px] bg-[#C85387] p-4 rounded">
                <p className="font-bold">1000+</p>
                <p>happy customers</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
