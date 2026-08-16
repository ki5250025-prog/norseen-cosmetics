"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  itemId: string;
  quantity: number;
};

export default function CartItemActions({
  itemId,
  quantity,
}: Props) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateQuantity(newQuantity: number) {
    if (loading) return;

    setLoading(true);

    if (newQuantity <= 0) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);
    } else {
      await supabase
        .from("cart_items")
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", itemId);
    }

    window.dispatchEvent(new Event("cart-updated"));

    router.refresh();
    setLoading(false);
  }

  async function removeItem() {
    if (loading) return;

    setLoading(true);

    await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    window.dispatchEvent(new Event("cart-updated"));

    router.refresh();
    setLoading(false);
  }

  return (
    <div className="mt-4 flex items-center gap-3">

      <button
        onClick={() => updateQuantity(quantity - 1)}
        disabled={loading}
        className="h-8 w-8 border border-[#D8B5AA]"
      >
        -
      </button>

      <span className="text-sm">
        {quantity}
      </span>

      <button
        onClick={() => updateQuantity(quantity + 1)}
        disabled={loading}
        className="h-8 w-8 border border-[#D8B5AA]"
      >
        +
      </button>

      <button
        onClick={removeItem}
        disabled={loading}
        className="ml-4 text-xs tracking-widest text-[#B9897D]"
      >
        REMOVE
      </button>

    </div>
  );
}
