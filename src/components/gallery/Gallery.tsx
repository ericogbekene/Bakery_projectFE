import React from "react";
import Image from "next/image";
import cakeOne from "../../../public/1tierCake.png"
import cakeTwo from "../../../public/2StepWedding Cake.png"
import cakeThree from "../../../public/3Tiercake 1.png"
import cakeFour from "../../../public/4tierCake 1.png"
import cakeFive from "../../../public/blackdesign.png"
import cakeSix from "../../../public/cakeDisplay.png"
import cakeSeven from "../../../public/fiveTier.png"
import cakeEight from "../../../public/tierOneCake.png"
import cakeNine from "../../../public/unicornCake.png"
import cakeBg from "../../../public/images/cakes-bg.jpeg"
import cookies from "../../../public/images/cake4.png"
import valentineCake from "../../../public/valentineCake.png"
import TwoTier from "../../../public/2Step.png"
import floweryCake from "../../../public/Russiancake.png"
import meatpies from "../../../public/meatpie.png"
import fishPies from "../../../public/fishpie.png"
import TwoStep from "../../../public/2StepCake.png"
import pastry from "../../../public/pastryBasket.png"

export default function Gallery() {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 font-nowy">
      <div className="w-full">
        <header 
         style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0, 0.5)),url(${cakeBg.src})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "50vh",
    width: "100%",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}
        >


  <h1 className="text-center text-4xl py-6 px-3 text-white  rounded w-[550px]">
    Scroll down and browse through our <span className="text-[var(--color-primary-1100)]">Gallery</span>
  </h1>

        </header>
        <section className="w-full flex items-center justify-center">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5  py-6 px-10 ">

            <li >
              <Image src={cakeTwo} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p className="text-center text-xl p-2">1 Tier Cake</p>
            </li>
            <li  className=""> 
              <Image src={cakeThree} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]" />
              <p  className="text-center text-xl p-2">3 Tier Cake</p>
            </li>
            <li  >
              <Image src={cakeFour} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]" />
              <p  className="text-center text-xl p-2">3 Tier Floating Cake</p>
            </li>
            <li  >
              <Image src={cakeSeven} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p  className="text-center text-xl p-2">5 Tier Wedding Cake</p>
            </li>
            <li >
              <Image src={cakeEight} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]" />
              <p  className="text-center text-xl p-2">1 Tier Cake</p>
            </li>
            <li >
              <Image src={cakeFive} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p  className="text-center text-xl p-2"> Black Design Cake</p>
            </li>
            <li >
              <Image src={cakeOne} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p  className="text-center text-xl p-2">1 Tier Cake</p>
            </li>
            <li >
              <Image src={cakeSix} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p  className="text-center text-xl p-2">Cakes on Display</p>
            </li>
            <li>
              <Image src={cakeNine} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p  className="text-center text-xl p-2" >Unicorn Cake</p>
            </li>
            <li >
              <Image src={valentineCake} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p  className="text-center text-xl p-2">Valentine Cake</p>
            </li>
            <li >
              <Image src={TwoStep} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p  className="text-center text-xl p-2">Two Tier Cake</p>
            </li>
            <li >
              <Image src={TwoTier} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p  className="text-center text-xl p-2">Two Tier Cake</p>
            </li>
            <li >
              <Image src={floweryCake} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p  className="text-center text-xl p-2">Flowery Cake</p>
            </li>
            <li >
              <Image src={meatpies} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p  className="text-center text-xl p-2">Meat Pies</p>
            </li>
            <li >
              <Image src={fishPies} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p  className="text-center text-xl p-2">Fish Pies</p>
            </li>
            <li >
              <Image src={cookies} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p  className="text-center text-xl p-2">Cookies</p>
            </li>
            <li >
              <Image src={pastry} alt="image" className="bg-[var(--color-primary-300)] rounded p-2 text-center shadow-md w-[300px] h-[300px]"/>
              <p  className="text-center text-xl p-2">Pastry Basket</p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
