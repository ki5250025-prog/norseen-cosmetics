import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import CartItemActions from "@/components/CartItemActions";

export default async function CartPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-[#FAF6F2] text-[#3B302D]">
        <div className="bg-[#3B302D] px-4 py-2 text-center text-xs tracking-[0.2em] text-white">
          FREE SHIPPING ON ORDERS OVER 1000 EGP
        </div>

        <Navbar />

        <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
          <p className="text-xs tracking-[0.4em] text-[#B9897D]">
            YOUR SHOPPING BAG
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            Please sign in
          </h1>

          <p className="mt-4 max-w-md text-sm text-[#756862]">
            Please sign in to your account to view your shopping cart.
          </p>

          <Link
            href="/account/login"
            className="mt-8 bg-[#3B302D] px-8 py-4 text-xs tracking-[0.2em] text-white transition hover:bg-[#5A4741]"
          >
            SIGN IN
          </Link>

          <Link
            href="/shop"
            className="mt-4 text-xs tracking-widest text-[#B9897D] underline underline-offset-4"
          >
            CONTINUE SHOPPING
          </Link>
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

  return (
    <main className="min-h-screen bg-[#FAF6F2] text-[#3B302D]">
      <div className="bg-[#3B302D] px-4 py-2 text-center text-xs tracking-[0.2em] text-white">
        FREE SHIPPING ON ORDERS OVER 1000 EGP
      </div>

      <Navbar />

      <section className="border-b border-[#E8D8CC] bg-white px-6 py-16 text-center">
        <p className="text-xs tracking-[0.4em] text-[#B9897D]">
          NORSEEN
        </p>

        <h1 className="mt-4 font-serif text-5xl">
          Your Cart
        </h1>

        <p className="mt-3 text-sm text-[#756862]">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        {items.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="font-serif text-3xl">
              Your cart is empty
            </h2>

            <p className="mt-3 text-sm text-[#756862]">
              Discover something beautiful from our collection.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block bg-[#3B302D] px-8 py-4 text-xs tracking-[0.2em] text-white"
            >
              SHOP NOW
            </Link>
          </div>
        ) : (
          <div>
            <div className="space-y-6">
              {items.map((item: any) => {
                const product = item.products;

                if (!product) return null;

                const primaryImage =
                  product.product_images?.find(
                    (image: any) => image.is_primary
                  ) ?? product.product_images?.[0];

                const discount = Number(product.discount_percent || 0);

                const finalPrice =
                  discount > 0
                    ? Number(product.price) -
                      (Number(product.price) * discount) / 100
                    : Number(product.price);

                return (
                  <div
                    key={item.id}
                    className="flex gap-5 border-b border-[#E8D8CC] pb-6"
                  >
                    <Link
                      href={`/shop/${product.slug}`}
                      className="h-28 w-28 shrink-0 overflow-hidden bg-[#F3D9D5]"
                    >
                      {primaryImage?.image_url ? (
                        <img
                          src={primaryImage.image_url}
                          alt={product.name_en}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="font-serif text-4xl text-[#B9897D]">
                            N
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="flex-1">
                      <p className="text-xs text-[#B9897D]">
                        {product.name_ar}
                      </p>

                      <Link href={`/shop/${product.slug}`}>
                        <h2 className="mt-1 font-serif text-xl">
                          {product.name_en}
                        </h2>
                      </Link>

                      <p className="mt-2 text-sm text-[#756862]">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {(finalPrice * item.quantity).toFixed(2)} EGP
                      </p>

                      <CartItemActions
                        itemId={item.id}
                        quantity={item.quantity}
                      />

                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 border-t border-[#E8D8CC] pt-8">
              <div className="flex justify-between">
                <span className="text-sm text-[#756862]">
                  Subtotal
                </span>

                <span className="text-sm">
                  {items
                    .reduce((total: number, item: any) => {
                      const product = item.products;

                      if (!product) return total;

                      const discount = Number(
                        product.discount_percent || 0
                      );

                      const price =
                        discount > 0
                          ? Number(product.price) -
                            (Number(product.price) * discount) / 100
                          : Number(product.price);

                      return total + price * Number(item.quantity);
                    }, 0)
                    .toFixed(2)} EGP
                </span>
              </div>

              <div className="mt-4 flex justify-between">
                <span className="text-sm text-[#756862]">
                  Shipping
                </span>

                <span className="text-sm">
                  Calculated at checkout
                </span>
              </div>

              <div className="mt-6 flex justify-between border-t border-[#3B302D] pt-6">
  <span className="font-serif text-xl">
    Total
  </span>

  <span className="font-serif text-xl">
    {items
      .reduce((total: number, item: any) => {
        const product = item.products;

        if (!product) return total;

        const discount = Number(
          product.discount_percent || 0
        );

        const price =
          discount > 0
            ? Number(product.price) -
              (Number(product.price) * discount) / 100
            : Number(product.price);

        return total + price * Number(item.quantity);
      }, 0)
      .toFixed(2)}{" "}
    EGP
  </span>
</div>

<div className="mt-8 flex justify-end">
  <Link
    href="/checkout"
    className="bg-[#3B302D] px-10 py-4 text-xs tracking-[0.2em] text-white transition hover:bg-[#B9897D]"
  >
    CHECKOUT
  </Link>
</div>

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
