import type { Metadata } from "next";
import "./globals.css";
import MainNavbar from "../components/shared/Main Navbar/MainNavbar";
import Footer from "@/src/components/shared/Footer/Footer";
import { Poltawski_Nowy } from "next/font/google";

const poltawskiNowy = Poltawski_Nowy({
  variable: "--font-poltawski-nowy",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M&C Bakery",
  description: "Artisanal breads and pastries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poltawskiNowy.variable} antialiased`}
      >
        <MainNavbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
