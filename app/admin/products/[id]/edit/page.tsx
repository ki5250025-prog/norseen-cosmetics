"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function EditProductPage() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    price: "",
    cost_price: "",
    original_price: "",
    stock: "",
    low_stock_threshold: "5",
    sku: "",
    is_active: true,
    is_featured: false,
    is_best_seller: false,
    is_new_arrival: false,
  });

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setForm({
        name_ar: data.name_ar || "",
        name_en: data.name_en || "",
        description_ar: data.description_ar || "",
        description_en: data.description_en || "",
        price: String(data.price ?? ""),
        cost_price: String(data.cost_price ?? ""),
        original_price: String(data.original_price ?? ""),
        stock: String(data.stock ?? ""),
        low_stock_threshold: String(data.low_stock_threshold ?? 5),
        sku: data.sku || "",
        is_active: Boolean(data.is_active),
        is_featured: Boolean(data.is_featured),
        is_best_seller: Boolean(data.is_best_seller),
        is_new_arrival: Boolean(data.is_new_arrival),
      });

      setLoading(false);
    }

    loadProduct();
  }, [id]);

  function updateField(name: string, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function saveProduct() {
    setSaving(true);
    setError("");

    const { error } = await supabase
      .from("products")
      .update({
        name_ar: form.name_ar,
        name_en: form.name_en,
        description_ar: form.description_ar || null,
        description_en: form.description_en || null,
        price: Number(form.price),
        cost_price: Number(form.cost_price),
        original_price: form.original_price
          ? Number(form.original_price)
          : null,
        stock: Number(form.stock),
        low_stock_threshold: Number(form.low_stock_threshold),
        sku: form.sku || null,
        is_active: form.is_active,
        is_featured: form.is_featured,
        is_best_seller: form.is_best_seller,
        is_new_arrival: form.is_new_arrival,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  async function deleteProduct() {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف المنتج نهائيًا؟"
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      setDeleting(false);
      return;
    }

    router.push("/admin/products");
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
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <div>
            <p
              dir="ltr"
              className="text-xs tracking-[0.3em] text-[#B9897D]"
            >
              NORSEEN COSMATICS
            </p>

            <h1 className="mt-1 font-serif text-2xl text-[#3B302D]">
              تعديل المنتج
            </h1>
          </div>

          <Link
            href="/admin/products"
            className="flex items-center gap-2 rounded-xl border border-[#E5DDD8] bg-white px-4 py-2.5 text-sm text-[#756862]"
          >
            <ArrowRight size={17} />
            المنتجات
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Info */}
          <section className="rounded-2xl border border-[#E8DDD8] bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold text-[#3B302D]">
              بيانات المنتج
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="اسم المنتج بالعربي"
                value={form.name_ar}
                onChange={(v) => updateField("name_ar", v)}
              />

              <Field
                label="Product Name"
                value={form.name_en}
                dir="ltr"
                onChange={(v) => updateField("name_en", v)}
              />

              <TextArea
                label="الوصف بالعربي"
                value={form.description_ar}
                onChange={(v) => updateField("description_ar", v)}
              />

              <TextArea
                label="Description"
                value={form.description_en}
                dir="ltr"
                onChange={(v) => updateField("description_en", v)}
              />
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-2xl border border-[#E8DDD8] bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold text-[#3B302D]">
              الأسعار والمخزون
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="سعر البيع"
                type="number"
                value={form.price}
                onChange={(v) => updateField("price", v)}
              />

              <Field
                label="سعر التكلفة"
                type="number"
                value={form.cost_price}
                onChange={(v) => updateField("cost_price", v)}
              />

              <Field
                label="السعر قبل الخصم"
                type="number"
                value={form.original_price}
                onChange={(v) => updateField("original_price", v)}
              />

              <Field
                label="المخزون"
                type="number"
                value={form.stock}
                onChange={(v) => updateField("stock", v)}
              />

              <Field
                label="حد المخزون المنخفض"
                type="number"
                value={form.low_stock_threshold}
                onChange={(v) =>
                  updateField("low_stock_threshold", v)
                }
              />

              <Field
                label="SKU"
                value={form.sku}
                dir="ltr"
                onChange={(v) => updateField("sku", v)}
              />
            </div>
          </section>

          {/* Status */}
          <section className="rounded-2xl border border-[#E8DDD8] bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold text-[#3B302D]">
              إعدادات الظهور
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <Toggle
                label="منتج نشط"
                checked={form.is_active}
                onChange={(v) => updateField("is_active", v)}
              />

              <Toggle
                label="منتج مميز"
                checked={form.is_featured}
                onChange={(v) => updateField("is_featured", v)}
              />

              <Toggle
                label="الأكثر مبيعًا"
                checked={form.is_best_seller}
                onChange={(v) => updateField("is_best_seller", v)}
              />

              <Toggle
                label="وصل حديثًا"
                checked={form.is_new_arrival}
                onChange={(v) => updateField("is_new_arrival", v)}
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              onClick={deleteProduct}
              disabled={deleting || saving}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={18} />
              {deleting ? "جاري الحذف..." : "حذف المنتج"}
            </button>

            <button
              onClick={saveProduct}
              disabled={saving || deleting}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#3B302D] px-8 py-3 text-sm text-white hover:bg-[#B9897D] disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
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
        className="w-full rounded-xl border border-[#E5DDD8] px-4 py-3 text-sm outline-none transition focus:border-[#B9897D]"
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full resize-none rounded-xl border border-[#E5DDD8] px-4 py-3 text-sm outline-none transition focus:border-[#B9897D]"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#E8DDD8] p-4">
      <span className="text-sm text-[#3B302D]">{label}</span>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-[#B9897D]" : "bg-[#D9D0CC]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "right-1" : "right-6"
          }`}
        />
      </button>
    </label>
  );
}
