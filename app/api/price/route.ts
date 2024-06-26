import { prisma } from "@/lib/prisma";
import createServerSupabaseClient from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const price = await prisma.price.findFirst();
    return NextResponse.json({ price: price?.amount || 0 });
  } catch (error) {
    console.error("(SERVER)Error fetching price:", error);
    return NextResponse.json(
      { error: "Error fetching price" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findFirst({ where: { id: session.user.id } });

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const { price } = await request.json();
    const updatedPrice = await prisma.price.upsert({
      where: { id: 1 },
      update: { amount: price },
      create: { amount: price },
    });
    return NextResponse.json({ price: updatedPrice.amount });
  } catch (error) {
    console.error("Error updating price:", error);
    return NextResponse.json(
      { error: "Error updating price" },
      { status: 500 }
    );
  }
}
