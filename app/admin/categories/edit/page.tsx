"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Save, Upload, X } from "lucide-react";

export default function EditCategoryPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadCategory() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setNameAr(data.name_ar || "");
        setNameEn(data.name_en || "");
        setSlug(data.slug || "");
        setDescriptionAr(data.description_ar || "");
        setDescriptionEn(data.description_en || "");
        setImageUrl(data.image_url || "");
        setIsActive(data.is_active);
        setSortOrder(String(data.sort_order ?? 0));
      }

      setLoading(false);
    }

    loadCategory();
  }, [id]);

  async function saveCategory() {
    if (!id || !nameAr || !nameEn || !slug) {
      setError("من فضلك املأ البيانات المطلوبة");
      return;
    }

    setSaving(true);
    setError("");

    let finalImageUrl = imageUrl;

    if (imageFile) {
      const extension = imageFile.name.split(".").pop();
      const fileName = `${id}-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("category-images")
        .upload(fileName, imageFile, {
          upsert: true,
          contentType: imageFile.type,
        });

      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from("category-images")
        .getPublicUrl(fileName);

      finalImageUrl = data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("categories")
      .update({
        name_ar: nameAr,
        name_en: nameEn,
        slug: slug.toLowerCase().trim().replace(/\s+/g, "-"),
        description_ar: descriptionAr || null,
        description_en: descriptionEn || null,
        image_url: finalImageUrl || null,
        is_active: isActive,
        sort_order: Number(sortOrder),
      })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F3F0]">
        <Loader2 className="animate-spin text-[#B9897D]" size={30} />
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F7F3F0]">
      <header className="border-b border-[#E8DDD8] bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5">
          <div>
            <p
              dir="ltr"
              className="text-xs tracking-[0.3em] text-[#B9897D]"
            >
              NORSEEN COSMETICS
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-[#3B302D]">
              تعديل القسم
            </h1>
          </div>

          <button
            onClick={() => router.push("/admin/categories")}
            className="flex items-center gap-2 rounded-xl border border-[#E5DDD8] px-4 py-2 text-sm"
          >
            <X size={17} />
            رجوع
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <section className="rounded-2xl border border-[#E8DDD8] bg-white p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="اسم القسم بالعربي *"
                value={nameAr}
                onChange={setNameAr}
              />

              <Field
                label="Category Name *"
                value={nameEn}
                onChange={setNameEn}
                dir="ltr"
              />

              <Field
                label="Slug *"
                value={slug}
                onChange={setSlug}
                dir="ltr"
              />

              <Field
                label="ترتيب الظهور"
                value={sortOrder}
                onChange={setSortOrder}
                type="number"
              />

              <TextArea
                label="الوصف بالعربي"
                value={descriptionAr}
                onChange={setDescriptionAr}
              />

              <TextArea
                label="Description"
                value={descriptionEn}
                onChange={setDescriptionEn}
                dir="ltr"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[#E8DDD8] bg-white p-6">
            <label className="mb-3 block text-sm font-medium text-[#3B302D]">
              صورة القسم
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={nameAr}
                  className="h-28 w-28 rounded-xl object-cover"
                />
              )}

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#B9897D] px-6 py-4 text-sm text-[#8F6259]">
                <Upload size={18} />
                اختيار صورة

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] || null)
                  }
                />
              </label>

              {imageFile && (
                <span className="text-sm text-[#756862]">
                  {imageFile.name}
                </span>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E8DDD8] bg-white p-6">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium text-[#3B302D]">
                القسم نشط
              </span>

              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-5 w-5 accent-[#B9897D]"
              />
            </label>
          </section>

          <button
            onClick={saveCategory}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B302D] px-6 py-4 text-sm font-medium text-white hover:bg-[#B9897D] disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <Save size={19} />
            )}

            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-[#3B302D]">
        {label}
      </label>

      <input
        dir={dir}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-[#3B302D]">
        {label}
      </label>

      <textarea
        dir={dir}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
      />
    </div>
  );
}
