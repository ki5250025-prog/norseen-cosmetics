import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF6F2] text-[#3B302D]">
      {/* Announcement Bar */}
      <div className="bg-[#3B302D] px-4 py-2 text-center text-xs tracking-[0.2em] text-white">
        FREE SHIPPING ON ORDERS OVER 1000 EGP
      </div>

      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2">
          <div className="max-w-xl">
            <p className="mb-5 text-xs tracking-[0.4em] text-[#B9897D]">
              BEAUTY THAT INSPIRES
            </p>

            <h1 className="font-serif text-5xl leading-tight md:text-7xl">
              Discover Your
              <span className="block italic text-[#B9897D]">
                Signature Beauty
              </span>
            </h1>

            <p className="mt-7 max-w-md text-sm leading-7 text-[#6D5C56]">
              Premium beauty essentials designed to make every moment feel
              extraordinary.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button className="bg-[#3B302D] px-8 py-4 text-xs tracking-[0.2em] text-white transition hover:bg-[#B9897D]">
                SHOP NOW
              </button>

              <button className="border border-[#B9897D] px-8 py-4 text-xs tracking-[0.2em] text-[#3B302D] transition hover:bg-[#B9897D] hover:text-white">
                EXPLORE COLLECTION
              </button>
            </div>
          </div>

          <div className="relative flex min-h-[500px] items-center justify-center">
            <div className="absolute h-[420px] w-[420px] rounded-full bg-[#F3D9D5] blur-3xl" />

            <div className="relative flex h-[460px] w-[360px] items-center justify-center border border-[#D8B5AA]/50 bg-gradient-to-b from-[#F3D9D5] to-[#E8D8CC] shadow-2xl">
              <div className="text-center">
                <div className="font-serif text-8xl text-[#B9897D]">N</div>
                <div className="mt-2 text-xs tracking-[0.5em]">
                  NORSEEN
                </div>
                <div className="mt-2 text-[8px] tracking-[0.35em]">
                  COSMATICS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Introduction */}
      <section className="border-y border-[#E8D8CC] bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs tracking-[0.4em] text-[#B9897D]">
            THE NORSEEN STORY
          </p>

          <h2 className="mt-5 font-serif text-4xl md:text-5xl">
            Beauty, Reimagined.
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-[#6D5C56]">
            At Norseen, beauty is more than a look. It is confidence,
            elegance, and the little details that make you feel uniquely you.
          </p>

          <button className="mt-8 border-b border-[#B9897D] pb-2 text-xs tracking-[0.2em]">
            DISCOVER OUR STORY
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-xs tracking-[0.4em] text-[#B9897D]">
            EXPLORE
          </p>

          <h2 className="mt-4 font-serif text-4xl">
            Shop By Category
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "MAKEUP",
            "SKINCARE",
            "LIPS",
            "BEAUTY TOOLS",
          ].map((category) => (
            <div
              key={category}
              className="group relative flex h-72 cursor-pointer items-end overflow-hidden bg-[#F3D9D5] p-6 transition hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#3B302D]/60 to-transparent" />

              <div className="relative z-10 text-white">
                <p className="text-xs tracking-[0.25em]">
                  NORSEEN
                </p>

                <h3 className="mt-2 font-serif text-2xl">
                  {category}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#F3D9D5] px-6 py-24 text-center">
        <p className="text-xs tracking-[0.4em] text-[#B9897D]">
          JOIN THE NORSEEN WORLD
        </p>

        <h2 className="mt-4 font-serif text-4xl">
          Stay in the Glow
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#6D5C56]">
          Be the first to discover new launches, exclusive offers and beauty
          inspiration.
        </p>

        <div className="mx-auto mt-8 flex max-w-md">
          <input
            type="email"
            placeholder="Your email address"
            className="min-w-0 flex-1 border border-[#D8B5AA] bg-white px-5 py-4 text-sm outline-none"
          />

          <button className="bg-[#3B302D] px-6 text-xs tracking-widest text-white">
            JOIN
          </button>
        </div>
      </section>

      {/* Footer */}
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