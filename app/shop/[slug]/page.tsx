import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import AddToCartButton from "@/components/AddToCartButton";
import { createClient } from "@/lib/supabase/server";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id,
      name_ar,
      name_en,
      slug,
      description_ar,
      description_en,
      price,
      discount_percent,
      stock,
      product_images (
        image_url,
        is_primary
      )
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("PRODUCT DETAILS ERROR:", error);
  }

  if (!product) {
    notFound();
  }

  const primaryImage =
    product.product_images?.find((image) => image.is_primary) ??
    product.product_images?.[0];

  const hasDiscount = Number(product.discount_percent) > 0;

  const finalPrice = hasDiscount
    ? Number(product.price) -
      (Number(product.price) * Number(product.discount_percent)) / 100
    : Number(product.price);

  const outOfStock = Number(product.stock) <= 0;

  return (
    <main className="min-h-screen bg-[#FAF6F2] text-[#3B302D]">
      <div className="bg-[#3B302D] px-4 py-2 text-center text-xs tracking-[0.2em] text-white">
        FREE SHIPPING ON ORDERS OVER 1000 EGP
      </div>

      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <Link
          href="/shop"
          className="text-xs tracking-[0.2em] text-[#B9897D] transition hover:text-[#3B302D]"
        >
          ← BACK TO SHOP
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-[#F3D9D5]">
            {primaryImage?.image_url ? (
              <img
                src={primaryImage.image_url}
                alt={product.name_en}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-serif text-8xl text-[#B9897D]">
                  N
                </span>
              </div>
            )}

            {hasDiscount && (
              <span className="absolute left-5 top-5 bg-[#3B302D] px-4 py-2 text-[10px] tracking-widest text-white">
                SALE
              </span>
            )}

            {outOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#3B302D]/50">
                <span className="text-xs tracking-widest text-white">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-[#B9897D]">
              {product.name_ar}
            </p>

            <h1 className="mt-2 font-serif text-4xl lg:text-5xl">
              {product.name_en}
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-xl font-medium">
                {finalPrice.toFixed(2)} EGP
              </span>

              {hasDiscount && (
                <span className="text-sm text-[#9B8D87] line-through">
                  {Number(product.price).toFixed(2)} EGP
                </span>
              )}
            </div>

            <div className="my-8 h-px bg-[#E8D8CC]" />

            {product.description_en && (
              <div>
                <h2 className="text-xs tracking-[0.25em]">
                  DESCRIPTION
                </h2>

                <p className="mt-4 leading-7 text-[#756862]">
                  {product.description_en}
                </p>
              </div>
            )}

            {product.description_ar && (
              <p
                dir="rtl"
                className="mt-4 leading-7 text-[#756862]"
              >
                {product.description_ar}
              </p>
            )}

            <div className="mt-8">
              <p className="mb-3 text-xs tracking-widest text-[#756862]">
                {outOfStock
                  ? "CURRENTLY OUT OF STOCK"
                  : `${product.stock} AVAILABLE`}
              </p>

              <AddToCartButton
                productId={product.id}
                disabled={outOfStock}
              />
            </div>
          </div>
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
