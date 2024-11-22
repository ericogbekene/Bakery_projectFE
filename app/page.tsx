import Image from "next/image";
import Header from "@/components/ui/header";
import Hero from "@/components/ui/hero";
import Features from "@/components/ui/features";

export default function Home() {
  return (
    <>
      <div className=" bg-rose-300 p-5">
        <Header />
        <Hero/>
        <Features/>
      </div>

    </>

  );
}
