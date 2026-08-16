import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ count: 0 });
  }

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!cart) {
    return NextResponse.json({ count: 0 });
  }

  const { data: items } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("cart_id", cart.id);

  const count =
    items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return NextResponse.json({ count });
}
