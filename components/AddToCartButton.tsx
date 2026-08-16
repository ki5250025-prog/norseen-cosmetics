"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  productId: string;
  disabled?: boolean;
};

export default function AddToCartButton({
  productId,
  disabled = false,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    if (loading || disabled) return;

    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Please sign in first.");
        return;
      }

      // Find user's cart
      let { data: cart, error: cartError } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cartError) {
        throw cartError;
      }

      // Create cart if it doesn't exist
      if (!cart) {
        const { data: newCart, error: createCartError } = await supabase
          .from("carts")
          .insert({
            user_id: user.id,
          })
          .select("id")
          .single();

        if (createCartError) {
          throw createCartError;
        }

        cart = newCart;
      }

      // Check whether product is already in cart
      const { data: existingItem, error: itemError } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cart.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (itemError) {
        throw itemError;
      }

      if (existingItem) {
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({
            quantity: existingItem.quantity + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingItem.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabase
          .from("cart_items")
          .insert({
            cart_id: cart.id,
            product_id: productId,
            quantity: 1,
          });

        if (insertError) {
          throw insertError;
        }
      }

      setMessage("Added to cart ✓");
      window.dispatchEvent(new Event("cart-updated"));
      router.push("/cart");
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled || loading}
        className="w-full bg-[#3B302D] px-8 py-4 text-xs tracking-[0.2em] text-white transition hover:bg-[#5A4741] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "ADDING..." : disabled ? "OUT OF STOCK" : "ADD TO CART"}
      </button>

      {message && (
        <p className="mt-3 text-center text-xs text-[#B9897D]">
          {message}
        </p>
      )}
    </div>
  );
}
