import { prisma } from "@/lib/prisma";
import createServerSupabaseClient from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  const userId = session.user.id;

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        userId,
        status: "booked",
      },
      orderBy: {
        dateTime: "desc",
      },
    });

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error retrieving user appointments" },
      { status: 500 }
    );
  }
}
