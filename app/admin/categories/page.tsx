"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

type Category = {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  is_active: boolean;
};

export default function CategoriesPage() {
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    setCategories(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function addCategory() {
    if (!nameAr || !nameEn || !slug) {
      alert("اكتبي اسم القسم بالعربي والإنجليزي والـSlug");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("categories").insert({
      name_ar: nameAr,
      name_en: nameEn,
      slug: slug.toLowerCase().trim().replace(/\s+/g, "-"),
      is_active: true,
    });

    if (error) {
      alert(error.message);
    } else {
      setNameAr("");
      setNameEn("");
      setSlug("");
      await loadCategories();
    }

    setSaving(false);
  }

  async function deleteCategory(id: string) {
    if (!confirm("هل أنت متأكد من حذف القسم؟")) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadCategories();
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F7F3F0]">
      <header className="border-b border-[#E8DDD8] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <div>
            <p
              dir="ltr"
              className="text-xs tracking-[0.3em] text-[#B9897D]"
            >
              NORSEEN COSMETICS
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-[#3B302D]">
              إدارة الأقسام
            </h1>
          </div>

          <a
            href="/admin"
            className="rounded-xl border border-[#E5DDD8] bg-white px-4 py-2 text-sm text-[#756862]"
          >
            لوحة التحكم
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-5 py-8">

        {/* Add Category */}
        <section className="rounded-2xl border border-[#E8DDD8] bg-white p-6">
          <div className="mb-5 flex items-center gap-2">
            <Plus size={20} className="text-[#B9897D]" />
            <h2 className="text-lg font-semibold text-[#3B302D]">
              إضافة قسم جديد
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="اسم القسم بالعربي"
              className="rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
            />

            <input
              dir="ltr"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Category Name"
              className="rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
            />

            <input
              dir="ltr"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="slug مثال: skincare"
              className="rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
            />
          </div>

          <button
            onClick={addCategory}
            disabled={saving}
            className="mt-5 flex items-center gap-2 rounded-xl bg-[#3B302D] px-6 py-3 text-sm text-white hover:bg-[#B9897D] disabled:opacity-50"
          >
            {saving && <Loader2 size={17} className="animate-spin" />}
            إضافة القسم
          </button>
        </section>

        {/* Categories */}
        <section className="rounded-2xl border border-[#E8DDD8] bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-[#3B302D]">
            الأقسام الحالية
          </h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-[#B9897D]" />
            </div>
          ) : categories.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#8A7B75]">
              لا توجد أقسام حتى الآن
            </p>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col gap-4 rounded-xl border border-[#E8DDD8] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-[#3B302D]">
                      {category.name_ar}
                    </h3>

                    <p dir="ltr" className="text-sm text-[#8A7B75]">
                      {category.name_en} · {category.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/admin/categories/edit?id=${category.id}`}
                      className="rounded-lg border border-[#E5DDD8] p-2 text-[#756862] hover:bg-[#F7F3F0]"
                      title="تعديل"
                    >
                      <Pencil size={17} />
                    </a>

                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                      title="حذف"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
