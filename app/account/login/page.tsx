"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CustomerLoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/shop");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#FAF6F2] px-5 py-16 text-[#3B302D]">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <p className="text-xs tracking-[0.3em] text-[#B9897D]">
            NORSEEN COSMATICS
          </p>

          <h1 className="mt-3 font-serif text-4xl">
            Welcome Back
          </h1>

          <p className="mt-3 text-sm text-[#756862]">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm">Email</label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
            />
          </div>

          <div>
            <label className="text-sm">Password</label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-[#E5DDD8] px-4 py-3 outline-none focus:border-[#B9897D]"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#3B302D] py-4 text-sm text-white transition hover:bg-[#B9897D] disabled:opacity-60"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#756862]">
          Don't have an account?{" "}
          <Link
            href="/account/signup"
            className="text-[#B9897D] underline"
          >
            Create one
          </Link>
        </p>

        <div className="mt-6 text-center">
          <Link
            href="/shop"
            className="text-xs tracking-widest text-[#756862] hover:text-[#3B302D]"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </main>
  );
}
