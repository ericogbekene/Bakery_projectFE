import Image from "next/image";
import Header from "@/components/ui/header";
import Hero from "@/components/ui/hero";

export default function Home() {
  return (
    <>
      <div className="p-2">
        <Header />
        <Hero/>
      </div>

    </>

  );
}
