"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  PackagePlus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  Package,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  cost_price: number;
  stock: number;
  sku: string | null;
  is_active: boolean;
  created_at: string;
};

export default function ProductsPage() {
  const supabase = createClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("products")
      .select(
        "id,name_ar,name_en,price,cost_price,stock,sku,is_active,created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return products;

    return products.filter((product) =>
      [
        product.name_ar,
        product.name_en,
        product.sku || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [products, search]);

  async function deleteProduct(id: string) {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن العملية."
    );

    if (!confirmed) return;

    setDeleting(id);
    setError("");

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      setError(error.message);
      setDeleting(null);
      return;
    }

    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );

    setDeleting(null);
  }

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock || 0),
    0
  );

  const estimatedProfit = products.reduce(
    (sum, product) =>
      sum +
      (Number(product.price) - Number(product.cost_price)) *
        Number(product.stock || 0),
    0
  );

  return (
    <main dir="rtl" className="min-h-screen bg-[#F7F3F0]">
      <header className="border-b border-[#E8DDD8] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <div>
            <p
              dir="ltr"
              className="text-xs tracking-[0.3em] text-[#B9897D]"
            >
              NORSEEN COSMATICS
            </p>

            <h1 className="mt-1 font-serif text-2xl text-[#3B302D]">
              إدارة المنتجات
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadProducts}
              className="rounded-xl border border-[#E5DDD8] bg-white p-3 text-[#756862] transition hover:border-[#B9897D]"
              title="تحديث"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
            </button>

            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 rounded-xl bg-[#3B302D] px-4 py-3 text-sm text-white transition hover:bg-[#B9897D]"
            >
              <PackagePlus size={18} />
              إضافة منتج
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="mb-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E8DDD8] bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#F7F3F0] p-3">
                <Package size={20} className="text-[#B9897D]" />
              </div>

              <div>
                <p className="text-xs text-[#756862]">
                  إجمالي المنتجات
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DDD8] bg-white p-5">
            <p className="text-xs text-[#756862]">
              إجمالي المخزون
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {totalStock}
            </p>
            <p className="mt-1 text-xs text-[#756862]">
              قطعة
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8DDD8] bg-white p-5">
            <p className="text-xs text-[#756862]">
              قيمة الربح المتوقع من المخزون
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#8F6259]">
              {estimatedProfit.toLocaleString("en-US")} EGP
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-[#E8DDD8] bg-white p-4">
          <div className="relative">
            <Search
              size={19}
              className="absolute right-4 top-3.5 text-[#B9897D]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم المنتج أو SKU..."
              className="w-full rounded-xl border border-[#E5DDD8] py-3 pr-11 pl-4 text-sm outline-none transition focus:border-[#B9897D]"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[#E8DDD8] bg-white">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <RefreshCw
                size={28}
                className="animate-spin text-[#B9897D]"
              />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
              <Package
                size={42}
                className="text-[#CBBAB3]"
              />

              <h2 className="mt-4 font-serif text-2xl">
                لا توجد منتجات
              </h2>

              <p className="mt-2 text-sm text-[#756862]">
                أضف أول منتج إلى متجر Norseen Cosmetics.
              </p>

              <Link
                href="/admin/products/new"
                className="mt-5 rounded-xl bg-[#B9897D] px-6 py-3 text-sm text-white"
              >
                إضافة أول منتج
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-right">
                  <thead className="border-b border-[#E8DDD8] bg-[#FCFAF9]">
                    <tr className="text-xs text-[#756862]">
                      <th className="px-5 py-4 font-medium">
                        المنتج
                      </th>
                      <th className="px-5 py-4 font-medium">
                        SKU
                      </th>
                      <th className="px-5 py-4 font-medium">
                        السعر
                      </th>
                      <th className="px-5 py-4 font-medium">
                        التكلفة
                      </th>
                      <th className="px-5 py-4 font-medium">
                        الربح
                      </th>
                      <th className="px-5 py-4 font-medium">
                        المخزون
                      </th>
                      <th className="px-5 py-4 font-medium">
                        الحالة
                      </th>
                      <th className="px-5 py-4 font-medium">
                        إجراءات
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => {
                      const profit =
                        Number(product.price) -
                        Number(product.cost_price);

                      return (
                        <tr
                          key={product.id}
                          className="border-b border-[#F0E9E5] last:border-0"
                        >
                          <td className="px-5 py-5">
                            <div>
                              <p className="font-medium text-[#3B302D]">
                                {product.name_ar}
                              </p>
                              <p
                                dir="ltr"
                                className="mt-1 text-xs text-[#756862]"
                              >
                                {product.name_en}
                              </p>
                            </div>
                          </td>

                          <td
                            dir="ltr"
                            className="px-5 py-5 text-sm text-[#756862]"
                          >
                            {product.sku || "—"}
                          </td>

                          <td className="px-5 py-5 text-sm font-medium">
                            {Number(product.price).toLocaleString()} EGP
                          </td>

                          <td className="px-5 py-5 text-sm text-[#756862]">
                            {Number(product.cost_price).toLocaleString()} EGP
                          </td>

                          <td className="px-5 py-5 text-sm font-medium text-[#8F6259]">
                            {profit.toLocaleString()} EGP
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={
                                product.stock <= 5
                                  ? "rounded-full bg-red-50 px-3 py-1 text-xs text-red-600"
                                  : "rounded-full bg-green-50 px-3 py-1 text-xs text-green-700"
                              }
                            >
                              {product.stock}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={
                                product.is_active
                                  ? "rounded-full bg-green-50 px-3 py-1 text-xs text-green-700"
                                  : "rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500"
                              }
                            >
                              {product.is_active
                                ? "نشط"
                                : "غير نشط"}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/products/${product.id}/edit`}
                                className="rounded-lg border border-[#E5DDD8] p-2 text-[#756862] transition hover:border-[#B9897D] hover:text-[#B9897D]"
                                title="تعديل"
                              >
                                <Pencil size={16} />
                              </Link>

                              <button
                                onClick={() =>
                                  deleteProduct(product.id)
                                }
                                disabled={deleting === product.id}
                                className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                title="حذف"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-[#F0E9E5] md:hidden">
                {filteredProducts.map((product) => {
                  const profit =
                    Number(product.price) -
                    Number(product.cost_price);

                  return (
                    <div key={product.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium">
                            {product.name_ar}
                          </h3>

                          <p
                            dir="ltr"
                            className="mt-1 text-xs text-[#756862]"
                          >
                            {product.name_en}
                          </p>

                          <p
                            dir="ltr"
                            className="mt-2 text-xs text-[#756862]"
                          >
                            SKU: {product.sku || "—"}
                          </p>
                        </div>

                        <span
                          className={
                            product.stock <= 5
                              ? "rounded-full bg-red-50 px-3 py-1 text-xs text-red-600"
                              : "rounded-full bg-green-50 px-3 py-1 text-xs text-green-700"
                          }
                        >
                          {product.stock}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-xl bg-[#FCFAF9] p-3">
                          <p className="text-[10px] text-[#756862]">
                            السعر
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {Number(product.price).toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#FCFAF9] p-3">
                          <p className="text-[10px] text-[#756862]">
                            التكلفة
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {Number(product.cost_price).toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#FCFAF9] p-3">
                          <p className="text-[10px] text-[#756862]">
                            الربح
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#8F6259]">
                            {profit.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E5DDD8] py-3 text-sm"
                        >
                          <Pencil size={16} />
                          تعديل
                        </Link>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          disabled={deleting === product.id}
                          className="flex items-center justify-center gap-2 rounded-xl border border-red-100 px-5 py-3 text-sm text-red-500"
                        >
                          <Trash2 size={16} />
                          حذف
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
