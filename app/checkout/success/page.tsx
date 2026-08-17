import Link from "next/link";

type Props = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: Props) {
  const params = await searchParams;
  const orderNumber = params.order || "N/A";

  return (
    <main className="min-h-screen bg-[#FAF6F2] text-[#3B302D]">
      <div className="bg-[#3B302D] px-4 py-2 text-center text-xs tracking-[0.2em] text-white">
        FREE SHIPPING ON ORDERS OVER 1000 EGP
      </div>

      <section className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="w-full max-w-xl bg-white px-8 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F3E5E0]">
            <span className="font-serif text-3xl text-[#B9897D]">
              ✓
            </span>
          </div>

          <p className="mt-8 text-xs tracking-[0.4em] text-[#B9897D]">
            NORSEEN COSMATICS
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            Order Confirmed
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#756862]">
            Thank you for your order. We have received your order
            and will contact you shortly to confirm delivery.
          </p>

          <div className="mt-8 border-y border-[#E8D8CC] py-6">
            <p className="text-xs tracking-[0.2em] text-[#756862]">
              ORDER NUMBER
            </p>

            <p className="mt-2 font-serif text-2xl">
              {orderNumber}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="bg-[#3B302D] px-8 py-4 text-xs tracking-[0.2em] text-white transition hover:bg-[#B9897D]"
            >
              CONTINUE SHOPPING
            </Link>

            <Link
              href="/"
              className="border border-[#B9897D] px-8 py-4 text-xs tracking-[0.2em] text-[#3B302D] transition hover:bg-[#F3E5E0]"
            >
              BACK HOME
            </Link>
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
