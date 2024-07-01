import { prisma } from "@/lib/prisma";
import createServerSupabaseClient from "@/lib/supabase/server";
import { generateAppointments } from "@/utils/appointmentGenerator";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  try {
    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
    });

    if (user?.role !== "admin") {
      return NextResponse.json({ error: "User is not an admin" });
    }
    await generateAppointments();
    return NextResponse.json({ message: "Appointments generated" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error generating appointments" },
      { status: 500 }
    );
  }
}
