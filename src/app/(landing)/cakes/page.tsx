import Image from "next/image"
import Cakes from "@/public/images/cakes-bg.jpeg"


const CakesPage = () => {
  return (
    <div>
      <div className="h-[45vh] max-h-[444px] flex items-center justify-center text-4xl font-bold text-white font-nowy"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${Cakes.src})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}>
        Scroll down and browse through our amazing menu
      </div>
      <Image src='/images/cakes-bg.jpeg' alt="Cakes" width={1920} height={1080} />
    </div>
  )
}

export default CakesPage