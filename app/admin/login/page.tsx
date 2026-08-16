"use client";

import { createClient } from "@/lib/supabase/client";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
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

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F3F0] px-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E5E0]">
            <LockKeyhole className="text-[#B9897D]" size={28} />
          </div>

          <p className="mt-5 text-xs tracking-[0.3em] text-[#B9897D]">
            NORSEEN COSMATICS
          </p>

          <h1 className="mt-2 font-serif text-3xl text-[#3B302D]">
            Merchant Login
          </h1>

          <p className="mt-2 text-sm text-[#756862]">
            Sign in to manage your store
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm text-[#3B302D]">
              Email
            </label>

            <div className="relative mt-2">
              <Mail
                size={18}
                className="absolute left-4 top-3.5 text-[#B9897D]"
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@norseen.com"
                className="w-full rounded-xl border border-[#E5DDD8] py-3 pl-11 pr-4 outline-none transition focus:border-[#B9897D]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[#3B302D]">
              Password
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-3.5 text-[#B9897D]"
              />

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#E5DDD8] py-3 pl-11 pr-4 outline-none transition focus:border-[#B9897D]"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B302D] py-4 text-sm font-medium text-white transition hover:bg-[#B9897D] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
