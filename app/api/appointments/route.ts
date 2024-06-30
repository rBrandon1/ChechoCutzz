"use server";
import { prisma } from "@/lib/prisma";
import createServerSupabaseClient from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  try {
    let appointments;
    const user = await prisma.user.findUnique({
      where: { id: session?.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "admin") {
      // Admin can see all appointments
      appointments = await prisma.appointment.findMany();
    } else {
      // Regular user can only see their appointments
      appointments = await prisma.appointment.findMany({
        where: {
          status: "available",
        },
      });
    }

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error retrieving appointments" },
      { status: 500 }
    );
  }
}
