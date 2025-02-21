import Image from "next/image";
import featuredImage from '@/assets/images/pexels-divinetechygirl-1181569.jpg'
import { Button } from "./button";

const FeatureSection = () => {
    return (
        <>
            <section>
                <div className="flex flex-col items-center justify-center p-3 space-x-4 bg-teal-500">
                    <h1 className="text-3xl">Why choose Us</h1>
                    <div className="flex items-center justify-evenly gap-8 w-4/5 rounded-2xl min-h-24 bg-">
                        <div className="img-left flex justify-start ">
                            <Image src={featuredImage} alt='image' width={100} height={50} />
                        </div>
                        <div className="p-5 m-5 flex-col gap-5">
                            <h1>Healthy Snacks</h1>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing.</p>
                            <h1>Healthy Snacks</h1>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing.</p>
                            <h1>Healthy Snacks</h1>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing.</p>

                            <div className="cta-btns">
                                <Button> Get Started </Button>
                            </div>

                        </div>





                    </div>
                    
                    <div className="flex-col items-center justify-center p-6 m-m-6 gap-5 bg-[url('')] bg-cover bg-center">

                        <h1 className="text-indigo-50">
                            Give your tastebuds the treat it deserves
                        </h1>
                        <div className="cta-btns">
                            <Button> Get Started </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default FeatureSection;


