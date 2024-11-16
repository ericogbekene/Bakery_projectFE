import React from "react";
import { Button } from "./button";
import Link from "next/link";


const Header = () => {
    return (
        <div className="header flex items-center justify-between gap-4 bg-transparent" >
            <div className="logo">
                <img src="logo.png" alt="Logo" />
            </div>
            <div className="nav">
                <ul className="nav-items flex items-center justify-between gap-4 bg-white">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                    <Link href="/menu"> Menu </Link>
                </ul>
            </div>

            <div className="get-started">
                <Button> Get Started </Button>
            </div>
        </div>
    )
}

export default Header;