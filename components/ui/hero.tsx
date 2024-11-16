import React from "react";
import { Button } from "./button";


export default function Hero() {
    return (
        <div>
            <div className="hero-container flex items-center justify-between p-10 bg-rose-300 bg-gradient-to-t">
                <div className="hero-left gap-5 ">
                    <h1 className="font-sans text-4xl"> Welcome to a Braave new world</h1>
                    <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit, enim?</p>
                    <div className="cta-btns">
                        <Button> Get Started </Button>
                    </div>
                </div>
                <div className="hero-right">
                    <img src="/home/ericomedia/workstation/Bakery_projectFE/frontend_bakery/assets/Frame 9.png" alt="hero-img"></img>
                </div>
            </div>


        </div>
    )
}
