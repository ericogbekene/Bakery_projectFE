import Image from "next/image"


const CakesPage = () => {
  return (
    <div>
      <div className="h-[45vh] max-h-[444px] flex items-center justify-center text-4xl font-bold text-white">
        Scroll down and browse through our amazing menu
      </div>
      <Image src='/images/cakeBg.jpeg' alt="Cakes" width={1920} height={1080} />
    </div>
  )
}

export default CakesPage