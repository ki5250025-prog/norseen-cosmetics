import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      fullName,
      phone,
      governorate,
      address,
      paymentMethod,
    } = body;

    if (!fullName || !phone || !governorate || !address) {
      return NextResponse.json(
        { error: "Please complete all delivery information." },
        { status: 400 }
      );
    }

    const { data: result, error } = await supabase.rpc(
      "create_checkout_order",
      {
        p_full_name: fullName,
        p_phone: phone,
        p_governorate: governorate,
        p_address: address,
        p_payment_method: paymentMethod || "cash_on_delivery",
      }
    );

    if (error) {
      throw error;
    }

    return NextResponse.json(result);

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
    });
  } catch (error: any) {
    console.error("CHECKOUT API ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Something went wrong while placing your order.",
      },
      { status: 500 }
    );
  }
}
