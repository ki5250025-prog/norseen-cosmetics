"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Truck,
  X,
  Save,
} from "lucide-react";

type ShippingZone = {
  id: string;
  name_ar: string;
  name_en: string;
  shipping_price: number;
  free_shipping_threshold: number | null;
  estimated_delivery: string | null;
  is_active: boolean;
};

export default function ShippingPage() {
  const supabase = createClient();

  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [shippingPrice, setShippingPrice] = useState("");
  const [freeShipping, setFreeShipping] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [isActive, setIsActive] = useState(true);

  async function loadZones() {
    const { data, error } = await supabase
      .from("shipping_zones")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setZones(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadZones();
  }, []);

  function resetForm() {
    setEditingId(null);
    setNameAr("");
    setNameEn("");
    setShippingPrice("");
    setFreeShipping("");
    setEstimatedDelivery("");
    setIsActive(true);
  }

  function editZone(zone: ShippingZone) {
    setEditingId(zone.id);
    setNameAr(zone.name_ar);
    setNameEn(zone.name_en);
    setShippingPrice(String(zone.shipping_price ?? ""));
    setFreeShipping(
      zone.free_shipping_threshold !== null
        ? String(zone.free_shipping_threshold)
        : ""
    );
    setEstimatedDelivery(zone.estimated_delivery || "");
    setIsActive(zone.is_active);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveZone() {
    if (!nameAr || !nameEn || shippingPrice === "") {
      alert("من فضلك املأ اسم المنطقة وسعر الشحن");
      return;
    }

    setSaving(true);

    const payload = {
      name_ar: nameAr,
      name_en: nameEn,
      shipping_price: Number(shippingPrice),
      free_shipping_threshold:
        freeShipping === "" ? null : Number(freeShipping),
      estimated_delivery: estimatedDelivery || null,
      is_active: isActive,
    };

    if (editingId) {
      const { error } = await supabase
        .from("shipping_zones")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        alert(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("shipping_zones")
        .insert(payload);

      if (error) {
        alert(error.message);
        setSaving(false);
        return;
      }
    }

    resetForm();
    await loadZones();
    setSaving(false);
  }

  async function deleteZone(id: string) {
    if (!confirm("هل أنت متأكد من حذف منطقة الشحن؟")) return;

    const { error } = await supabase
      .from("shipping_zones")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadZones();
  }

  async function toggleActive(zone: ShippingZone) {
    const { error } = await supabase
      .from("shipping_zones")
      .update({ is_active: !zone.is_active })
      .eq("id", zone.id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadZones();
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

            <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold text-[#3B302D]">
              <Truck size={25} />
              إدارة الشحن
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

        {/* Form */}
        <section className="rounded-2xl border border-[#E8DDD8] bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#3B302D]">
              {editingId ? <Pencil size={19} /> : <Plus size={19} />}
              {editingId ? "تعديل منطقة الشحن" : "إضافة منطقة شحن"}
            </h2>

            {editingId && (
              <button
                onClick={resetForm}
                className="flex items-center gap-1 text-sm text-[#756862]"
              >
                <X size={17} />
                إلغاء
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="اسم المنطقة بالعربي - مثال: القاهرة"
              className="rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
            />

            <input
              dir="ltr"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Area Name - Cairo"
              className="rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
            />

            <div>
              <label className="mb-2 block text-sm text-[#3B302D]">
                سعر الشحن
              </label>

              <input
                type="number"
                min="0"
                value={shippingPrice}
                onChange={(e) => setShippingPrice(e.target.value)}
                placeholder="مثال: 50"
                className="w-full rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#3B302D]">
                الشحن مجاني عند
              </label>

              <input
                type="number"
                min="0"
                value={freeShipping}
                onChange={(e) => setFreeShipping(e.target.value)}
                placeholder="مثال: 1000"
                className="w-full rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#3B302D]">
                مدة التوصيل
              </label>

              <input
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                placeholder="مثال: 2 - 4 أيام"
                className="w-full rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5DDD8] px-4 py-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-5 w-5 accent-[#B9897D]"
              />

              <span className="text-sm text-[#3B302D]">
                منطقة الشحن مفعلة
              </span>
            </label>
          </div>

          <button
            onClick={saveZone}
            disabled={saving}
            className="mt-5 flex items-center gap-2 rounded-xl bg-[#3B302D] px-6 py-3 text-sm text-white hover:bg-[#B9897D] disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : editingId ? (
              <Save size={18} />
            ) : (
              <Plus size={18} />
            )}

            {saving
              ? "جاري الحفظ..."
              : editingId
              ? "حفظ التعديلات"
              : "إضافة منطقة"}
          </button>
        </section>

        {/* Zones */}
        <section className="rounded-2xl border border-[#E8DDD8] bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-[#3B302D]">
            مناطق الشحن
          </h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-[#B9897D]" />
            </div>
          ) : zones.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#8A7B75]">
              لم تتم إضافة مناطق شحن بعد
            </p>
          ) : (
            <div className="space-y-3">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="rounded-xl border border-[#E8DDD8] p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="font-semibold text-[#3B302D]">
                        {zone.name_ar}
                      </h3>

                      <p dir="ltr" className="text-sm text-[#8A7B75]">
                        {zone.name_en}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                      <div>
                        <span className="block text-xs text-[#9A8C86]">
                          الشحن
                        </span>
                        <strong>{zone.shipping_price} EGP</strong>
                      </div>

                      <div>
                        <span className="block text-xs text-[#9A8C86]">
                          مجاني عند
                        </span>
                        <strong>
                          {zone.free_shipping_threshold
                            ? `${zone.free_shipping_threshold} EGP`
                            : "غير محدد"}
                        </strong>
                      </div>

                      <div>
                        <span className="block text-xs text-[#9A8C86]">
                          التوصيل
                        </span>
                        <strong>
                          {zone.estimated_delivery || "-"}
                        </strong>
                      </div>

                      <div>
                        <span className="block text-xs text-[#9A8C86]">
                          الحالة
                        </span>

                        <button
                          onClick={() => toggleActive(zone)}
                          className={
                            zone.is_active
                              ? "font-semibold text-green-600"
                              : "font-semibold text-red-500"
                          }
                        >
                          {zone.is_active ? "مفعلة" : "متوقفة"}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => editZone(zone)}
                        className="rounded-lg border border-[#E5DDD8] p-2 text-[#756862]"
                        title="تعديل"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteZone(zone.id)}
                        className="rounded-lg border border-red-200 p-2 text-red-500"
                        title="حذف"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
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
