"use client";

import { createClient } from "@/lib/supabase/client";
import { ImagePlus, Loader2, Save, X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";

type ImagePreview = {
  file: File;
  url: string;
};

export default function NewProductPage() {
  const supabase = createClient();

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...previews].slice(0, 8));
  };

  const removeImage = (index: number) => {
    setImages((current) => {
      const image = current[index];
      URL.revokeObjectURL(image.url);

      return current.filter((_, i) => i !== index);
    });
  };

  const slugify = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!nameEn || !nameAr || !price || !costPrice || !stock || !sku) {
      setMessage("Please fill all required fields.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const slug = `${slugify(nameEn)}-${Date.now()}`;

      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          name_en: nameEn,
          name_ar: nameAr,
          description_en: descriptionEn || null,
          description_ar: descriptionAr || null,
          price: Number(price),
          cost_price: Number(costPrice),
          stock: Number(stock),
          sku: sku.toUpperCase(),
          slug,
        })
        .select()
        .single();

      if (productError) {
        throw productError;
      }

      for (let index = 0; index < images.length; index++) {
        const image = images[index];

        const extension =
          image.file.name.split(".").pop()?.toLowerCase() || "jpg";

        const filePath = `${product.id}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, image.file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrl } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        const { error: imageError } = await supabase
          .from("product_images")
          .insert({
            product_id: product.id,
            image_url: publicUrl.publicUrl,
            sort_order: index,
            is_primary: index === 0,
          });

        if (imageError) {
          throw imageError;
        }
      }

      setMessage("Product created successfully ✓");

      setNameEn("");
      setNameAr("");
      setDescriptionEn("");
      setDescriptionAr("");
      setPrice("");
      setCostPrice("");
      setStock("");
      setSku("");
      setImages([]);
    } catch (error: any) {
      console.error("PRODUCT ERROR:", error);

      setMessage(
        error?.message ||
        error?.details ||
        error?.hint ||
        "Unknown Supabase error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F5F3] p-5 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] text-[#B9897D]">
            PRODUCT MANAGEMENT
          </p>

          <h1 className="mt-2 font-serif text-3xl md:text-4xl">
            Add New Product
          </h1>

          <p className="mt-2 text-sm text-[#756862]">
            Add product details, pricing, stock and images.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <section className="rounded-2xl border border-[#E5DDD8] bg-white p-6 md:p-8">
            <h2 className="font-serif text-2xl">
              Product Information
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <label className="text-sm">
                Product Name — English *
                <input
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
                  placeholder="Rose Silk Blush"
                />
              </label>

              <label className="text-sm">
                اسم المنتج — عربي *
                <input
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  dir="rtl"
                  className="mt-2 w-full rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
                  placeholder="روز سيلك بلاشر"
                />
              </label>

              <label className="text-sm md:col-span-2">
                Description — English
                <textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
                  placeholder="Describe your product..."
                />
              </label>

              <label className="text-sm md:col-span-2">
                وصف المنتج — عربي
                <textarea
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  dir="rtl"
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
                  placeholder="اكتب وصف المنتج..."
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5DDD8] bg-white p-6 md:p-8">
            <h2 className="font-serif text-2xl">
              Pricing & Inventory
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-sm">
                Selling Price *
                <div className="relative mt-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-[#E5DDD8] px-4 py-3 pr-14 outline-none focus:border-[#B9897D]"
                    placeholder="399"
                  />
                  <span className="absolute right-4 top-3.5 text-xs text-gray-500">
                    EGP
                  </span>
                </div>
              </label>

              <label className="text-sm">
                Cost Price *
                <div className="relative mt-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full rounded-xl border border-[#E5DDD8] px-4 py-3 pr-14 outline-none focus:border-[#B9897D]"
                    placeholder="220"
                  />
                  <span className="absolute right-4 top-3.5 text-xs text-gray-500">
                    EGP
                  </span>
                </div>
              </label>

              <label className="text-sm">
                Stock *
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
                  placeholder="50"
                />
              </label>

              <label className="text-sm">
                SKU *
                <input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5DDD8] px-4 py-3 uppercase outline-none focus:border-[#B9897D]"
                  placeholder="NOR-BLS-001"
                />
              </label>
            </div>

            {price && costPrice && (
              <div className="mt-6 rounded-xl bg-[#FAF6F2] p-5">
                <p className="text-xs text-[#756862]">
                  Estimated profit per item
                </p>

                <p className="mt-1 text-2xl font-semibold text-[#8F6259]">
                  {(Number(price) - Number(costPrice)).toFixed(2)} EGP
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#E5DDD8] bg-white p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl">
                  Product Images
                </h2>

                <p className="mt-1 text-xs text-[#756862]">
                  Upload up to 8 images from your phone or computer.
                </p>
              </div>

              <ImagePlus
                size={24}
                className="text-[#B9897D]"
              />
            </div>

            <label className="mt-6 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#DCCAC3] bg-[#FAF6F2] p-6 text-center transition hover:border-[#B9897D]">
              <ImagePlus
                size={32}
                className="text-[#B9897D]"
              />

              <p className="mt-3 text-sm font-medium">
                Click to upload product images
              </p>

              <p className="mt-1 text-xs text-[#756862]">
                JPG, PNG or WEBP
              </p>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImages}
                className="hidden"
              />
            </label>

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {images.map((image, index) => (
                  <div
                    key={image.url}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-[#E5DDD8]"
                  >
                    <img
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#3B302D] px-2 py-1 text-[9px] text-white">
                        PRIMARY
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-red-500 shadow"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {message && (
            <div className="rounded-xl border border-[#E5DDD8] bg-white p-4 text-sm">
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#3B302D] px-8 py-4 text-sm text-white transition hover:bg-[#B9897D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
