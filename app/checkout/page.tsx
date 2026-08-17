import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import CheckoutForm from "./CheckoutForm";
import { createClient } from "@/lib/supabase/server";

export default async function CheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login?next=/checkout");
  }

  const { data: cart } = await supabase
    .from("carts")
    .select(`
      id,
      cart_items (
        id,
        quantity,
        product_id,
        products (
          id,
          name_ar,
          name_en,
          slug,
          price,
          discount_percent,
          stock,
          product_images (
            image_url,
            is_primary
          )
        )
      )
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  const items = cart?.cart_items ?? [];

  if (items.length === 0) {
    redirect("/cart");
  }

  const subtotal = items.reduce((total: number, item: any) => {
    const product = item.products;

    if (!product) return total;

    const price = Number(product.price || 0);
    const discount = Number(product.discount_percent || 0);

    const finalPrice =
      discount > 0
        ? price - (price * discount) / 100
        : price;

    return total + finalPrice * Number(item.quantity || 0);
  }, 0);

  return (
    <main className="min-h-screen bg-[#FAF6F2] text-[#3B302D]">
      <div className="bg-[#3B302D] px-4 py-2 text-center text-xs tracking-[0.2em] text-white">
        FREE SHIPPING ON ORDERS OVER 1000 EGP
      </div>

      <Navbar />

      <section className="border-b border-[#E8D8CC] bg-white px-6 py-14 text-center">
        <p className="text-xs tracking-[0.4em] text-[#B9897D]">
          NORSEEN
        </p>

        <h1 className="mt-4 font-serif text-5xl">
          Checkout
        </h1>

        <p className="mt-3 text-sm text-[#756862]">
          Complete your order
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

          <div className="bg-white p-7 shadow-sm">
            <h2 className="font-serif text-2xl">
              Delivery Information
            </h2>

            <CheckoutForm subtotal={subtotal} />
          </div>

          <aside className="h-fit bg-white p-7 shadow-sm lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl">
              Your Order
            </h2>

            <div className="mt-7 space-y-5">
              {items.map((item: any) => {
                const product = item.products;

                if (!product) return null;

                const price = Number(product.price || 0);
                const discount = Number(
                  product.discount_percent || 0
                );

                const finalPrice =
                  discount > 0
                    ? price - (price * discount) / 100
                    : price;

                return (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 border-b border-[#E8D8CC] pb-5"
                  >
                    <div>
                      <p className="font-serif">
                        {product.name_en}
                      </p>

                      <p className="mt-1 text-xs text-[#756862]">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <span className="text-sm">
                      {(finalPrice * Number(item.quantity)).toFixed(2)} EGP
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 flex justify-between border-t border-[#3B302D] pt-6">
              <span className="font-serif text-xl">
                Total
              </span>

              <span className="font-serif text-xl">
                {subtotal.toFixed(2)} EGP
              </span>
            </div>

            <Link
              href="/cart"
              className="mt-6 block text-center text-xs tracking-widest text-[#B9897D] underline underline-offset-4"
            >
              BACK TO CART
            </Link>
          </aside>

        </div>
      </section>

      <footer className="bg-[#3B302D] px-6 py-12 text-center text-white">
        <div className="font-serif text-2xl tracking-[0.25em] text-[#D8B5AA]">
          NORSEEN
        </div>

        <div className="mt-2 text-[9px] tracking-[0.45em]">
          COSMATICS
        </div>

        <p className="mt-6 text-xs text-white/60">
          Beauty that inspires.
        </p>

        <p className="mt-8 text-[10px] tracking-widest text-white/40">
          © 2026 NORSEEN COSMATICS
        </p>
      </footer>
    </main>
  );
}
