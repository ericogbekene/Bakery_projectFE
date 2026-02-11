"use client";

import logo from "@/assets/images/logo.webp";
import { MENU_LINKS, NAVLINKS } from "@/constants/links";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Container from "../shared/container";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-primary-100">
      <Container className="flex h-[70px] grid-cols-[auto_1fr_auto] items-center max-lg:justify-between lg:grid">
        <Link
          href="/"
          className="flex w-28 items-center justify-center lg:w-36"
        >
          <Image
            src={logo}
            alt="Logo"
            className="w-full object-contain"
            width={100}
            height={100}
          />
        </Link>
        <nav className="hidden items-center justify-center lg:flex">
          <ul className="flex items-center space-x-8">
            {NAVLINKS.map((link) => {
              if (link.isPopover) {
                return (
                  <li key={link.href}>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <button
                          className={cn(
                            "hover:text-primary font-medium transition-colors duration-200 ease-in-out",
                            pathname.startsWith(link.href)
                              ? "text-primary"
                              : "text-text",
                          )}
                        >
                          {link.name}
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="top"
                        align="center"
                        className="bg-primary-50 max-w-[200px] p-0"
                      >
                        <ul>
                          {MENU_LINKS.map((menuLink) => (
                            <li
                              key={menuLink.href}
                              className="border-b border-gray-200 last:border-0"
                            >
                              <Link
                                href={menuLink.href}
                                className="text-text hover:text-primary block px-2 py-2.5 text-center transition-colors duration-200 ease-in-out"
                              >
                                {menuLink.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </HoverCardContent>
                    </HoverCard>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-text hover:text-primary font-medium transition-colors duration-200 ease-in-out",
                      link.href === "/"
                        ? pathname === "/" && "text-primary"
                        : pathname.startsWith(link.href) &&
                            link.href !== "/" &&
                            "text-primary",
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <Button size={"lg"} className="w-40 max-lg:hidden" asChild>
          <Link href="/register">Register</Link>
        </Button>
        <button
          className="cursor-pointer lg:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <MenuIcon className="text-primary h-8 w-10" />
        </button>
      </Container>
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <aside className="bg-primary-50 fixed top-0 right-0 z-50 flex h-full w-72 max-w-[80%] flex-col p-6 lg:hidden">
            <button
              className="mb-6 self-end"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <XIcon className="text-primary h-6 w-6" />
            </button>
            <ul className="flex flex-col space-y-4">
              {NAVLINKS.map((link) => {
                if (link.isPopover) {
                  return (
                    <li key={link.href}>
                      <details>
                        <summary
                          className={cn(
                            "hover:text-primary flex cursor-pointer items-center justify-between font-medium",
                            pathname.startsWith(link.href)
                              ? "text-primary"
                              : "text-text",
                          )}
                        >
                          {link.name}
                          <ChevronDownIcon className="h-4 w-4" />
                        </summary>
                        <ul className="mt-2 flex flex-col space-y-2">
                          {MENU_LINKS.map((ml) => (
                            <li key={ml.href}>
                              <Link
                                href={ml.href}
                                className="text-text hover:text-primary block py-1 transition-colors duration-200 ease-in-out"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {ml.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  );
                }
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "hover:text-primary font-medium transition-colors duration-200 ease-in-out",
                        link.href === "/"
                          ? pathname === "/" && "text-primary"
                          : pathname.startsWith(link.href) &&
                              link.href !== "/" &&
                              "text-primary",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Button size="lg" className="mt-auto w-full" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </aside>
        </>
      )}
    </header>
  );
};

export default Header;
