"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const [count, setCount] = useState(0);

  async function loadCount() {
    try {
      const res = await fetch("/api/cart/count");
      const data = await res.json();
      setCount(data.count);
    } catch {
      setCount(0);
    }
  }

  useEffect(() => {
    loadCount();

    window.addEventListener("cart-updated", loadCount);

    return () => {
      window.removeEventListener("cart-updated", loadCount);
    };
  }, []);

  return (
    <Link
      href="/cart"
      className="relative hover:text-[#B9897D]"
      aria-label="Shopping bag"
    >
      <ShoppingBag size={19} strokeWidth={1.5} />

      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#B9897D] text-[8px] text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
