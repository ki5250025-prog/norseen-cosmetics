"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user && pathname !== "/admin/login") {
        router.replace("/admin/login");
        return;
      }

      setChecking(false);
    }

    checkAuth();
  }, [pathname, router, supabase]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F3F0]">
        <div className="text-sm text-[#8F6259]">
          Loading...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
