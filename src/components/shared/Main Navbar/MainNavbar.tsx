"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, ShoppingCart } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { useCartStore } from "@/src/lib/store/cartstore";

export default function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  // const { items } = useCartStore();
const cartCount = useCartStore((state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0)
);



  return (
    <nav className="bg-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Hello
            </Link>
          </div>
          <div className="hidden sm:flex sm:space-x-8 items-center">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-900">
                Menu <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/products/electronics">Gallery</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/products/clothing">About us</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/products/books">Contact us</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                 <Link href="/cart" className="relative text-gray-600 hover:text-gray-900 flex items-center">
  <ShoppingCart className="h-5 w-5 mr-1" />
  <span>Cart</span>
  {cartCount > 0 && (
    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
      {cartCount}
    </span>
  )}
</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/deals" className="text-gray-600 hover:text-gray-900">
             Gallery
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About us
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact us
            </Link>
            {/* <Link href="/cart" className="text-gray-600 hover:text-gray-900">
              Cart
            </Link> */}
            <Link href="/cart" className="relative text-gray-600 hover:text-gray-900 flex items-center">
  <ShoppingCart className="h-5 w-5 mr-1" />
  <span>Cart</span>
  {cartCount > 0 && (
    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
      {cartCount}
    </span>
  )}
</Link>
          </div>
          <div className="hidden sm:flex items-center">
            <Button className="bg-[#C85387] text-white">
             Order Now
            </Button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </Link>
            <button
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => {
                // Handle mobile dropdown
              }}
            >
              Products
            </button>
            <Link
              href="/deals"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Deals
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Contact
            </Link>
            <Link
              href="/support"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Support
            </Link>
          </div>
         <Link href="/cart" className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
  <div className="flex items-center">
    <ShoppingCart className="mr-2 h-4 w-4" /> Cart
  </div>
  {cartCount > 0 && (
    <span className="inline-flex items-center justify-center bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
      {cartCount}
    </span>
  )}
</Link>

        </div>
      )}
    </nav>
  )
}

