import { requireApiKey } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import createServerSupabaseClient from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const adminEmails =
  process.env
    .NEXT_PUBLIC_ADMIN_EMAILS!.split(",")
    .map((email) => email.trim().toLowerCase()) || [];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireApiKey(request);
  if (unauthorized) {
    return unauthorized;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (
      adminEmails.includes(user.email.toLowerCase()) &&
      user.role !== "admin"
    ) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "admin" },
      });
      user.role = "admin";
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching user from database" },
      { status: 500 }
    );
  }
}
