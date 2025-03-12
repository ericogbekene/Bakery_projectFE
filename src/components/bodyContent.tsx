import featuredImage from "@/public/images/background.jpg";
import { Button } from "@/components/ui/button";

const LastSection = () => {
  return (
    <section className="w-full max-w-[1248px] mx-auto px-4 mb-12">
      <div
        className="relative w-full h-[352px] rounded-[12px] flex flex-col items-center justify-center px-6 py-10 text-center"
        style={{
          backgroundImage: `url(${featuredImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/50 rounded-[12px]"></div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-white text-2xl md:text-3xl font-semibold font-nowy">
            Give your tastebuds the treat it deserves
          </h1>
          <div className="mt-4">
            <Button className="bg-[#C85387] text-white px-6 py-3 rounded-lg cursor-pointer">
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LastSection;
