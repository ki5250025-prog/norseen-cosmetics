"use client";

import { Heart, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import CartIcon from "./CartIcon";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#E8D8CC]/60 bg-[#FAF6F2]/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            <a href="#" className="text-xs tracking-[0.15em] hover:text-[#B9897D]">HOME</a>
            <a href="#shop" className="text-xs tracking-[0.15em] hover:text-[#B9897D]">SHOP</a>
            <a href="#categories" className="text-xs tracking-[0.15em] hover:text-[#B9897D]">CATEGORIES</a>
            <a href="#about" className="text-xs tracking-[0.15em] hover:text-[#B9897D]">ABOUT</a>
          </div>

          <a href="#" className="absolute left-1/2 -translate-x-1/2 text-center">
            <div className="font-serif text-2xl tracking-[0.22em] text-[#B9897D]">
              NORSEEN
            </div>
            <div className="mt-0.5 text-[8px] tracking-[0.45em]">
              COSMATICS
            </div>
          </a>

          <div className="ml-auto flex items-center gap-4">
            <button className="hidden hover:text-[#B9897D] sm:block" aria-label="Search">
              <Search size={19} strokeWidth={1.5} />
            </button>

            <button className="hover:text-[#B9897D]" aria-label="Wishlist">
              <Heart size={19} strokeWidth={1.5} />
            </button>

            <CartIcon />

            <button className="hidden border-l border-[#D8B5AA] pl-4 text-[10px] tracking-widest sm:block">
              AR
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-[#FAF6F2]">
          <div className="flex h-20 items-center justify-between border-b border-[#E8D8CC] px-5">
            <div>
              <div className="font-serif text-2xl tracking-[0.22em] text-[#B9897D]">
                NORSEEN
              </div>
              <div className="text-[8px] tracking-[0.45em]">
                COSMATICS
              </div>
            </div>

            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-col px-8 py-12">
            {["HOME", "SHOP", "CATEGORIES", "ABOUT", "CONTACT"].map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => setMobileOpen(false)}
                className="border-b border-[#E8D8CC] py-6 font-serif text-2xl hover:text-[#B9897D]"
              >
                {item}
              </a>
            ))}

            <button className="mt-8 self-start border border-[#B9897D] px-7 py-3 text-xs tracking-widest">
              العربية
            </button>
          </div>
        </div>
      )}
    </>
  );
}
