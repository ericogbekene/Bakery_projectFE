import React from "react";
import { Button } from "./button";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/auth";
import { useTheme } from "../context/theme";
import Image from "next/image";
import logo from '@/assets/images/a.svg'


const Header = () => {
    return (
        <div className="header flex items-center justify-between gap-4 bg-transparent" >
            <div className="logo">
                <Image
                src={logo}
                width={50}
                height={50}
                alt="Logo"
                />
            </div>
            <div className="nav">
                <ul className="nav-items flex items-center justify-between gap-4">
                    <Link href="/menu"> Home </Link>
                    <Link href="/menu"> Menu </Link>
                    <Link href="/menu"> About Us </Link>
                    <Link href="/menu"> Contact </Link>
                    <Link href="/menu"> Gallery </Link>
                </ul>
            </div>

            <div className="get-started">
                <Button> Get Started </Button>
            </div>
        </div>
    )
}

export default Header;