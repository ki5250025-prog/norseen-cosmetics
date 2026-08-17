"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CheckoutForm({
  subtotal,
}: {
  subtotal: number;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const fullName = String(form.get("full_name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const governorate = String(form.get("governorate") || "").trim();
    const address = String(form.get("address") || "").trim();
    const paymentMethod = String(
      form.get("payment_method") || "cash_on_delivery"
    );

    if (!fullName || !phone || !governorate || !address) {
      setError("Please complete all delivery information.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("CHECKOUT AUTH ERROR: No authenticated user");
        setError("Your session has expired. Please sign in again.");
        setLoading(false);
        return;
      }

      console.log("CHECKOUT AUTH USER:", {
        id: user.id,
        email: user.email,
      });

      const { data: cart, error: cartError } = await supabase
        .from("carts")
        .select(`
          id,
          cart_items (
            id,
            product_id,
            quantity,
            products (
              id,
              name_en,
              price,
              discount_percent,
              stock
            )
          )
        `)
        .eq("user_id", user.id)
        .maybeSingle();

      if (cartError) throw cartError;

      const items = cart?.cart_items ?? [];

      if (!cart || items.length === 0) {
        throw new Error("Your cart is empty.");
      }

      let calculatedSubtotal = 0;

      for (const item of items as any[]) {
        const product = item.products;

        if (!product) {
          throw new Error("A product in your cart is no longer available.");
        }

        const quantity = Number(item.quantity);
        const stock = Number(product.stock);

        if (quantity <= 0 || quantity > stock) {
          throw new Error(
            `${product.name_en} does not have enough stock.`
          );
        }

        const price = Number(product.price || 0);
        const discount = Number(product.discount_percent || 0);

        const finalPrice =
          discount > 0
            ? price - (price * discount) / 100
            : price;

        calculatedSubtotal += finalPrice * quantity;
      }

      const { data: zone, error: zoneError } = await supabase
        .from("shipping_zones")
        .select("shipping_price, free_shipping_threshold")
        .eq("name_en", governorate)
        .eq("is_active", true)
        .maybeSingle();

      if (zoneError) throw zoneError;

      const shippingPrice = Number(zone?.shipping_price || 0);
      const freeThreshold =
        zone?.free_shipping_threshold == null
          ? null
          : Number(zone.free_shipping_threshold);

      const shippingCost =
        freeThreshold !== null &&
        calculatedSubtotal >= freeThreshold
          ? 0
          : shippingPrice;

      const total = calculatedSubtotal + shippingCost;

      const orderNumber = `NS-${Date.now()}`;

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          phone,
          governorate,
          address,
          paymentMethod,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to place order."
        );
      }

      window.dispatchEvent(new Event("cart-updated"));

      router.push(`/checkout/success?order=${result.orderNumber}`);
      router.refresh();
    } catch (err: any) {
      console.error("CHECKOUT ERROR MESSAGE:", err?.message);
      console.error("CHECKOUT ERROR DETAILS:", JSON.stringify(err, null, 2));
      setError(
        err?.message || "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <label className="text-sm">Full Name</label>
        <input
          name="full_name"
          type="text"
          required
          placeholder="Your full name"
          className="mt-2 w-full border border-[#E5DDD8] bg-[#FAF6F2] px-4 py-3 outline-none focus:border-[#B9897D]"
        />
      </div>

      <div>
        <label className="text-sm">Phone Number</label>
        <input
          name="phone"
          type="tel"
          required
          placeholder="01xxxxxxxxx"
          className="mt-2 w-full border border-[#E5DDD8] bg-[#FAF6F2] px-4 py-3 outline-none focus:border-[#B9897D]"
        />
      </div>

      <div>
        <label className="text-sm">Governorate</label>
        <select
          name="governorate"
          required
          defaultValue=""
          className="mt-2 w-full border border-[#E5DDD8] bg-[#FAF6F2] px-4 py-3 outline-none focus:border-[#B9897D]"
        >
          <option value="" disabled>
            Select governorate
          </option>
          <option value="Cairo">Cairo</option>
          <option value="Giza">Giza</option>
          <option value="Alexandria">Alexandria</option>
          <option value="Qalyubia">Qalyubia</option>
          <option value="Dakahlia">Dakahlia</option>
          <option value="Sharqia">Sharqia</option>
          <option value="Gharbia">Gharbia</option>
          <option value="Monufia">Monufia</option>
          <option value="Beheira">Beheira</option>
          <option value="Kafr El Sheikh">Kafr El Sheikh</option>
          <option value="Damietta">Damietta</option>
          <option value="Port Said">Port Said</option>
          <option value="Ismailia">Ismailia</option>
          <option value="Suez">Suez</option>
          <option value="Fayoum">Fayoum</option>
          <option value="Beni Suef">Beni Suef</option>
          <option value="Minya">Minya</option>
          <option value="Assiut">Assiut</option>
          <option value="Sohag">Sohag</option>
          <option value="Qena">Qena</option>
          <option value="Luxor">Luxor</option>
          <option value="Aswan">Aswan</option>
          <option value="Red Sea">Red Sea</option>
          <option value="New Valley">New Valley</option>
          <option value="Matrouh">Matrouh</option>
          <option value="North Sinai">North Sinai</option>
          <option value="South Sinai">South Sinai</option>
        </select>
      </div>

      <div>
        <label className="text-sm">Address</label>
        <textarea
          name="address"
          required
          rows={4}
          placeholder="Street, building, apartment..."
          className="mt-2 w-full resize-none border border-[#E5DDD8] bg-[#FAF6F2] px-4 py-3 outline-none focus:border-[#B9897D]"
        />
      </div>

      <div>
        <label className="text-sm">Payment Method</label>

        <div className="mt-2 border border-[#E5DDD8] bg-[#FAF6F2] p-4">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="payment_method"
              value="cash_on_delivery"
              defaultChecked
            />
            <span className="text-sm">
              Cash on Delivery
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#3B302D] px-8 py-4 text-xs tracking-[0.2em] text-white transition hover:bg-[#B9897D] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "PLACING ORDER..." : "PLACE ORDER"}
      </button>
    </form>
  );
}
