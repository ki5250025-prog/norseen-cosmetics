"use client";

import Link from "next/link";
import { 
  PackagePlus,
  Package,
  Tags,
  Truck,
  ShoppingBag,
  TrendingUp,
  ArrowLeft,
  LogOut
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const items = [
  {
    title: "إضافة منتج",
    description: "أضف منتج جديد بالصور والسعر والمخزون",
    href: "/admin/products/new",
    icon: PackagePlus,
    featured: true,
  },
  {
    title: "المنتجات",
    description: "تعديل وحذف وإدارة جميع المنتجات",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "الأقسام",
    description: "إدارة أقسام ومنتجات المتجر",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    title: "الشحن",
    description: "تعديل أسعار الشحن والمناطق",
    href: "/admin/shipping",
    icon: Truck,
  },
  {
    title: "الطلبات",
    description: "متابعة وإدارة طلبات العملاء",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "الأرباح والتحليلات",
    description: "متابعة المبيعات والأرباح الشهرية",
    href: "/admin/analytics",
    icon: TrendingUp,
  },
];

export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F7F3F0]"
    >
      <header className="border-b border-[#E8DDD8] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <div>
            <p
              dir="ltr"
              className="text-xs tracking-[0.3em] text-[#B9897D]"
            >
              NORSEEN COSMATICS
            </p>

            <h1 className="mt-1 font-serif text-2xl text-[#3B302D] md:text-3xl">
              لوحة تحكم التاجر
            </h1>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-[#E5DDD8] px-4 py-2.5 text-sm text-[#756862] transition hover:border-[#B9897D] hover:text-[#B9897D]"
          >
            <LogOut size={17} />
            تسجيل الخروج
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#3B302D]">
            أهلاً بيك 👋
          </h2>

          <p className="mt-1 text-sm text-[#756862]">
            من هنا تقدر تدير متجر Norseen Cosmetics بالكامل.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["المبيعات", "0 EGP"],
            ["الطلبات", "0"],
            ["المنتجات", "0"],
            ["صافي الأرباح", "0 EGP"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-[#E8DDD8] bg-white p-5"
            >
              <p className="text-xs text-[#756862]">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#3B302D]">
                {value}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mb-4 font-serif text-2xl text-[#3B302D]">
          إدارة المتجر
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg ${
                  item.featured
                    ? "border-[#B9897D] bg-[#B9897D] text-white"
                    : "border-[#E8DDD8] bg-white text-[#3B302D]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      item.featured
                        ? "bg-white/15"
                        : "bg-[#F7F3F0]"
                    }`}
                  >
                    <Icon
                      size={24}
                      className={
                        item.featured
                          ? "text-white"
                          : "text-[#B9897D]"
                      }
                    />
                  </div>

                  <ArrowLeft
                    size={20}
                    className={`transition group-hover:-translate-x-1 ${
                      item.featured
                        ? "text-white"
                        : "text-[#B9897D]"
                    }`}
                  />
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  {item.title}
                </h3>

                <p
                  className={`mt-2 text-sm leading-6 ${
                    item.featured
                      ? "text-white/80"
                      : "text-[#756862]"
                  }`}
                >
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
