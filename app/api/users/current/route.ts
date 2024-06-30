import { prisma } from "@/lib/prisma";
import createServerSupabaseClient from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  try {
    const user = await prisma.user.findUnique({
      where: { id: session?.user.id },
    });

    if (!user) return NextResponse.next();

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching user from database" },
      { status: 500 }
    );
  }
}
