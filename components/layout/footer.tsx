import logo from "@/assets/images/logo-white.webp";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Container from "../shared/container";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <Container className="space-y-10 py-8 pb-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-8">
            <div>
              <Link
                href="/"
                className="flex w-32 items-center justify-start lg:w-40"
              >
                <Image
                  src={logo}
                  alt="Logo"
                  className="w-full object-contain"
                  width={100}
                  height={100}
                />
              </Link>
              <p className="mt-2 text-sm font-light">
                49 Rufus Aigbodun Cresent Jahi Abuja
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p>Phone: 08100009968</p>
              <p>WhatsApp: +2348100009968</p>
              <p>Email: Mandccakess@gmail.com</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3
              className={cn(
                "text-lg font-semibold lg:text-xl",
                poltawskiNowy.className,
              )}
            >
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us">About us</Link>
              </li>
              <li>
                <Link href="/contact-us">Contact us</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3
              className={cn(
                "text-lg font-semibold lg:text-xl",
                poltawskiNowy.className,
              )}
            >
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faqs">FAQs</Link>
              </li>
              <li>
                <Link href="/bakery-policy">Bakery policy</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3
              className={cn(
                "text-lg font-semibold lg:text-xl",
                poltawskiNowy.className,
              )}
            >
              Social media
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#">Instagram</Link>
              </li>
              <li>
                <Link href="#">Facebook</Link>
              </li>
              <li>
                <Link href="#">YouTube</Link>
              </li>
              <li>
                <Link href="#">Tiktok</Link>
              </li>
              <li>
                <Link href="#">Threads</Link>
              </li>
              <li>
                <Link href="#">Pinterest</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-center text-sm">
          (c) Copyright 2025. M&C. cakes. All Right Reserved
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
