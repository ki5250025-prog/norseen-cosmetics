import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

type SearchParams = {
  category?: string;
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const categorySlug = params.category;

  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name_ar, name_en, slug")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  let categoryId: string | null = null;

  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .eq("is_active", true)
      .maybeSingle();

    categoryId = category?.id ?? null;
  }

  let query = supabase
    .from("products")
    .select(`
      id,
      name_ar,
      name_en,
      slug,
      price,
      discount_percent,
      stock,
      category_id,
      product_images (
        image_url,
        is_primary
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("SHOP PRODUCTS ERROR:", error);
  }

  const activeCategory = categories?.find(
    (category) => category.slug === categorySlug
  );

  return (
    <main className="min-h-screen bg-[#FAF6F2] text-[#3B302D]">
      <div className="bg-[#3B302D] px-4 py-2 text-center text-xs tracking-[0.2em] text-white">
        FREE SHIPPING ON ORDERS OVER 1000 EGP
      </div>

      <Navbar />

      <section className="border-b border-[#E8D8CC] bg-white px-6 py-20 text-center">
        <p className="text-xs tracking-[0.4em] text-[#B9897D]">
          NORSEEN COLLECTION
        </p>

        <h1 className="mt-4 font-serif text-5xl">
          {activeCategory?.name_en || "Shop All"}
        </h1>

        {activeCategory?.name_ar && (
          <p className="mt-3 text-sm text-[#756862]">
            {activeCategory.name_ar}
          </p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* Categories */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className={`border px-5 py-3 text-xs tracking-widest transition ${
              !categorySlug
                ? "border-[#3B302D] bg-[#3B302D] text-white"
                : "border-[#D8B5AA] hover:bg-[#F3D9D5]"
            }`}
          >
            ALL
          </Link>

          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className={`border px-5 py-3 text-xs tracking-widest transition ${
                category.slug === categorySlug
                  ? "border-[#3B302D] bg-[#3B302D] text-white"
                  : "border-[#D8B5AA] hover:bg-[#F3D9D5]"
              }`}
            >
              {category.name_en}
            </Link>
          ))}
        </div>

        {/* Products */}
        {products?.length ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const primaryImage =
                product.product_images?.find(
                  (image) => image.is_primary
                ) ?? product.product_images?.[0];

              const hasDiscount = Number(product.discount_percent) > 0;

              const finalPrice = hasDiscount
                ? Number(product.price) -
                  (Number(product.price) * Number(product.discount_percent)) / 100
                : Number(product.price);

              const outOfStock = Number(product.stock) <= 0;

              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#F3D9D5]">
                    {primaryImage?.image_url ? (
                      <img
                        src={primaryImage.image_url}
                        alt={product.name_en}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-serif text-6xl text-[#B9897D]">
                          N
                        </span>
                      </div>
                    )}

                    {hasDiscount && (
                      <span className="absolute left-3 top-3 bg-[#3B302D] px-3 py-1 text-[10px] tracking-widest text-white">
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

                  <div className="pt-4">
                    <p className="text-xs text-[#B9897D]">
                      {product.name_ar}
                    </p>

                    <h2 className="mt-1 font-serif text-lg">
                      {product.name_en}
                    </h2>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {hasDiscount
                          ? finalPrice.toFixed(2)
                          : Number(product.price).toFixed(2)}{" "}
                        EGP
                      </span>

                      {hasDiscount && (
                        <span className="text-xs text-[#9B8D87] line-through">
                          {Number(product.price).toFixed(2)} EGP
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h2 className="font-serif text-3xl">
              No products found
            </h2>

            <p className="mt-3 text-sm text-[#756862]">
              There are no active products in this category yet.
            </p>
          </div>
        )}
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
